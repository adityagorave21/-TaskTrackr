# 📋 TaskTrackr

A modern, beautiful task management application built with React and Tailwind CSS. Organize your projects, track tasks, and boost your productivity!

![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- 📊 **Dashboard** - Real-time statistics showing projects and tasks
- 📁 **Project Management** - Create, view, and delete projects
- ✅ **Task Tracking** - Add, complete, and manage tasks within projects
- 📈 **Progress Tracking** - Visual progress bars for each project
- 💾 **Auto-Save** - All data persists automatically in localStorage
- 🔐 **Authentication** - Login/Register functionality
- 📱 **Responsive** - Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/tasktrackr.git
cd tasktrackr
```

2. **Install dependencies**
```bash
cd client
npm install
```

3. **Install Tailwind CSS & PostCSS**
```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend Framework |
| Tailwind CSS | Styling |
| Vite | Build Tool |
| React Router | Routing |
| localStorage | Data Persistence |

## 📁 Project Structure
```
TaskTrackr/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx          # Navigation component
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── Projects.jsx        # Projects list
│   │   │   ├── ProjectDetail.jsx   # Project details & tasks
│   │   │   ├── Login.jsx           # Login page
│   │   │   └── Register.jsx        # Registration page
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## 🎯 How to Use

### 1. **Login/Register**
   - Enter any email and password to get started
   - No backend required - perfect for demo!

### 2. **Create a Project**
   - Go to Projects page
   - Click "➕ New Project"
   - Fill in name and description
   - Click "Create Project"

### 3. **Manage Tasks**
   - Click on any project
   - Add tasks using the input field
   - Check boxes to mark complete
   - Delete tasks with 🗑️ icon

### 4. **Track Progress**
   - View dashboard for statistics
   - See progress bars on project details
   - Monitor active vs completed tasks

## 📦 Build for Production
```bash
npm run build
```

Production files will be in the `dist` folder.

## 🌐 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Run `npm run build`
2. Upload the `dist` folder to Netlify

## 🔮 Future Enhancements

- [ ] Backend integration with Node.js/Express
- [ ] Database support (MongoDB/PostgreSQL)
- [ ] User authentication with JWT
- [ ] Task due dates and reminders
- [ ] Task priorities and categories
- [ ] Team collaboration features
- [ ] Export projects to PDF
- [ ] Dark mode toggle

