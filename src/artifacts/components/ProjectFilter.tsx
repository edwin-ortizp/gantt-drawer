import React from 'react';

interface ProjectFilterProps {
  projects: string[];
  selectedProject: string;
  onChange: (project: string) => void;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({ 
  projects, 
  selectedProject, 
  onChange 
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filtrar por proyecto:
      </label>
      <select
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        value={selectedProject}
        onChange={(e) => onChange(e.target.value)}
      >
        {projects.map(project => (
          <option key={project} value={project}>{project}</option>
        ))}
      </select>
    </div>
  );
};

export default ProjectFilter;