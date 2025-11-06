import { useState, useMemo } from 'react';
import { Header } from './components/Layout/Header';
import { KanbanBoard } from './components/Kanban/KanbanBoard';
import { Toolbar } from './components/Kanban/Toolbar';
import { CreateTaskModal } from './components/Kanban/CreateTaskModal';
import {
  mockKanbanTasks,
} from './data/mockData';
import type { KanbanTask, KanbanStatus, Priority, TaskType } from './types';
import './App.css';

interface FilterState {
  status: KanbanStatus | '';
  priority: string;
  createdFrom: string;
  createdTo: string;
}

function App() {
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(mockKanbanTasks);
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    priority: '',
    createdFrom: '',
    createdTo: '',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleTaskMove = (taskId: string, newStatus: KanbanStatus) => {
    setKanbanTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleCreateTask = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateTaskSubmit = (data: {
    title: string;
    description: string;
    type: TaskType;
    status: KanbanStatus;
    priority: Priority;
    deadline: string;
  }) => {
    const newTask: KanbanTask = {
      id: `kanban-${Date.now()}`,
      title: data.title,
      description: data.description || undefined,
      type: data.type,
      status: data.status,
      priority: data.priority,
      createdDate: new Date(),
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      subtasks: [],
      comments: 0,
      files: 0,
      stars: 0,
    };
    setKanbanTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const displayedTasks = useMemo(() => {
    return kanbanTasks.filter((task) => {
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      if (filters.createdFrom) {
        const fromDate = new Date(filters.createdFrom);
        fromDate.setHours(0, 0, 0, 0);
        const taskDate = new Date(task.createdDate);
        taskDate.setHours(0, 0, 0, 0);
        if (taskDate < fromDate) {
          return false;
        }
      }

      if (filters.createdTo) {
        const toDate = new Date(filters.createdTo);
        toDate.setHours(23, 59, 59, 999);
        const taskDate = new Date(task.createdDate);
        taskDate.setHours(0, 0, 0, 0);
        if (taskDate > toDate) {
          return false;
        }
      }

      return true;
    });
  }, [kanbanTasks, filters]);

  return (
    <div className="app-container">
      <Header />
      <div className="app-content">
        <main className="main-content">
          <Toolbar onCreateTask={handleCreateTask} onFilterChange={handleFilterChange} />
          <div style={{ padding: 'var(--spacing-lg)' }}>
            <KanbanBoard tasks={displayedTasks} onTaskMove={handleTaskMove} />
          </div>
        </main>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTaskSubmit}
      />
    </div>
  );
}

export default App;
