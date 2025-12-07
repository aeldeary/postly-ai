import React, { Component, useState, useCallback, useEffect, ErrorInfo, ReactNode } from 'react';
import { Tab, ProjectContextState, AppLanguage, Theme } from './types';
import Sidebar from './components/Sidebar';
import HomeView from './components/views/HomeView';
import CreatePostView from './components/views/CreatePostView';
import WebsiteContentView from './components/views/WebsiteContentView';
import AIImagesView from './components/views/AIImagesView';
import ProfessionalProductView from './components/views/ProfessionalProductView';
import PostlySpacesView from './components/views/PostlySpacesView';
import CreateVideoView from './components/views/CreateVideoView';
import CreateAudioView from './components/views/CreateAudioView'; 
import StyleTrainingView from './components/views/StyleTrainingView';
import ArchiveView from './components/views/ArchiveView';
import BrandKitView from './components/views/BrandKitView';
import IdeaGeneratorView from './components/views/IdeaGeneratorView'; 
import ChatBotView