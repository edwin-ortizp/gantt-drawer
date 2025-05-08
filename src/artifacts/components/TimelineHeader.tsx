import React from 'react';
import { formatWeekRange } from '../lib/utils';

interface TimelineHeaderProps {
  weeks: Date[];
  totalDuration: number;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ weeks, totalDuration }) => {
  // Asegurar que weeks es un array y que solo contiene fechas válidas
  const validWeeks = Array.isArray(weeks) 
    ? weeks.filter(date => date instanceof Date && !isNaN(date.getTime())) 
    : [];
  
  // Verificar que totalDuration es un número válido
  const validDuration = typeof totalDuration === 'number' && !isNaN(totalDuration) && totalDuration > 0
    ? totalDuration
    : validWeeks.length * 7; // Fallback: una semana = 7 días
  
  // Formatear rango de semanas de forma segura
  const safeFormatWeekRange = (weekStart: Date) => {
    try {
      return formatWeekRange(weekStart);
    } catch (error) {
      console.error("Error formateando rango de semana:", error);
      return "Semana";
    }
  };
  
  return (
    <div className="relative mb-6 pl-40">
      <div className="flex">
        {validWeeks.map((weekStart, index) => {
          try {
            const weekDuration = 7; // Una semana = 7 días
            const width = (weekDuration / validDuration) * 100;
            
            return (
              <div 
                key={index} 
                className="flex-shrink-0 px-1 border-r last:border-r-0 flex flex-col items-center"
                style={{ width: `${width}%` }}
              >
                <span 
                  className="text-sm font-medium text-gray-700 whitespace-nowrap"
                  style={{
                    // Mejor visualización de rangos de semanas
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '2px 4px',
                    borderRadius: '4px'
                  }}
                >
                  {safeFormatWeekRange(weekStart)}
                </span>
              </div>
            );
          } catch (error) {
            console.error("Error renderizando semana:", index, error);
            return null;
          }
        })}
      </div>
      
      <div className="h-px bg-gray-300 w-full mt-2"></div>
    </div>
  );
};

export default TimelineHeader;