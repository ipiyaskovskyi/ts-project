import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TasksList from './features/tasks/pages/TasksList';
import TaskDetails from './features/tasks/pages/TaskDetails';
import TaskCreate from './features/tasks/pages/TaskCreate';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TasksList />,
  },
  {
    path: '/tasks',
    element: <TasksList />,
  },
  {
    path: '/tasks/create',
    element: <TaskCreate />,
  },
  {
    path: '/tasks/:id',
    element: <TaskDetails />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}


