import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/views/HomeView';
import { CandidateDashboardView } from './components/views/CandidateDashboardView';
import { ResumeSetupView } from './components/views/ResumeSetupView';
import { InterviewStudioView } from './components/views/InterviewStudioView';
import { AssessmentReportView } from './components/views/AssessmentReportView';
import { RecruiterPipelineView } from './components/views/RecruiterPipelineView';
import { JobSpecsView } from './components/views/JobSpecsView';
import { ApiKeyModal } from './components/modals/ApiKeyModal';
import { DeploymentGuideModal } from './components/modals/DeploymentGuideModal';

export const App = () => {
  const { currentView } = useApp();

  const renderActiveView = () => {
    switch (currentView) {
      case "HOME":
        return <HomeView />;
      case "DASHBOARD":
        return <CandidateDashboardView />;
      case "RESUME":
        return <ResumeSetupView />;
      case "STUDIO":
        return <InterviewStudioView />;
      case "REPORT":
        return <AssessmentReportView />;
      case "RECRUITER":
        return <RecruiterPipelineView />;
      case "ROLES":
        return <JobSpecsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080C16] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <main className="flex-1 w-full">
        {renderActiveView()}
      </main>
      <Footer />
      <ApiKeyModal />
      <DeploymentGuideModal />
    </div>
  );
};
export default App;

