import './App.css';
import { AppRouter } from './router';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Management System</h1>
        <p>Create and manage your tasks efficiently</p>
      </header>
      <main className="app-main">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
