import React from 'react';
import { Departure } from '../types';
import { formatTime, getDelayString, getMinutesUntil } from '../utils/time';
import { getLineAttributes } from '../utils/style';
import TransportIcon from './TransportIcon';

interface DepartureRowProps {
  departure: Departure;
}

const DepartureRow: React.FC<DepartureRowProps> = ({ departure }) => {
  const { category, number, to, stop } = departure;
  const platform = stop.prognosis.platform || stop.platform;
  
  const { bg, text } = getLineAttributes(category, number);
  
  // Format the content of the badge
  let badgeContent = number;
  const isTrain = ['IC', 'IR', 'RE', 'EC', 'ICE', 'RJX'].includes(category);
  const isSBahn = category === 'S' || category === 'SN';
  
  if (isSBahn && !number.startsWith('S')) {
      badgeContent = `S${number}`;
  } else if (isTrain) {
      if (number.length <= 2) {
          badgeContent = `${category}${number}`;
      } else {
          badgeContent = category; // Fallback to IC/IR if number is complex
      }
  }

  // CLEAN DESTINATION: Remove "Zürich" or "Zürich," prefix AND ", Bahnhof" suffix
  const cleanTo = to
    .replace(/^Zürich,?\s*/, '')
    .replace(/,\s*Bahnhof$/, '');

  // Calculate time display using ESTIMATED time
  // stop.prognosis.departure contains the real-time estimated departure.
  // We strictly prefer this over stop.departure (scheduled).
  const targetTime = stop.prognosis.departure || stop.departure;
  const minutes = getMinutesUntil(targetTime);
  const isImminent = minutes < 1;
  const delay = stop.delay;

  // Adjust font size based on length
  const fontSizeClass = badgeContent.length > 3 ? 'text-xs' : (badgeContent.length > 2 ? 'text-sm' : 'text-lg');

  return (
    <div className="group relative flex items-center p-3 rounded-xl mb-2 transition-all hover:bg-slate-800/60 bg-slate-800/30 border border-slate-700/30">
      
      {/* Colored Line Number Badge */}
      <div className="flex items-center justify-center w-12 mr-4 shrink-0">
        <div 
            style={{ backgroundColor: bg, color: text }}
            className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold shadow-sm ${fontSizeClass}`}
        >
            {badgeContent}
        </div>
      </div>

      {/* Destination & Platform */}
      <div className="flex-grow min-w-0 flex flex-col justify-center">
        <h3 className="text-sm md:text-base font-bold text-slate-100 truncate pr-2">
          {cleanTo}
        </h3>
        {platform && (
            <div className="flex items-center mt-1">
                <span className="text-[10px] bg-slate-700/50 px-1.5 py-0.5 rounded text-slate-300 font-medium">
                  Pl. {platform}
                </span>
            </div>
        )}
      </div>

      {/* Relative Time & Delay */}
      <div className="text-right shrink-0 min-w-[60px] flex justify-end">
        <div className="flex flex-col items-end justify-center">
           {isImminent ? (
               <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 animate-pulse text-red-400">
                   <TransportIcon category={category} className="w-5 h-5" />
               </div>
           ) : (
               <div className="flex items-baseline">
                   <span className="text-2xl font-bold text-white tracking-tight">
                     {minutes}
                   </span>
                   <span className="text-sm font-medium text-slate-400 ml-0.5">'</span>
               </div>
           )}
           
           {/* Delay Badge - Shows if delayed more than 0 minutes and not imminent (imminent implies now) */}
           {delay !== null && delay > 0 && !isImminent && (
              <span className="text-[10px] text-red-400 font-medium">
                 +{delay}'
              </span>
           )}
        </div>
      </div>
    </div>
  );
};

export default DepartureRow;
