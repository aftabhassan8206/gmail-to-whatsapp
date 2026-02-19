
export interface RenderRequest {
  html: string;
  width?: number;
}

export interface RenderResponse {
  success: boolean;
  image?: string; // Base64 PNG
  error?: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

// Added VisualSummary interface to resolve import error in components/EmailCard.tsx
export interface VisualSummary {
  themeColor: string;
  headline: string;
  senderName: string;
  summary: string;
  bulletPoints: string[];
  callToAction?: string;
}
