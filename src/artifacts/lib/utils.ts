import { Task } from './types';

// Corregir problema de zona horaria al crear fechas
export const createDateFromString = (dateString: string): Date => {
  if (!dateString || typeof dateString !== 'string') {
    console.error('Invalid date string:', dateString);
    return new Date(); // Fecha por defecto en caso de error
  }
  
  // Asegurarnos de que la fecha tenga el formato correcto
  try {
    // IMPORTANTE: Este enfoque evita problemas de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Verificamos que los componentes de la fecha sean válidos
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      console.error('Invalid date components:', year, month, day, 'from', dateString);
      return new Date(); // Fecha por defecto en caso de error
    }
    
    // Creamos la fecha con UTC para evitar problemas de zona horaria
    return new Date(Date.UTC(year, month - 1, day));
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return new Date();
  }
};

// Función para formatear fechas cortas
export const formatDate = (dateString: string): string => {
  try {
    // Usar el enfoque UTC para evitar problemas de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    
    // Formateamos manualmente para evitar problemas de localización
    const formattedDay = date.getUTCDate();
    
    // Usamos nombres de mes abreviados directamente
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const formattedMonth = months[date.getUTCMonth()];
    
    return `${formattedDay} ${formattedMonth}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Devolvemos el string original en caso de error
  }
};

// Formatear mes y año
export const formatMonthYear = (date: Date): string => {
  try {
    // Formateo manual para evitar problemas de localización
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    
    return `${month} ${year}`;
  } catch (error) {
    console.error('Error formatting month/year:', error);
    return date.toString(); // Fallback en caso de error
  }
};

// Formatear rango de semana
export const formatWeekRange = (weekStart: Date): string => {
  try {
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
    
    // Formatear día: simplemente el número del día
    const formatDay = (date: Date): number => date.getUTCDate();
    
    // Formatear mes: texto abreviado del mes
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const formatMonth = (date: Date): string => months[date.getUTCMonth()];
    
    // Si la semana abarca dos meses diferentes
    if (weekStart.getUTCMonth() !== weekEnd.getUTCMonth()) {
      return `${formatDay(weekStart)} ${formatMonth(weekStart)} - ${formatDay(weekEnd)} ${formatMonth(weekEnd)}`;
    }
    
    // Si la semana está en el mismo mes
    return `${formatDay(weekStart)}-${formatDay(weekEnd)} ${formatMonth(weekStart)}`;
  } catch (error) {
    console.error('Error formatting week range:', error);
    return 'Semana'; // Fallback simple
  }
};

// Obtener todas las semanas en un rango
export const getWeeksInRange = (minDate: Date, maxDate: Date): Date[] => {
  const weeks: Date[] = [];
  
  // Proteger contra fechas inválidas
  if (!(minDate instanceof Date) || !(maxDate instanceof Date) || isNaN(minDate.getTime()) || isNaN(maxDate.getTime())) {
    console.error('Invalid date range:', minDate, maxDate);
    return weeks;
  }
  
  try {
    // Crear copias para no modificar los originales
    const currentDate = new Date(minDate);
    
    // Ajustar al inicio de la semana (lunes)
    const dayOfWeek = currentDate.getUTCDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convertir domingo (0) a 6, lunes (1) a 0, etc.
    currentDate.setUTCDate(currentDate.getUTCDate() - diff);
    
    // Añadir un límite para evitar bucles infinitos
    const maxIterations = 200; // Número máximo razonable de semanas (casi 4 años)
    let count = 0;
    
    // Recopilar todas las semanas hasta la fecha máxima
    while (currentDate <= maxDate && count < maxIterations) {
      // Crear una nueva instancia para cada semana
      weeks.push(new Date(currentDate.getTime()));
      currentDate.setUTCDate(currentDate.getUTCDate() + 7); // Avanzar una semana
      count++;
    }
    
    // Verificación extra - si no hay semanas, añadir al menos una
    if (weeks.length === 0) {
      weeks.push(new Date(minDate));
    }
    
    return weeks;
  } catch (error) {
    console.error('Error getting weeks in range:', error);
    // En caso de error, devolver al menos una semana
    return [new Date(minDate)];
  }
};

// Calcular el rango de fechas para el cronograma
export const calculateDateRange = (data: Task[]): { minDate: Date, maxDate: Date, totalDuration: number } => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Invalid or empty data array');
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    return {
      minDate: today,
      maxDate: nextMonth,
      totalDuration: 30 // Un mes aproximado
    };
  }
  
  try {
    // Recopilar todas las fechas válidas
    const validDates: Date[] = [];
    
    data.forEach(item => {
      try {
        if (item.startDate) {
          validDates.push(createDateFromString(item.startDate));
        }
        if (item.endDate) {
          validDates.push(createDateFromString(item.endDate));
        }
      } catch (e) {
        console.error('Error adding date to range calculation:', e);
      }
    });
    
    if (validDates.length === 0) {
      throw new Error('No valid dates found in data');
    }
    
    // Obtener la fecha mínima y máxima
    let minDate = new Date(Math.min(...validDates.map(date => date.getTime())));
    let maxDate = new Date(Math.max(...validDates.map(date => date.getTime())));
    
    // Verificar que las fechas son válidas
    if (isNaN(minDate.getTime()) || isNaN(maxDate.getTime())) {
      console.error('Invalid date calculation result:', minDate, maxDate);
      const today = new Date();
      return {
        minDate: today,
        maxDate: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
        totalDuration: 30
      };
    }
    
    // Añadir margen al inicio y final para mejor visualización
    minDate = new Date(minDate);
    minDate.setUTCDate(minDate.getUTCDate() - 3); // 3 días antes
    
    maxDate = new Date(maxDate);
    maxDate.setUTCDate(maxDate.getUTCDate() + 3); // 3 días después
    
    // Calcular la duración total en días
    // Usamos UTC para evitar problemas con horario de verano
    const totalDuration = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Garantizar una duración mínima para evitar problemas visuales
    const minDuration = 14; // Al menos 2 semanas
    
    if (totalDuration < minDuration) {
      maxDate = new Date(minDate);
      maxDate.setUTCDate(minDate.getUTCDate() + minDuration);
    }
    
    console.log('Calculated date range:', {
      minDate: minDate.toISOString(),
      maxDate: maxDate.toISOString(),
      totalDuration
    });
    
    return { minDate, maxDate, totalDuration };
  } catch (error) {
    console.error('Error calculating date range:', error);
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    return {
      minDate: today,
      maxDate: nextMonth,
      totalDuration: 30
    };
  }
};

// Calcular posición y ancho de cada tarea
export const getTaskStyle = (startDate: string, endDate: string, minDate: Date, maxDate: Date): { left: string, width: string } => {
  try {
    console.log('Calculating task style for:', { startDate, endDate });
    
    // Usar la función que respeta la zona horaria
    const start = createDateFromString(startDate);
    const end = createDateFromString(endDate);
    
    // Calcular el rango total del cronograma en milisegundos
    const totalRange = maxDate.getTime() - minDate.getTime();
    
    // Protección contra división por cero
    if (totalRange <= 0) {
      console.error('Invalid date range for task styling:', minDate, maxDate);
      return { left: '0%', width: '0%' };
    }
    
    // Calcular posición izquierda como porcentaje del rango total
    const left = ((start.getTime() - minDate.getTime()) / totalRange) * 100;
    
    // Calcular ancho como porcentaje del rango total
    // Añadir un día al final para visualización
    const adjustedEnd = new Date(end);
    adjustedEnd.setUTCDate(end.getUTCDate() + 1);
    const width = ((adjustedEnd.getTime() - start.getTime()) / totalRange) * 100;
    
    // Asegurar que los valores son válidos
    if (isNaN(left) || isNaN(width)) {
      console.error('Invalid position calculation:', { left, width, start, end });
      return { left: '0%', width: '0%' };
    }
    
    // Limitar el ancho mínimo para tareas muy cortas
    const minWidth = 0.5; // Porcentaje mínimo para visibilidad
    const adjustedWidth = Math.max(width, minWidth);
    
    // Asegurar que la tarea esté visible incluso si empieza antes del rango
    const adjustedLeft = Math.max(0, left);
    
    // Imprimir para depuración
    console.log('Task style calculated:', { 
      taskDates: { start: start.toISOString(), end: end.toISOString() },
      timelineDates: { min: minDate.toISOString(), max: maxDate.toISOString() },
      positioning: { left: adjustedLeft, width: adjustedWidth }
    });
    
    return {
      left: `${adjustedLeft}%`,
      width: `${adjustedWidth}%`
    };
  } catch (error) {
    console.error('Error calculating task style:', error);
    return { left: '0%', width: '0%' };
  }
};

// Función para manejar solapamientos en un carril
export const handleOverlappingTasks = (teamData: Task[]): (Task & { rowIndex?: number })[] => {
  if (!Array.isArray(teamData) || teamData.length === 0) {
    return [];
  }
  
  try {
    // Ordenar por fecha de inicio y luego por fecha de fin para consistencia
    const sortedTasks = [...teamData].sort((a, b) => {
      const dateA = createDateFromString(a.startDate).getTime();
      const dateB = createDateFromString(b.startDate).getTime();
      
      if (dateA === dateB) {
        // Si las fechas de inicio son iguales, ordenar por fecha de fin
        const endA = createDateFromString(a.endDate).getTime();
        const endB = createDateFromString(b.endDate).getTime();
        return endA - endB;
      }
      
      return dateA - dateB;
    });
    
    const rows: (Task & { rowIndex?: number })[][] = [];
    
    // Primera pasada: asociar todas las tareas que comparten fecha a filas separadas
    sortedTasks.forEach(task => {
      const taskStart = createDateFromString(task.startDate);
      const taskEnd = createDateFromString(task.endDate);
      
      // Encontrar la primera fila donde cabe esta tarea
      let rowIndex = 0;
      let fits = false;
      
      // Limitamos el número de filas a un valor razonable
      const maxRows = 20; // Aumentado para permitir más filas si es necesario
      
      while (!fits && rowIndex < maxRows) {
        // Si no existe esta fila, crearla
        if (!rows[rowIndex]) {
          rows[rowIndex] = [];
          fits = true;
          break;
        }
        
        // Comprobar si hay solapamiento con alguna tarea de esta fila
        const hasOverlap = rows[rowIndex].some(existingTask => {
          const existingStart = createDateFromString(existingTask.startDate);
          const existingEnd = createDateFromString(existingTask.endDate);
          
          // Añadir un día al final para visualización
          const bufferedExistingEnd = new Date(existingEnd);
          bufferedExistingEnd.setUTCDate(existingEnd.getUTCDate() + 1);
          
          // Consideramos que hay solapamiento si una tarea comienza antes de que termine otra
          return (taskStart < bufferedExistingEnd && existingStart < taskEnd);
        });
        
        if (!hasOverlap) {
          fits = true;
          break;
        }
        
        rowIndex++;
      }
      
      // Añadir la tarea a la fila correspondiente
      if (!rows[rowIndex]) {
        rows[rowIndex] = [];
      }
      rows[rowIndex].push({...task, rowIndex});
    });
    
    // Imprimir distribución para depuración
    console.log('Task row distribution:', rows.map(row => row.length));
    
    // Aplanar el resultado
    return rows.flat();
  } catch (error) {
    console.error('Error handling overlapping tasks:', error);
    // Devolver las tareas originales con rowIndex 0 como fallback
    return teamData.map(task => ({...task, rowIndex: 0}));
  }
};