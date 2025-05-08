// Definición de tipos para TypeScript

export interface Task {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  team: string;
  description: string;
  progress: number;
  responsable?: string;
}

export interface TeamColor {
  bg: string;
  border: string;
  text: string;
  progressBg: string;
}

export interface TeamColors {
  [key: string]: TeamColor;
}

export interface TimelineProps {
  data: Task[];
  teamColors: TeamColors;
}