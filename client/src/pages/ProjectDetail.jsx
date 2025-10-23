import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const foundProject = projects.find(p => p.id === parseInt(id));
    if (foundProject) {
      setProject(foundProject);
    }
  }, [id]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const updatedProjects = projects.map(p => {
      if (p.id === parseInt(id)) {
        const task = {
          id: Date.now(),
          title: newTask,
          completed: false,
          createdAt: new Date().toISOString()
        };
        return { ...p, tasks: [...(p.tasks || []), task] };
      }
      return p;
    });

    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    const updatedProject = updatedProjects.find(p => p.id === parseInt(id));
    setProject(updatedProject);
    setNewTask('');
  };

  const handleToggleTask = (taskId) => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const updatedProjects = projects.map(p => {
      if (p.id === parseInt(id)) {
        return {
          ...p,
          tasks: p.tasks.map(t => 
            t.id === taskId ? { ...t, completed: !t.completed } : t
          )
        };
      }
      return p;
    });

    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    const updatedProject = updatedProjects.find(p => p.id === parseInt(id));
    setProject(updatedProject);
  };

  const handleDeleteTask = (taskId) => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const updatedProjects = projects.map(p => {
      if (p.id === parseInt(id)) {
        return { ...p, tasks: p.tasks.filter(t => t.id !== taskId) };
      }
      return p;
    });

    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    const updatedProject = updatedProjects.find(p => p.id === parseInt(id));
    setProject(updatedProject);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <button 
              onClick={() => navigate('/projects')}
              className="text-blue-600 hover:underline"
            >
              ← Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedTasks = project.tasks?.filter(t => t.completed).length || 0;
  const totalTasks = project.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/projects')}
            className="text-blue-600 hover:underline mb-6 flex items-center gap-2"
          >
            ← Back to Projects
          </button>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl shadow-lg mb-6">
            <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
            <p className="text-blue-100 text-lg">{project.description}</p>
            <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{completedTasks} / {totalTasks} tasks completed</span>
              </div>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-300"
                  style={{ width: progress + '%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">📝 Tasks</h2>
            
            <form onSubmit={handleAddTask} className="mb-8">
              <div className="flex gap-3">
                <input 
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add
                </button>
              </div>
            </form>

            {!project.tasks || project.tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">✍️</div>
                <p className="text-gray-500 text-lg">No tasks yet</p>
                <p className="text-gray-400">Add your first task to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {project.tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <input 
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        className="w-5 h-5 cursor-pointer accent-green-500"
                      />
                      <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}>
                        {task.title}
                      </span>
                      {task.completed && <span className="text-green-600 text-sm">✓ Completed</span>}
                    </div>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition"
                    >
                      🗑️
                    </button>
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
