import React from 'react';
import { Task, TeamColor } from '../lib/types';

interface TaskDetailProps {
  task: Task;
  team: string;
  teamColor: TeamColor;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, team, teamColor, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50" 
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
        style={{ borderTop: `4px solid ${teamColor.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold" style={{ color: teamColor.text }}>{task.title}</h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-full text-sm font-medium" 
              style={{ 
                backgroundColor: teamColor.bg,
                color: teamColor.text
              }}>
              {team}
            </span>
            
            {/* Responsable, si existe */}
            {task.responsable && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                {task.responsable}
              </span>
            )}
          </div>
          
          {/* Fechas destacadas */}
          <div className="flex items-center gap-2 justify-center mt-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500">Inicio</span>
              <span className="px-2 py-1 rounded-md text-sm font-bold bg-gray-100">
                {new Date(task.startDate).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'short',
                  year: 'numeric' 
                })}
              </span>
            </div>
            <span>→</span>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500">Fin</span>
              <span className="px-2 py-1 rounded-md text-sm font-bold bg-gray-100">
                {new Date(task.endDate).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'short',
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mt-4">
            {task.description}
          </p>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between mb-1">
            <p className="font-semibold text-sm">Progreso</p>
            <p className="font-bold text-sm">{task.progress}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full" 
              style={{ 
                width: `${task.progress}%`,
                backgroundColor: teamColor.border
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;