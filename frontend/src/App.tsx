import { TasksPage } from './pages/TasksPage/TasksPage';
import './App.css';

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Management System</h1>
        <p>Create and manage your tasks efficiently</p>
      </header>
      <main className="app-main">
        <TasksPage />
      </main>
    </div>
  );
}

export default App;


