
import React from 'react';
import Button from './Button';

interface ProjectChoicePromptProps {
  onChoice: (choice: 'new' | 'continue') => void;
}

const ProjectChoicePrompt: React.FC<ProjectChoicePromptProps> = ({ onChoice }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-[#0a1e3c]/80 border border-white/10 rounded-xl p-8 shadow-2xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-[#bf8339] mb-4">مرحباً بك في Postly AI</h2>
        <p className="text-white/80 mb-8">
          تم العثور على مشروع سابق. هل تود استكمال المشروع الحالي أم البدء بمشروع جديد؟
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="primary" onClick={() => onChoice('continue')}>
            استكمال المشروع الحالي
          </Button>
          <Button variant="secondary" onClick={() => onChoice('new')}>
            مشروع جديد
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectChoicePrompt;
