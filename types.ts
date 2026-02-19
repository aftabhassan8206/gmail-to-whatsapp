
export interface EmailContent {
  subject: string;
  sender: string;
  html: string;
}

/**
 * Interface representing the visual metadata extracted from an email
 */
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
  CAPTURING = 'CAPTURING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
