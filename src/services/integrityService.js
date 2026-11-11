export class IntegrityTracker {
  constructor(onEventLogged) {
    this.onEventLogged = onEventLogged || (() => {});
    this.isEnabled = true;
    this.lastTypingTime = Date.now();
    this.events = [];
    this._handleVisibilityChange = this._handleVisibilityChange.bind(this);
    this._handleWindowBlur = this._handleWindowBlur.bind(this);
  }

  start() {
    this.isEnabled = true;
    if (typeof window !== 'undefined') {
      document.addEventListener("visibilitychange", this._handleVisibilityChange);
      window.addEventListener("blur", this._handleWindowBlur);
    }
  }

  stop() {
    this.isEnabled = false;
    if (typeof window !== 'undefined') {
      document.removeEventListener("visibilitychange", this._handleVisibilityChange);
      window.removeEventListener("blur", this._handleWindowBlur);
    }
  }

  _handleVisibilityChange() {
    if (!this.isEnabled) return;
    if (document.hidden) {
      this.recordEvent({
        type: "WINDOW_HIDDEN",
        title: "Tab Switched or Minimized",
        severity: "MEDIUM",
        confidence: 94,
        description: "Candidate navigated away from the active interview tab."
      });
    }
  }

  _handleWindowBlur() {
    if (!this.isEnabled) return;
    this.recordEvent({
      type: "WINDOW_FOCUS_LOST",
      title: "Window Focus Lost",
      severity: "LOW",
      confidence: 89,
      description: "Candidate browser window lost active system focus."
    });
  }

  recordPaste(charCount) {
    if (!this.isEnabled) return;
    if (charCount > 120) {
      this.recordEvent({
        type: "RAPID_PASTE_DETECTED",
        title: "Large Text Block Pasted",
        severity: charCount > 400 ? "HIGH" : "MEDIUM",
        confidence: 96,
        description: `Rapid text block insertion of ${charCount} characters detected in a single clipboard event.`
      });
    }
  }

  recordBurstTyping(durationSeconds, wordCount) {
    if (!this.isEnabled) return;
    if (durationSeconds < 3 && wordCount > 25) {
      this.recordEvent({
        type: "BURST_TYPING_ANOMALY",
        title: "High Typing Velocity Detected",
        severity: "MEDIUM",
        confidence: 85,
        description: `High submission velocity: ${wordCount} words registered in under ${durationSeconds} seconds.`
      });
    }
  }

  recordCameraInterruption(reason) {
    if (!this.isEnabled) return;
    this.recordEvent({
      type: "CAMERA_FEED_INTERRUPTED",
      title: "Camera Feed Interrupted",
      severity: "HIGH",
      confidence: 90,
      description: `Candidate video stream was interrupted: ${reason}`
    });
  }

  recordEvent(eventData) {
    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      isConfirmedViolation: false,
      recruiterReviewNotes: "",
      ...eventData
    };
    this.events.push(event);
    this.onEventLogged(event);
  }

  getEvents() {
    return [...this.events];
  }

  clear() {
    this.events = [];
  }
}

