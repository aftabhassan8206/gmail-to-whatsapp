
import React from 'react';
import { VisualSummary } from '../types';

interface EmailCardProps {
  summary: VisualSummary;
  subject: string;
}

export const EmailCard: React.FC<EmailCardProps> = ({ summary, subject }) => {
  return (
    <div 
      id="email-screenshot-card"
      className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 font-sans"
    >
      <div 
        className="h-3 w-full" 
        style={{ backgroundColor: summary.themeColor }}
      ></div>
      
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Insight</span>
            <h2 className="text-2xl font-black text-gray-800 leading-tight mt-1">{summary.headline}</h2>
          </div>
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
             <span className="text-2xl" style={{ color: summary.themeColor }}>✉️</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-500 mb-1">From: {summary.senderName}</p>
          <p className="text-sm font-medium text-gray-400 italic">Re: {subject}</p>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl mb-6 border-l-4" style={{ borderColor: summary.themeColor }}>
          <p className="text-gray-700 leading-relaxed text-sm">
            {summary.summary}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {summary.bulletPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: summary.themeColor }}></div>
              <p className="text-sm text-gray-600 font-medium">{point}</p>
            </div>
          ))}
        </div>

        {summary.callToAction && (
          <div className="flex items-center justify-center p-3 rounded-lg border-2 border-dashed border-gray-200">
            <span className="text-xs font-bold text-gray-400 uppercase">Action: {summary.callToAction}</span>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center opacity-50">
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Generated via WhatsApp Bridge</span>
          <div className="flex gap-1">
             <div className="w-1 h-1 rounded-full bg-gray-300"></div>
             <div className="w-1 h-1 rounded-full bg-gray-300"></div>
             <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
