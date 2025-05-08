import React from 'react';
import { TeamColors } from '../lib/types';

interface TimelineSummaryProps {
  minDate: Date;
  maxDate: Date;
  totalDuration: number;
  teams: string[];
  teamColors: TeamColors;
}

const TimelineSummary: React.FC<TimelineSummaryProps> = ({ 
  minDate, 
  maxDate, 
  totalDuration, 
  teams, 
  teamColors 
}) => {
  // Verificar que las fechas son válidas
  const isValidDate = (date: Date) => date instanceof Date && !isNaN(date.getTime());
  
  const validMinDate = isValidDate(minDate) ? minDate : new Date();
  const validMaxDate = isValidDate(maxDate) ? maxDate : new Date();
  const validDuration = typeof totalDuration === 'number' && !isNaN(totalDuration) 
    ? Math.round(totalDuration) 
    : 0;
  
  // Asegurar que teams es un array
  const validTeams = Array.isArray(teams) ? teams : [];
  
  // Formatear fechas de forma segura
  const formatDateSafe = (date: Date) => {
    try {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric' 
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "Fecha inválida";
    }
  };
  
  return (
    <div className="mt-10 border-t border-gray-200 pt-6">
      <div className="flex flex-wrap justify-between mb-6">
        <div className="mb-4 bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Fecha de inicio</div>
          <div className="text-lg font-bold text-gray-800">
            {formatDateSafe(validMinDate)}
          </div>
        </div>
        
        <div className="mb-4 bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Duración total</div>
          <div className="text-lg font-bold text-gray-800">
            {validDuration} días
          </div>
        </div>
        
        <div className="mb-4 bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Fecha de finalización</div>
          <div className="text-lg font-bold text-gray-800">
            {formatDateSafe(validMaxDate)}
          </div>
        </div>
      </div>
      
      {/* Leyenda de equipos */}
      {validTeams.length > 0 && (
        <div className="flex flex-wrap gap-6 justify-center p-4 bg-gray-50 rounded-lg">
          {validTeams.map(team => {
            const teamColor = teamColors && teamColors[team] 
              ? teamColors[team] 
              : { bg: "#E5F6FD", border: "#0EA5E9", text: "#0369A1" };
            
            return (
              <div key={team} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-sm" 
                  style={{ backgroundColor: teamColor.border }}
                ></div>
                <span className="font-medium">{team}</span>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Haz clic en una tarea para ver más detalles
      </div>
    </div>
  );
};

export default TimelineSummary;