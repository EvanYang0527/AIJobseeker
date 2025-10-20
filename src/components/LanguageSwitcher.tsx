import React from 'react';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        type="button"
        className="neuro-button-primary flex items-center px-4 py-2 rounded-neuro shadow-neuro"
        title="Change language"
      >
        <Globe className="w-4 h-4 mr-2" />
        <span className="font-semibold">Language</span>
      </button>
    </div>
  );
};
