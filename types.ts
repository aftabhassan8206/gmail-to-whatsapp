
export interface EmailContent {
  subject: string;
  body: string;
  isHtml: boolean;
}

export interface VisualSummary {
  headline: string;
  senderName: string;
  summary: string;
  bulletPoints: string[];
  themeColor: string;
  callToAction?: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
