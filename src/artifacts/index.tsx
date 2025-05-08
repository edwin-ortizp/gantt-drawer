import React, { useState, useEffect } from 'react';
import HorizontalTimeline from './components/HorizontalTimeline';
import { Task, TeamColors } from './lib/types';
import { getProjectById, PREDEFINED_PROJECTS } from './lib/projects';

// Colores predeterminados por equipo
const defaultTeamColors: TeamColors = {
  "Migración": { bg: "#E5F6FD", border: "#0EA5E9", text: "#0369A1", progressBg: "#BAE6FD" },
  "Entidad": { bg: "#F0FDF4", border: "#22C55E", text: "#166534", progressBg: "#BBF7D0" },
  "Datos": { bg: "#FEF3F2", border: "#F43F5E", text: "#BE123C", progressBg: "#FECDD3" },
  "Gestores": { bg: "#F5F3FF", border: "#8B5CF6", text: "#5B21B6", progressBg: "#DDD6FE" }
};

const JsonInputTimeline = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [timelineData, setTimelineData] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [projectsList, setProjectsList] = useState<string[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // JSON de ejemplo para el placeholder
  const exampleJson = JSON.stringify([
    {
      id: 1,
      title: "Análisis inicial",
      startDate: "2025-05-01",
      endDate: "2025-05-15",
      team: "Migración", 
      description: "Evaluación de sistemas",
      progress: 100,
      responsable: "Ana Gómez"
    },
    {
      id: 2,
      title: "Desarrollo de componentes",
      startDate: "2025-05-10",
      endDate: "2025-05-30",
      team: "Entidad", 
      description: "Implementación de módulos principales",
      progress: 50,
      responsable: "Carlos Ruiz"
    }
  ], null, 2);

  // Obtener los parámetros de URL manualmente
  const getProjectIdFromUrl = () => {
    // Primero, intentar obtener del path (e.g., /proyecto-1)
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const potentialProjectId = pathSegments[pathSegments.length - 1];
      if (PREDEFINED_PROJECTS[potentialProjectId]) {
        return potentialProjectId;
      }
    }
    
    // Si no hay en el path, intentar desde query params (e.g., ?project=proyecto-1)
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get('project');
    if (projectParam && PREDEFINED_PROJECTS[projectParam]) {
      return projectParam;
    }
    
    return null;
  };

  // Cargar los proyectos predefinidos al iniciar
  useEffect(() => {
    // Obtener lista de proyectos para el selector
    if (PREDEFINED_PROJECTS) {
      setProjectsList(Object.keys(PREDEFINED_PROJECTS));
    }
    
    // Intentar cargar proyecto desde URL
    const projectIdFromUrl = getProjectIdFromUrl();
    if (projectIdFromUrl) {
      loadProjectFromId(projectIdFromUrl);
    }
  }, []);

  // Cargar proyecto por ID
  const loadProjectFromId = (id: string) => {
    try {
      console.log(`Intentando cargar proyecto con ID: ${id}`);
      const projectData = getProjectById(id);
      
      if (projectData) {
        console.log(`Proyecto encontrado, cargando ${projectData.length} tareas`);
        setTimelineData(projectData);
        setJsonInput(JSON.stringify(projectData, null, 2));
        setError(null);
        setShowTimeline(true);
        setCurrentProjectId(id);
      } else {
        console.error(`No se encontró el proyecto con ID: ${id}`);
        setError(`No se encontró el proyecto "${id}"`);
      }
    } catch (err) {
      console.error("Error al cargar el proyecto:", err);
      setError(`Error al cargar el proyecto: ${err.message}`);
    }
  };

  useEffect(() => {
    // Para propósitos de depuración, mostramos el estado del timeline
    console.log("Estado del timeline:", {
      showTimeline,
      timelineDataLength: timelineData.length,
      hasError: error !== null,
      currentProjectId
    });
  }, [showTimeline, timelineData, error, currentProjectId]);

  const parseJsonInput = () => {
    try {
      if (!jsonInput.trim()) {
        setError("El campo de JSON está vacío");
        return;
      }

      console.log("Intentando parsear JSON:", jsonInput.substring(0, 100) + "...");
      
      const parsedData = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsedData)) {
        setError("El JSON debe ser un array de tareas");
        return;
      }

      console.log("JSON parseado correctamente, validando estructura...");
      
      // Validar cada tarea y recopilar errores específicos
      let invalidItems = [];
      for (let i = 0; i < parsedData.length; i++) {
        const item = parsedData[i];
        const missingFields = [];
        
        if (!item.id) missingFields.push("id");
        if (!item.title) missingFields.push("title");
        if (!item.startDate) missingFields.push("startDate");
        if (!item.endDate) missingFields.push("endDate");
        if (!item.team) missingFields.push("team");
        if (item.description === undefined) missingFields.push("description");
        if (item.progress === undefined) missingFields.push("progress");
        
        if (missingFields.length > 0) {
          invalidItems.push(`Tarea #${i+1}: faltan campos ${missingFields.join(", ")}`);
        }
      }
      
      if (invalidItems.length > 0) {
        setError(`Errores en los datos: ${invalidItems.join("; ")}`);
        return;
      }

      console.log("Datos válidos, estableciendo timelineData y activando visualización");
      
      setTimelineData(parsedData);
      setError(null);
      setShowTimeline(true);
      setCurrentProjectId(null);
      
      // Navegar al principio de la página para mostrar el timeline
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Error al parsear JSON:", err);
      setError(`Error al parsear el JSON. Verifique la sintaxis. Detalles: ${err.message}`);
    }
  };

  const resetView = () => {
    setShowTimeline(false);
    // Limpiar la URL si hay un projectId
    if (currentProjectId) {
      window.history.pushState({}, '', '/');
    }
  };

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProject = e.target.value;
    if (selectedProject) {
      // Actualizar la URL y cargar el proyecto
      window.history.pushState({}, '', `/${selectedProject}`);
      loadProjectFromId(selectedProject);
    }
  };

  return (
    <div className="w-full">
      {!showTimeline ? (
        <div className="mx-auto max-w-6xl p-6">
          <h1 className="text-3xl font-bold text-center mb-8">Generador de Cronograma</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Selector de proyectos predefinidos */}
            {projectsList.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Cargar proyecto predefinido</h3>
                <div className="flex items-center gap-2">
                  <select 
                    className="flex-grow p-2 border border-gray-300 rounded-md"
                    onChange={handleProjectSelect}
                    value={currentProjectId || ""}
                  >
                    <option value="" disabled>Selecciona un proyecto...</option>
                    {projectsList.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 ml-2">
                    Acceso directo: <code>{window.location.origin}/?project=nombre-del-proyecto'</code>
                  </div>
                </div>
              </div>
            )}
            
            <h2 className="text-xl font-semibold mb-4">Ingresa los datos del cronograma en formato JSON</h2>
            
            <textarea
              className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm resize-none"
              placeholder={exampleJson}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
                {error}
              </div>
            )}
            
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={parseJsonInput}
              >
                Generar Cronograma
              </button>
              
              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setJsonInput(exampleJson)}
              >
                Cargar Ejemplo
              </button>
            </div>
            
            <div className="mt-6 text-sm text-gray-600">
              <h3 className="font-semibold">Formato requerido:</h3>
              <p className="mt-2">
                El JSON debe ser un array de objetos con los siguientes campos:
              </p>
              <ul className="mt-1 ml-5 list-disc">
                <li>id: número único</li>
                <li>title: título de la tarea</li>
                <li>startDate: fecha de inicio (YYYY-MM-DD)</li>
                <li>endDate: fecha de fin (YYYY-MM-DD)</li>
                <li>team: equipo asignado</li>
                <li>description: descripción de la tarea</li>
                <li>progress: porcentaje de avance (0-100)</li>
                <li>responsable: (opcional) nombre del responsable</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="p-4 flex justify-between">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors mb-4"
              onClick={resetView}
            >
              ← Volver al editor
            </button>
            
            {currentProjectId && (
              <div className="px-4 py-2 bg-blue-50 text-blue-800 rounded-md mb-4">
                Proyecto actual: <strong>{currentProjectId}</strong>
              </div>
            )}
          </div>
          
          {timelineData.length > 0 ? (
            <HorizontalTimeline data={timelineData} teamColors={defaultTeamColors} />
          ) : (
            <div className="text-center p-8 bg-red-50 rounded-lg mx-auto max-w-3xl">
              <p className="text-red-600 font-medium">No hay datos disponibles para mostrar el cronograma.</p>
              <button
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={resetView}
              >
                Volver al editor
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JsonInputTimeline;