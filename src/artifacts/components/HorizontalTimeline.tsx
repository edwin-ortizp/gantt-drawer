import React, { useState, useEffect } from 'react';
import { Task, TeamColors } from '../lib/types';
import { 
  calculateDateRange, 
  getWeeksInRange, 
  handleOverlappingTasks 
} from '../lib/utils';

// Importar los componentes divididos
import TimelineHeader from './TimelineHeader';
import TeamRow from './TeamRow';
import TimelineSummary from './TimelineSummary';
import TodayMarker from './TodayMarker';
import ProjectFilter from './ProjectFilter';

interface HorizontalTimelineProps {
  data: Task[];
  teamColors: TeamColors;
}

const ZOOM_LEVELS = [
  { value: 'week', label: 'Semanas' },
  { value: 'month', label: 'Meses' },
  { value: 'quarter', label: 'Trimestres' },
  { value: 'semester', label: 'Semestres' }
];

const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({ data = [], teamColors }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>("Todos");
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<'week' | 'month' | 'quarter' | 'semester'>('week');
  
  // Validar los datos de entrada
  useEffect(() => {
    console.log("HorizontalTimeline recibió datos:", data?.length || 0, "tareas");
    
    if (!Array.isArray(data)) {
      console.error("Error: data no es un array", data);
      setError("Los datos no tienen el formato correcto");
      return;
    }
    
    if (data.length === 0) {
      console.warn("Advertencia: No hay datos para mostrar");
      setError("No hay datos disponibles para mostrar el cronograma");
      return;
    }
    
    setError(null);
  }, [data]);
  
  // Si hay un error, mostrarlo
  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  
  // Asegurar que tenemos teamColors
  const safeTeamColors = teamColors || {
    "Migración": { bg: "#E5F6FD", border: "#0EA5E9", text: "#0369A1", progressBg: "#BAE6FD" }
  };
  
  // Extraer proyectos únicos para el filtro - desde el campo responsable
  const allProjects = ["Todos"];
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item.responsable && !allProjects.includes(item.responsable)) {
        allProjects.push(item.responsable);
      }
    });
  }
  
  // Aplicar filtro de proyecto usando el campo responsable
  const filteredData = projectFilter === "Todos" 
    ? (Array.isArray(data) ? data : [])
    : (Array.isArray(data) ? data.filter(item => item.responsable === projectFilter) : []);

  // Manejo de caso sin datos
  if (!Array.isArray(filteredData) || filteredData.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <p className="text-gray-600">No hay datos disponibles para mostrar el cronograma.</p>
      </div>
    );
  }

  // Definir equipos antes del try
  const teams = Array.from(new Set(filteredData.map(item => item.team)));

  try {
    // Calcular rango de fechas y semanas (usando todos los datos para mantener el rango completo)
    const { minDate, maxDate, totalDuration } = calculateDateRange(Array.isArray(data) ? data : []);

    // NUEVO: Generar intervalos según el zoom
    let intervals: Date[] = [];
    let intervalType = zoom;
    let intervalLabelFn = (date: Date) => '';
    let intervalDuration = 7; // días

    if (zoom === 'week') {
      intervals = getWeeksInRange(minDate, maxDate);
      intervalLabelFn = (date) => {
        // Reutilizar formato de semana
        return `${date.getUTCDate()} ${date.toLocaleString('es-ES', { month: 'short' })}`;
      };
      intervalDuration = 7;
    } else if (zoom === 'month') {
      // Generar meses en el rango
      const months: Date[] = [];
      let d = new Date(Date.UTC(minDate.getUTCFullYear(), minDate.getUTCMonth(), 1));
      while (d <= maxDate) {
        months.push(new Date(d));
        d.setUTCMonth(d.getUTCMonth() + 1);
      }
      intervals = months;
      intervalLabelFn = (date) => date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
      // Aproximar duración del mes
      intervalDuration = 30;
    } else if (zoom === 'quarter') {
      // Generar trimestres
      const quarters: Date[] = [];
      let year = minDate.getUTCFullYear();
      let month = Math.floor(minDate.getUTCMonth() / 3) * 3;
      let d = new Date(Date.UTC(year, month, 1));
      while (d <= maxDate) {
        quarters.push(new Date(d));
        month += 3;
        if (month > 11) {
          month = 0;
          year++;
        }
        d = new Date(Date.UTC(year, month, 1));
      }
      intervals = quarters;
      intervalLabelFn = (date) => {
        const q = Math.floor(date.getUTCMonth() / 3) + 1;
        return `Q${q} ${date.getUTCFullYear()}`;
      };
      intervalDuration = 90;
    } else if (zoom === 'semester') {
      // Generar semestres
      const semesters: Date[] = [];
      let year = minDate.getUTCFullYear();
      let month = minDate.getUTCMonth() < 6 ? 0 : 6;
      let d = new Date(Date.UTC(year, month, 1));
      while (d <= maxDate) {
        semesters.push(new Date(d));
        if (month === 0) {
          month = 6;
        } else {
          month = 0;
          year++;
        }
        d = new Date(Date.UTC(year, month, 1));
      }
      intervals = semesters;
      intervalLabelFn = (date) => {
        const s = date.getUTCMonth() < 6 ? 1 : 2;
        return `S${s} ${date.getUTCFullYear()}`;
      };
      intervalDuration = 182;
    }

    // Calcular la posición de "Hoy"
    const today = new Date();
    const todayTime = today.getTime();
    const minTime = minDate.getTime();
    const maxTime = maxDate.getTime();
    
    let todayPosition = 0;
    if (todayTime < minTime) {
      todayPosition = 0;
    } else if (todayTime > maxTime) {
      todayPosition = 100;
    } else {
      todayPosition = ((todayTime - minTime) / (maxTime - minTime)) * 100;
    }
    
    // Manejar clic en tareas
    const handleTaskClick = (taskId: number) => {
      setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
    };
    
    console.log("Renderizando timeline con:", {
      teams: teams.length,
      weeks: intervals.length,
      todayPosition
    });
    
    return (
      <div className="font-sans bg-white p-4 shadow-lg w-full">
        {/* Título y botón de navegación */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cronograma del proyecto</h1>
        </div>

        {/* NUEVO: Selector de zoom */}
        <div className="mb-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Escala de visualización:</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={zoom}
            onChange={e => setZoom(e.target.value as any)}
          >
            {ZOOM_LEVELS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Filtro de proyecto */}
        <ProjectFilter
          projects={allProjects}
          selectedProject={projectFilter}
          onChange={setProjectFilter}
        />

        {/* Contenedor con scroll horizontal */}
        <div className="relative overflow-x-auto pb-4">
          <div className="min-w-full" style={{ minWidth: `${Math.max(intervals.length * 120, 800)}px` }}>
            {/* Encabezado de intervalos */}
            <div className="relative mb-6 pl-40">
              <div className="flex">
                {intervals.map((intervalStart, index) => {
                  // Calcular duración real del intervalo
                  let next = intervals[index + 1];
                  let width = 0;
                  if (next) {
                    width = ((next.getTime() - intervalStart.getTime()) / (maxDate.getTime() - minDate.getTime())) * 100;
                  } else {
                    width = ((maxDate.getTime() - intervalStart.getTime()) / (maxDate.getTime() - minDate.getTime())) * 100;
                  }
                  return (
                    <div
                      key={index}
                      className="flex-shrink-0 px-1 border-r last:border-r-0 flex flex-col items-center"
                      style={{ width: `${width}%` }}
                    >
                      <span
                        className="text-sm font-medium text-gray-700 whitespace-nowrap"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          padding: '2px 4px',
                          borderRadius: '4px'
                        }}
                      >
                        {intervalLabelFn(intervalStart)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="h-px bg-gray-300 w-full mt-2"></div>
            </div>

            {/* Filas por equipo */}
            {teams.map((team) => {
              const teamData = filteredData.filter(item => item.team === team);
              const processedTeamData = handleOverlappingTasks(teamData);
              const teamColor = safeTeamColors[team] || safeTeamColors["Migración"];

              return (
                <TeamRow
                  key={team}
                  team={team}
                  teamColor={teamColor}
                  teamData={processedTeamData}
                  minDate={minDate}
                  maxDate={maxDate}
                  totalDuration={totalDuration}
                  selectedTaskId={selectedTaskId}
                  onTaskClick={handleTaskClick}
                  weeks={intervals}
                  todayPosition={todayPosition}
                />
              );
            })}

            {/* Etiqueta "Hoy" en la parte inferior */}
            <TodayMarker position={todayPosition} />
          </div>
        </div>

        {/* Resumen del cronograma */}
        <TimelineSummary
          minDate={minDate}
          maxDate={maxDate}
          totalDuration={totalDuration}
          teams={teams}
          teamColors={safeTeamColors}
        />
      </div>
    );
  } catch (error) {
    console.error("Error al renderizar el cronograma:", error);
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <p className="text-red-600">
          Error al generar el cronograma: {error instanceof Error ? error.message : String(error)}
        </p>
        <p className="mt-2 text-gray-600">Intenta con datos diferentes o contacta al soporte.</p>
      </div>
    );
  }
};

export default HorizontalTimeline;