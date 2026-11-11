import JSZip from 'jszip';
import { AVAILABLE_ROLES } from '../data/rolesAndQuestions';

export const ResumeParser = {
  validateFile(file) {
    const validExtensions = ['pdf', 'docx', 'txt', 'md'];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(extension)) {
      return {
        valid: false,
        error: `Unsupported file format '.${extension}'. Please upload a PDF, DOCX, TXT, or MD document.`
      };
    }

    if (file.size > 10 * 1024 * 1024) {
      return {
        valid: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds 10 MB limit.`
      };
    }

    return { valid: true };
  },

  async extractTextFromDocx(arrayBuffer) {
    try {
      const zip = await JSZip.loadAsync(arrayBuffer);
      const documentXml = await zip.file("word/document.xml")?.async("string");
      if (!documentXml) {
        throw new Error("Invalid DOCX format: word/document.xml not found.");
      }

      // Convert paragraph ends to newlines and strip XML tags
      const formatted = documentXml
        .replace(/<\/w:p>/g, '\n')
        .replace(/<w:t[^>]*>(.*?)<\/w:t>/g, '$1 ')
        .replace(/<[^>]+>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");

      return formatted.replace(/\n\s*\n/g, '\n').trim();
    } catch (e) {
      throw new Error(`Failed to extract text from DOCX: ${e.message}`);
    }
  },

  async extractTextFromPdf(arrayBuffer) {
    // Robust binary text stream reader for PDF
    const bytes = new Uint8Array(arrayBuffer);
    let raw = "";
    // Read printable chars & ISO-8859-1 mapping
    for (let i = 0; i < bytes.length; i++) {
      raw += String.fromCharCode(bytes[i]);
    }

    let textBuilder = "";
    // Find text objects (literal string Tj and TJ blocks)
    const tjRegex = /\(([^\\)]*(?:\\.[^\\)]*)*)\)\s*Tj/g;
    let match;
    while ((match = tjRegex.exec(raw)) !== null) {
      let literal = match[1]
        .replace(/\\([()\\])/g, '$1')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, ' ')
        .replace(/\\t/g, ' ');
      textBuilder += literal + " ";
    }

    if (textBuilder.length > 50) {
      return textBuilder.trim();
    }

    // Fallback: extract string lines from stream
    const lines = raw.split(/\r?\n/).filter(line => {
      return line.length > 10 && !line.startsWith('%') && !line.includes('obj') && !line.includes('endobj');
    });

    const printable = lines.join(' ').replace(/[^a-zA-Z0-9.,;: \n\t\-_/@()#]/g, ' ');
    return printable.trim();
  },

  async parseFile(file, targetRoleTitle = "Android Developer", jobDescription = "") {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const extension = file.name.split('.').pop().toLowerCase();
    let extractedText = "";

    try {
      if (extension === 'docx') {
        const buffer = await file.arrayBuffer();
        extractedText = await this.extractTextFromDocx(buffer);
      } else if (extension === 'pdf') {
        const buffer = await file.arrayBuffer();
        extractedText = await this.extractTextFromPdf(buffer);
      } else {
        // Plain text or markdown
        extractedText = await file.text();
      }

      const cleanText = extractedText.trim();
      if (cleanText.length < 30) {
        return {
          success: false,
          isScanned: true,
          error: "The uploaded file contains insufficient selectable text. If this is a scanned raster image PDF, OCR is not supported. Please paste your resume text directly."
        };
      }

      const normalizedSkills = this.extractAndNormalizeCompetencies(targetRoleTitle, jobDescription, cleanText);

      return {
        success: true,
        fileName: file.name,
        fileSizeKb: Math.max(1, Math.round(file.size / 1024)),
        text: cleanText,
        extractedSkills: normalizedSkills
      };
    } catch (err) {
      return {
        success: false,
        error: `Error parsing document: ${err.message}`
      };
    }
  },

  extractAndNormalizeCompetencies(roleTitle, jobDescription = "", resumeText = "") {
    const roleObj = AVAILABLE_ROLES.find(r => 
      r.title.toLowerCase() === roleTitle.toLowerCase() ||
      roleTitle.toLowerCase().includes(r.title.toLowerCase())
    );

    const baseCompetencies = roleObj ? roleObj.keyCompetencies : [
      "Core Engineering Fundamentals",
      "System Architecture & Scaling",
      "Performance Optimization",
      "Quality Assurance & Testing",
      "Production Problem Solving"
    ];

    const lowerResume = resumeText.toLowerCase();

    return baseCompetencies.map((name, idx) => {
      const keywords = name.toLowerCase().split(/[&/ ]/).map(s => s.trim()).filter(s => s.length > 3);
      const isClaimed = keywords.some(kw => lowerResume.includes(kw));

      let importance = "CORE";
      if (idx === 0) importance = "CRITICAL";
      else if (idx === 1 || idx === 2) importance = "HIGH";

      let criteria = "Demonstrates practical implementation syntax, failure mode resilience, and best-practice principles.";
      if (name.includes("Architecture")) {
        criteria = "Demonstrates clear modular separation, unidirectional data flow, and trade-off evaluation.";
      } else if (name.includes("Performance") || name.includes("Memory")) {
        criteria = "Explains diagnostic profiling tools, memory leak remediation, and frame rendering optimizations.";
      } else if (name.includes("Coroutines") || name.includes("Concurrency")) {
        criteria = "Covers thread safety, structured concurrency scopes, error handling, and cancellation propagation.";
      } else if (name.includes("Room") || name.includes("Persistence") || name.includes("Database")) {
        criteria = "Understands transactional boundaries, offline-first caching synchronization, and schema migrations.";
      }

      let category = "Engineering Architecture";
      if (name.includes("UI") || name.includes("Compose")) category = "UI & Layout";
      else if (name.includes("Data") || name.includes("Room") || name.includes("Database") || name.includes("SQL")) category = "Persistence & Data";
      else if (name.includes("Concurrency") || name.includes("Coroutines") || name.includes("asyncio") || name.includes("Multithreading")) category = "Concurrency";
      else if (name.includes("Performance") || name.includes("Memory") || name.includes("Optimization")) category = "Performance";

      return {
        id: `comp_${idx}`,
        name,
        category,
        importance,
        evidenceCriteria: criteria,
        isClaimedOnResume: isClaimed,
        status: isClaimed ? "CLAIMED_UNVALIDATED" : "NOT_ASSESSED"
      };
    });
  }
};
