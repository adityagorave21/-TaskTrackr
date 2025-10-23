import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    setProjects(savedProjects);
  }, []);

  const handleAddProject = (e) => {
    e.preventDefault();
    const project = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      tasks: [],
      createdAt: new Date().toISOString()
    };
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setNewProject({ name: '', description: '' });
    setShowModal(false);
  };

  const handleDeleteProject = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">📁 Projects</h1>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition font-medium"
            >
              ➕ New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white p-16 rounded-xl shadow-md text-center">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 text-lg mb-4">No projects yet</p>
              <p className="text-gray-400 mb-6">Create your first project to get started!</p>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition border-t-4 border-blue-500">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{project.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>📝 {project.tasks?.length || 0} tasks</span>
                    <span>✅ {project.tasks?.filter(t => t.completed).length || 0} done</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(/projects/)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Open →
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
                <form onSubmit={handleAddProject}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Project Name *</label>
                    <input 
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Website Redesign"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Description *</label>
                    <textarea 
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      placeholder="Describe your project..."
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      Create Project
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
