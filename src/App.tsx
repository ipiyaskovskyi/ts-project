import CreateTaskForm from './components/CreateTaskForm';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Management System</h1>
        <p>Create and manage your tasks efficiently</p>
      </header>
      <main className="app-main">
        <CreateTaskForm />
      </main>
    </div>
  );
}

export default App;
