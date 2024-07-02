import   { useState, useEffect } from 'react';
import axios from 'axios';
import Project from '../components/Project';
import ProjectForm from '../components/ProjectForm';
import { API_BASE_URL } from '@/lib/config';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/projects`);
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className='p-6'>s
      <h1>Dashboard</h1>
      <ProjectForm fetchProjects={fetchProjects} />
      {projects.map(project => (
        <Project key={project._id} project={project} fetchProjects={fetchProjects} />
      ))}
    </div>
  );
};

export default Dashboard;
