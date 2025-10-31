import { useNavigate } from 'react-router-dom';
import CreateTaskForm from '../../../components/CreateTaskForm';

export default function TaskCreate() {
  const navigate = useNavigate();
  return (
    <div>
      <CreateTaskForm onSuccess={() => navigate('/tasks')} />
    </div>
  );
}


