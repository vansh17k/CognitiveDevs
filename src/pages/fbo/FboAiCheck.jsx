import React, { useState, useRef } from 'react';
import { useApp } from '../../App.jsx';
import { 
  UploadCloud, 
  Camera, 
  Check, 
  ArrowLeft,
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  Shield,
  RefreshCw,
  Building2,
  CheckCircle2,
  Package,
  Layers,
  Tag,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { FboDashboard } from './FboDashboard.jsx';

export const FboAiCheck = () => {
  // Directly renders the enhanced, unified Pre-Release Compliance & Label Screening Dashboard
  return <FboDashboard />;
};
