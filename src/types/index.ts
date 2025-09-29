export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  location: string;
  role: 'user' | 'admin';
  selectedTrack?: 'entrepreneurship' | 'wage-employment';
  progress: {
    currentStep: number;
    completedSteps: string[];
    currentProgressBar?: number;
  };
  profile?: {
    businessIdea?: string;
    businessCategory?: string;
    experienceYears?: number;
    timeCommitment?: string;
    skillcraftResults?: any;
    careerLevel?: 'entry' | 'mid' | 'advanced';
    hasWorkExperience?: boolean;
  };
}

export interface TrackOption {
  id: 'entrepreneur' | 'wage_employment_early' | 'wage_employment_mid' | 'wage_employment_advanced';
  group: string;
  label: string;
  color: 'purple' | 'blue' | 'green' | 'pink';
  description: string;
  level?: string;
}

export interface ProcessStep {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  current: boolean;
  type: 'assessment' | 'track_selection' | 'progress_bar' | 'step';
  parentId?: string;
}

export interface ProgressStep {
  id: string;
  label: string;
  completed: boolean;
  current: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'lumina';
  message: string;
  timestamp: Date;
}

export interface AdminSettings {
  trackFeatures: {
    [key: string]: {
      enabled: boolean;
      mandatorySteps: string[];
      optionalSteps: string[];
    };
  };
  recommendationWeights: {
    [key: string]: number;
  };
}