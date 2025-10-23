import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const totalProjects = projects.length;
    let activeTasks = 0;
    let completedTasks = 0;

    projects.forEach(project => {
      if (project.tasks) {
        project.tasks.forEach(task => {
          if (task.completed) {
            completedTasks++;
          } else {
            activeTasks++;
          }
        });
      }
    });

    setStats({ totalProjects, activeTasks, completedTasks });
    setRecentProjects(projects.slice(-3).reverse());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">📊 Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-sm font-medium opacity-90">Total Projects</h3>
              <p className="text-4xl font-bold mt-2">{stats.totalProjects}</p>
              <p className="text-sm mt-2 opacity-75">All your projects</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-sm font-medium opacity-90">Active Tasks</h3>
              <p className="text-4xl font-bold mt-2">{stats.activeTasks}</p>
              <p className="text-sm mt-2 opacity-75">Tasks in progress</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-sm font-medium opacity-90">Completed Tasks</h3>
              <p className="text-4xl font-bold mt-2">{stats.completedTasks}</p>
              <p className="text-sm mt-2 opacity-75">Tasks finished</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
            {recentProjects.length === 0 ? (
              <p className="text-gray-500">No projects yet. Create your first project!</p>
            ) : (
              <div className="space-y-3">
                {recentProjects.map(project => (
                  <div key={project.id} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                    <h3 className="font-bold">{project.name}</h3>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
