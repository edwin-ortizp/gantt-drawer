import React from 'react';

interface TodayMarkerProps {
  position: number;
}

const TodayMarker: React.FC<TodayMarkerProps> = ({ position }) => {
  return (
    <div className="relative mb-8 mt-4 pl-40">
      <div className="h-px bg-gray-300 w-full"></div>
      <div className="relative h-6 mt-2">
        <div
          className="absolute"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">Hoy</span>
        </div>
      </div>
    </div>
  );
};

export default TodayMarker;