import React from 'react';
import { Task, TeamColor } from '../lib/types';
import { formatDate, createDateFromString } from '../lib/utils';

interface TaskItemProps {
  task: Task & { rowIndex?: number };
  taskStyle: { left: string; width: string };
  teamColor: TeamColor;
  isSelected: boolean;
  totalDuration: number;
  onTaskClick: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  taskStyle, 
  teamColor, 
  isSelected, 
  totalDuration,
  onTaskClick 
}) => {
  // Verificar que tenemos todos los datos necesarios
  if (!task || !task.id || !task.startDate || !task.endDate) {
    console.error("TaskItem: Datos de tarea inválidos", task);
    return null;
  }
  
  try {
    const rowHeight = 4;
    const topPosition = typeof task.rowIndex === 'number' ? task.rowIndex * rowHeight : 0;
    
    // Calcular el ancho de la tarea (para determinar si es corta)
    let taskWidthPercentage = 0;
    try {
      const taskStart = createDateFromString(task.startDate);
      const taskEnd = createDateFromString(task.endDate);
      const taskDuration = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24);
      taskWidthPercentage = (taskDuration / totalDuration) * 100;
    } catch (error) {
      console.error("Error calculando el ancho de la tarea:", error);
      taskWidthPercentage = 10; // Valor por defecto
    }
    
    const isShortTask = taskWidthPercentage < 15;
    
    // Valores por defecto para teamColor si no está definido
    const safeTeamColor = teamColor || {
      bg: "#E5F6FD",
      border: "#0EA5E9",
      text: "#0369A1",
      progressBg: "#BAE6FD"
    };
    
    // Formatear fechas de forma segura
    const safeFormatDate = (dateString: string) => {
      try {
        return formatDate(dateString);
      } catch (error) {
        console.error("Error formateando fecha:", error);
        return dateString;
      }
    };
    
    // Asegurar que el progreso es un número válido
    const safeProgress = typeof task.progress === 'number' && !isNaN(task.progress)
      ? Math.min(100, Math.max(0, task.progress))
      : 0;
    
    // Altura aumentada para tareas no cortas para acomodar más texto
    const taskHeight = isShortTask ? "2.5rem" : "3.5rem";
    
    return (
      <div 
        className={`absolute rounded-lg shadow-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-offset-2 z-10' : 'hover:shadow-md'}`}
        style={{ 
          ...taskStyle, 
          top: `${topPosition}rem`,
          height: taskHeight,
          backgroundColor: safeTeamColor.bg,
          borderLeft: `3px solid ${safeTeamColor.border}`,
          borderBottom: `2px solid ${safeTeamColor.border}`,
          zIndex: isSelected ? 10 : 5
        }}
        onClick={() => onTaskClick(task.id)}
      >
        {/* Barra de progreso */}
        <div 
          className="absolute top-0 left-0 bottom-0 rounded-l-lg"
          style={{ 
            width: `${safeProgress}%`,
            backgroundColor: safeTeamColor.progressBg,
            zIndex: 1
          }}
        ></div>
        
        {/* Contenido de la tarea para tareas no cortas */}
        {!isShortTask && (
          <div className="absolute inset-0 p-2 flex flex-col justify-between z-10">
            <div>
              {/* Título siempre visible, con fondo semi-transparente para mejor legibilidad */}
              <div 
                className="font-medium text-sm leading-tight mb-1 bg-white bg-opacity-70 inline-block px-1 rounded"
                style={{ color: safeTeamColor.text }}
              >
                {task.title}
              </div>
              
              {/* Responsable siempre visible si existe */}
              {task.responsable && (
                <div 
                  className="text-xs bg-white bg-opacity-70 inline-block px-1 rounded ml-1"
                  style={{ color: safeTeamColor.text }}
                >
                  {task.responsable}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-white bg-opacity-80" 
                  style={{ color: safeTeamColor.text }}>
                  {safeProgress}%
                </span>
              </div>
              
              <div className="flex items-center text-xs font-medium bg-white bg-opacity-80 px-1.5 py-0.5 rounded-full whitespace-nowrap" 
                style={{ color: safeTeamColor.text }}>
                {safeFormatDate(task.startDate)} - {safeFormatDate(task.endDate)}
              </div>
            </div>
          </div>
        )}
        
        {/* Contenido para tareas cortas (solo mostrar progreso y fechas) */}
        {isShortTask && (
          <div className="absolute inset-0 p-2 flex items-end justify-between z-10">
            <div className="flex items-center">
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-white bg-opacity-80" 
                style={{ color: safeTeamColor.text }}>
                {safeProgress}%
              </span>
            </div>
            
            <div className="flex items-center text-xs font-medium bg-white bg-opacity-80 px-1.5 py-0.5 rounded-full whitespace-nowrap" 
              style={{ color: safeTeamColor.text }}>
              {safeFormatDate(task.startDate)} - {safeFormatDate(task.endDate)}
            </div>
          </div>
        )}
        
        {/* Etiqueta para tareas cortas */}
        {isShortTask && (
          <div 
            className="absolute -top-6 left-0 font-medium text-sm whitespace-nowrap bg-white bg-opacity-75 px-1 py-0.5 rounded shadow-sm max-w-xs overflow-hidden text-ellipsis"
            style={{ color: safeTeamColor.text }}
          >
            {task.title}
            {task.responsable && (
              <span className="text-xs ml-1 opacity-80">({task.responsable})</span>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error renderizando TaskItem:", error);
    return null;
  }
};

export default TaskItem;