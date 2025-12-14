import React from 'react';
import StationBoard from './components/StationBoard';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
      
      {/* Dynamic Background Image - Abstract Switzerland Landscape Vibe */}
      <div className="absolute inset-0 overflow-hidden z-0">
         <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>
      
      {/* Content */}
      <div className="z-10 w-full h-full">
        <StationBoard />
      </div>

    </div>
  );
};

export default App;
