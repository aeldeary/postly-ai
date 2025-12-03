
import React from 'react';
import { ProjectContextState } from '../types';

interface ProjectContextValue extends ProjectContextState {
  updateProjectState: (updates: Partial<ProjectContextState>) => void;
}

const defaultState: ProjectContextValue = {
  topic: '',
  tone: '',
  language: 'العربية',
  dialect: '',
  industry: '',
  styleProfile: '',
  previousGenerations: [],
  appLanguage: 'ar',
  theme: 'dark',
  updateProjectState: () => {},
};

export const ProjectContext = React.createContext<ProjectContextValue>(defaultState);
