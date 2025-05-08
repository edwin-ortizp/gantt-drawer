// Primero, necesitamos crear un archivo que almacene nuestros proyectos predefinidos
// projects.js o projects.ts

import { Task } from './types';

// Definición de los proyectos predefinidos
interface ProjectData {
  [key: string]: Task[];
}

export const PREDEFINED_PROJECTS: ProjectData = {
  "palmira": [
    {
        "id": 1,
        "title": "Disponibilización en Mongo de ICA",
        "startDate": "2025-04-14",
        "endDate": "2025-04-30",
        "team": "Migracion",
        "description": "",
        "progress": 70,
        "responsable": "milagro-1"
    },
    {
        "id": 2,
        "title": "Disponibilización en Mongo de Predial",
        "startDate": "2025-03-24",
        "endDate": "2025-04-30",
        "team": "Migracion",
        "description": "",
        "progress": 80,
        "responsable": "milagro-1"
    },
    {
        "id": 3,
        "title": "Paso a Staging",
        "startDate": "2025-04-30",
        "endDate": "2025-05-01",
        "team": "Gestores",
        "description": "",
        "progress": 0,
        "responsable": "milagro-1"
    },
    {
        "id": 4,
        "title": "Pruebas con Tributaria (UAT)",
        "startDate": "2025-05-13",
        "endDate": "2025-05-15",
        "team": "Migracion",
        "description": "",
        "progress": 0,
        "responsable": "milagro-1"
    },
    {
        "id": 5,
        "title": "Parametrización de flujo y actividades ICA y Predial [Actividades no automaticas]",
        "startDate": "2025-03-03",
        "endDate": "2025-04-24",
        "team": "Entidad",
        "description": "",
        "progress": 100,
        "responsable": "milagro-1"
    },
    {
        "id": 6,
        "title": "Modificación de pantallas de Cartera/Buzón/Expedientes - Otros tributos",
        "startDate": "2025-02-03",
        "endDate": "2025-04-24",
        "team": "Entidad",
        "description": "",
        "progress": 100,
        "responsable": "milagro-1"
    },
    {
        "id": 7,
        "title": "Pruebas Staging migración ICA y PREDIAL  - Sin todas las actividades automaticas [50% actividades son automaticas]",
        "startDate": "2025-05-02",
        "endDate": "2025-05-13",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "milagro-1"
    },
    {
        "id": 8,
        "title": "Paso a producción migración ICA y PREDIAL - Solo consulta",
        "startDate": "2025-05-15",
        "endDate": "2025-05-15",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "milagro-1"
    },
    {
        "id": 9,
        "title": "Parametrización de flujo y actividades ICA y Predial - Para que todas las actividades queden automaticas",
        "startDate": "2025-03-03",
        "endDate": "2025-05-30",
        "team": "Entidad",
        "description": "",
        "progress": 75,
        "responsable": "milagro-1"
    },
    {
        "id": 10,
        "title": "Paso a producción finalización parametrización flujos ICA y PREDIAL",
        "startDate": "2025-06-02",
        "endDate": "2025-06-02",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "milagro-1"
    },
    {
        "id": 11,
        "title": "Ajuste módulo para recibir acuerdos de pagos - Solo consulta",
        "startDate": "2025-05-05",
        "endDate": "2025-05-30",
        "team": "Entidad",
        "description": "",
        "progress": 10,
        "responsable": "milagro-1"
    },
    {
        "id": 12,
        "title": "Pruebas Staging acuerdos de pago - Consulta",
        "startDate": "2025-06-02",
        "endDate": "2025-06-06",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "milagro-1"
    },
    {
        "id": 13,
        "title": "Paso a producción consulta acuerdos de pago ICA y PREDIAL - Solo consulta",
        "startDate": "2025-06-13",
        "endDate": "2025-06-13",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "milagro-1"
    },
    {
        "id": 14,
        "title": "Parametrización tributos Cuotas partes, incumplimientos, incapacidades, violencia intrafamiliar, Reteica",
        "startDate": "2025-05-15",
        "endDate": "2025-08-16",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "fase-2-otros-tributos"
    },
    {
        "id": 15,
        "title": "Pruebas Staging   Cuotas partes, incumplimientos, incapacidades, violencia intrafamiliar, Reteica",
        "startDate": "2025-08-18",
        "endDate": "2025-08-22",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "fase-2-otros-tributos"
    },
    {
        "id": 16,
        "title": "Paso a producción migración Cuotas partes, incumplimientos, incapacidades, violencia intrafamiliar, Reteica - Solo consulta",
        "startDate": "2025-08-25",
        "endDate": "2025-08-25",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "fase-2-otros-tributos"
    },
    {
        "id": 17,
        "title": "Ajuste módulo para generar acuerdos de pagos - Otros tributos",
        "startDate": "2025-06-02",
        "endDate": "2025-08-22",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "fase-2-otros-tributos"
    },
    {
        "id": 18,
        "title": "Pruebas generación acuerdos de pago - Otros tributos",
        "startDate": "2025-08-25",
        "endDate": "2025-08-29",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "fase-2-otros-tributos"
    },
    {
        "id": 19,
        "title": "Paso a producción - generación acuerdos de pago",
        "startDate": "2025-09-01",
        "endDate": "2025-09-01",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "fase-2-otros-tributos"
    },
    {
        "id": 20,
        "title": "Parametrización tributos  Circulación y Tránsito, Multas de transito, convivencia  - Sin actividades automaticas",
        "startDate": "2025-08-18",
        "endDate": "2025-11-28",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "fase-3-otros-tributos"
    },
    {
        "id": 21,
        "title": "Pruebas Staging Circulación y Tránsito, Multas de transito, convivencia - Sin actividades automaticas",
        "startDate": "2025-09-01",
        "endDate": "2025-09-05",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "fase-3-otros-tributos"
    },
    {
        "id": 22,
        "title": "Paso a producción migración tributos -  Circulación y Tránsito, Multas de transito, convivencia - Sin actividades automaticas",
        "startDate": "2026-02-07",
        "endDate": "2026-02-07",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "fase-3-otros-tributos"
    },
    {
        "id": 23,
        "title": "Parametrización tributos  Circulación y Tránsito, Multas de transito, convivencia - Con actividades automaticas",
        "startDate": "2025-09-01",
        "endDate": "2025-10-03",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "fase-3-otros-tributos"
    },
    {
        "id": 24,
        "title": "Pruebas Staging migración   Circulación y Tránsito, Multas de transito, convivencia  - Con todas las actividades automaticas",
        "startDate": "2025-10-06",
        "endDate": "2025-10-10",
        "team": "Entidad",
        "description": "",
        "progress": 0,
        "responsable": "fase-3-otros-tributos"
    },
    {
        "id": 25,
        "title": "Módulo de ajustes (Pagos errados, manuales, dobles, ajuste de exentos)",
        "startDate": "2025-03-01",
        "endDate": "2025-04-15",
        "team": "Entidad",
        "description": "",
        "progress": 85,
        "responsable": "ajustes"
    },
    {
        "id": 26,
        "title": "Capacitación de módulo ajustes",
        "startDate": "2025-04-30",
        "endDate": "2025-05-30",
        "team": "QA",
        "description": "",
        "progress": 0,
        "responsable": ""
    },
    {
        "id": 27,
        "title": "Capacitación de otros tributos",
        "startDate": "2025-05-20",
        "endDate": "2025-05-30",
        "team": "QA",
        "description": "",
        "progress": 0,
        "responsable": "milagro-1"
    },
    {
        "id": 28,
        "title": "Optimización en la descarga del reporte de cartera",
        "startDate": "2025-05-12",
        "endDate": "2025-05-12",
        "team": "Soporte",
        "description": "",
        "progress": 5,
        "responsable": "novedades"
    },
    {
        "id": 29,
        "title": "Optimización en la descarga del reporte de expedientes",
        "startDate": "2025-05-30",
        "endDate": "2025-05-30",
        "team": "Soporte",
        "description": "",
        "progress": 0,
        "responsable": "novedades"
    },
    {
        "id": 30,
        "title": "Optimización en la descarga del reporte de debido cobrar",
        "startDate": "2025-05-30",
        "endDate": "2025-05-30",
        "team": "Soporte",
        "description": "",
        "progress": 0,
        "responsable": "novedades"
    }
  ],
  "gestores": [
    {
        "id": 1,
        "title": "Gestor de tributos",
        "startDate": "2024-11-01",
        "endDate": "2025-02-28",
        "team": "Gestores",
        "description": "Componente central que administra contribuyentes, sujetos de impuesto y procesa las liquidaciones de tributos aplicando reglas específicas por entidad.",
        "progress": 80
    },
    {
        "id": 2,
        "title": "Milagro 1 - Soporte a otros tributos",
        "startDate": "2025-01-15",
        "endDate": "2025-05-30",
        "team": "Gestores",
        "description": "Expansión del sistema para gestionar múltiples tipos de tributos (predial, ICA, multas, etc.) además del alumbrado público y TESCC actuales.",
        "progress": 70
    },
    {
        "id": 3,
        "title": "Consulta en la fuente única de datos",
        "startDate": "2025-05-01",
        "endDate": "2025-06-15",
        "team": "Gestores",
        "description": "Tarea de apoyo al desarrollo del gestor de almacenamiento",
        "progress": 0
    },
    {
        "id": 4,
        "title": "Integración entre gestores y gestor de almacenamiento",
        "startDate": "2025-05-01",
        "endDate": "2025-06-15",
        "team": "Gestores",
        "description": "Comunicación efectiva entre los diferentes gestores mediante eventos, asegurando el flujo correcto de información.",
        "progress": 0
    },
    {
        "id": 5,
        "title": "Manejo de errores, reintentos y observabilidad",
        "startDate": "2025-04-01",
        "endDate": "2025-06-15",
        "team": "Gestores",
        "description": "Implementación de mecanismos para detectar, reportar y corregir errores, con capacidad de reintentos automáticos y monitoreo completo del sistema.",
        "progress": 30
    },
    {
        "id": 6,
        "title": "Gestor de recaudo",
        "startDate": "2025-03-01",
        "endDate": "2025-06-30",
        "team": "Gestores",
        "description": "Componente que genera facturas y procesa los pagos recibidos por diferentes medios (asobancaria, pasarelas, transferencias, etc.).",
        "progress": 20
    },
    {
        "id": 7,
        "title": "Gestor de cartera",
        "startDate": "2025-03-01",
        "endDate": "2025-07-30",
        "team": "Gestores",
        "description": "Sistema que mantiene actualizado el estado de cuenta de cada contribuyente, calculando saldos e intereses en tiempo real.",
        "progress": 20
    },
    {
        "id": 8,
        "title": "Integración de \"Arquitectura Nueva\" y \"Arquitectura Legacy\"",
        "startDate": "2025-06-30",
        "endDate": "2025-08-30",
        "team": "Gestores",
        "description": "Estrategia para mantener operativos los procesos actuales mientras se implementan los nuevos componentes, asegurando una transición gradual.",
        "progress": 0
    }
    ]
};

// Función para obtener un proyecto por su ID
export const getProjectById = (projectId: string): Task[] | null => {
  return PREDEFINED_PROJECTS[projectId] || null;
};