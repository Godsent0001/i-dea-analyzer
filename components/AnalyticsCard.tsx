
import React from 'react';
import Tooltip from './Tooltip';
import { InfoIcon } from './icons/InfoIcon';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  rationale: string;
  tooltip: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, rationale, tooltip }) => {
  return (
    <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-400">{title}</h3>
        <Tooltip text={tooltip}>
          <InfoIcon className="w-4 h-4 text-slate-500" />
        </Tooltip>
      </div>
      <p className="text-2xl font-bold text-white mb-2">{value}</p>
      <p className="text-sm text-slate-400 flex-grow">{rationale}</p>
    </div>
  );
};

export default AnalyticsCard;
