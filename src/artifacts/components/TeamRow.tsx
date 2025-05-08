import React from 'react';
import { Task, TeamColor } from '../lib/types';
import { getTaskStyle } from '../lib/utils';
import TaskItem from './TaskItem';
import TaskDetail from './TaskDetail';

interface TeamRowProps {
  team: string;
  teamColor: TeamColor;
  teamData: (Task & { rowIndex?: number })[];
  minDate: Date;
  maxDate: Date;
  totalDuration: number;
  selectedTaskId: number | null;
  onTaskClick: (id: number) => void;
  weeks: Date[];
  todayPosition: number;
}

const TeamRow: React.FC<TeamRowProps> = ({ 
  team, 
  teamColor, 
  teamData, 
  minDate, 
  maxDate, 
  totalDuration,
  selectedTaskId,
  onTaskClick,
  weeks,
  todayPosition
}) => {
  // Protección contra errores en datos
  const safeTeamData = Array.isArray(teamData) ? teamData : [];
  
  // Calcular número de filas necesarias
  const rowCount = safeTeamData.length > 0 
    ? Math.max(...safeTeamData.map(task => (task.rowIndex || 0))) + 1 
    : 1;
    
  const laneHeight = Math.max(4, rowCount * 4 + 2) + 'rem';
  
  return (
    <div className="mb-12">
      <div className="flex">
        <div className="w-40 flex-shrink-0 pr-4 sticky left-0 z-10">
          <div 
            className="h-16 rounded-lg shadow-sm flex items-center justify-center font-bold text-lg bg-white"
            style={{ 
              backgroundColor: teamColor?.bg || '#E5F6FD', 
              color: teamColor?.text || '#0369A1',
              borderLeft: `4px solid ${teamColor?.border || '#0EA5E9'}`
            }}
          >
            {team || 'Sin equipo'}
          </div>
        </div>
        
        <div 
          className="flex-grow relative bg-gray-50 rounded-lg"
          style={{ height: laneHeight }}
        >
          {/* Línea vertical de "Hoy" */}
          {typeof todayPosition === 'number' && (
            <div
              className="absolute top-0 bottom-0"
              style={{ 
                left: `${todayPosition}%`, 
                width: '2px',
                backgroundColor: 'red', 
                opacity: 0.5, 
                zIndex: 0 
              }}
            ></div>
          )}
          
          {/* Líneas de separación de intervalos */}
          {Array.isArray(weeks) && weeks.map((intervalStart, index) => {
            // Verificar que intervalStart es una fecha válida
            if (!(intervalStart instanceof Date) || isNaN(intervalStart.getTime())) {
              return null;
            }
            
            try {
              const position = ((intervalStart.getTime() - minDate.getTime()) / 
                (maxDate.getTime() - minDate.getTime())) * 100;
                
              return index > 0 && (
                <div
                  key={index}
                  className="absolute top-0 bottom-0 w-px bg-gray-200"
                  style={{ left: `${position}%` }}
                ></div>
              );
            } catch (error) {
              console.error("Error renderizando línea de intervalo:", error);
              return null;
            }
          })}
          
          {/* Renderizado de tareas */}
          {safeTeamData.map(task => {
            if (!task || !task.id || !task.startDate || !task.endDate) {
              console.error("Tarea inválida:", task);
              return null;
            }
            
            try {
              const taskStyle = getTaskStyle(task.startDate, task.endDate, minDate, maxDate);
              const isSelected = selectedTaskId === task.id;
              
              return (
                <React.Fragment key={task.id}>
                  <TaskItem 
                    task={task}
                    taskStyle={taskStyle}
                    teamColor={teamColor}
                    isSelected={isSelected}
                    totalDuration={totalDuration}
                    onTaskClick={onTaskClick}
                  />
                  
                  {/* Detalle de la tarea seleccionada */}
                  {isSelected && (
                    <TaskDetail 
                      task={task} 
                      team={team} 
                      teamColor={teamColor} 
                      onClose={() => onTaskClick(task.id)} 
                    />
                  )}
                </React.Fragment>
              );
            } catch (error) {
              console.error("Error renderizando tarea:", task.id, error);
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamRow;