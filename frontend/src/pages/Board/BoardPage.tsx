import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { deleteTask, fetchTaskById, updateTask } from '../../api/tasks';
import type { Status, Task, Priority, TaskType } from '../../types';
import { Header } from '../../components/Layout/Header';
import {
  STATUSES,
  PRIORITIES,
  TASK_TYPES,
  STATUS_LABELS,
  PRIORITY_LABELS,
} from '../../components/Board/constants';

export const BoardPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  interface FormData {
    title: string;
    description: string;
    type: TaskType;
    status: Status;
    priority: Priority;
    deadline: string;
  }

  const initialFormData: FormData = useMemo(
    () => ({
      title: task?.title ?? '',
      description: task?.description ?? '',
      type: (task?.type ?? 'Task') as TaskType,
      status: task?.status ?? 'todo',
      priority: task?.priority ?? 'medium',
      deadline: task?.deadline ? formatDateInput(task.deadline) : '',
    }),
    [task]
  );

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [titleError, setTitleError] = useState<string>('');

  useEffect(() => {
    const loadTask = async () => {
      if (!ticketId) {
        setError('Ticket ID is missing');
        setIsLoading(false);
        return;
      }

      const numericId = Number(ticketId);
      if (Number.isNaN(numericId)) {
        setError('Invalid ticket ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedTask = await fetchTaskById(numericId);
        setTask(fetchedTask);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : 'Failed to load the ticket'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [ticketId]);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setTitleError('');

    if (!task) {
      setError('Cannot update unknown ticket');
      return;
    }

    if (!formData.title.trim()) {
      setTitleError('Title cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = await updateTask(task.id, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        status: formData.status,
        priority: formData.priority,
        deadline: formData.deadline || undefined,
      });
      setTask(updated);
      setSuccess('Changes saved successfully.');
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to update the ticket'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!task) {
      return;
    }

    setError(null);
    setSuccess(null);
    try {
      setIsDeleting(true);
      await deleteTask(task.id);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to delete the ticket'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={400}
          >
            <CircularProgress />
          </Box>
        ) : error && !task ? (
          <Alert severity="error">{error}</Alert>
        ) : !task ? (
          <Alert severity="warning">Ticket not found.</Alert>
        ) : (
          <Paper elevation={2} sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Edit Ticket
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    TM-{task.id}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  disabled={isDeleting || isSubmitting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </Box>

              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" onClose={() => setSuccess(null)}>
                  {success}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Title"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }));
                      if (titleError) setTitleError('');
                    }}
                    error={!!titleError}
                    helperText={titleError}
                  />

                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={formData.status}
                          label="Status"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              status: e.target.value as Status,
                            }))
                          }
                        >
                          {STATUSES.map((statusOption) => (
                            <MenuItem key={statusOption} value={statusOption}>
                              {STATUS_LABELS[statusOption]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={formData.priority}
                          label="Priority"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              priority: e.target.value as Priority,
                            }))
                          }
                        >
                          {PRIORITIES.map((priorityOption) => (
                            <MenuItem
                              key={priorityOption}
                              value={priorityOption}
                            >
                              {PRIORITY_LABELS[priorityOption]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={formData.type}
                          label="Type"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              type: e.target.value as TaskType,
                            }))
                          }
                        >
                          {TASK_TYPES.map((typeOption) => (
                            <MenuItem key={typeOption} value={typeOption}>
                              {typeOption}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Deadline"
                        value={formData.deadline}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            deadline: e.target.value,
                          }))
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      onClick={handleCancel}
                      disabled={isSubmitting || isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting || isDeleting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save changes'}
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

function formatDateInput(date: Date | string): string {
  const instance = date instanceof Date ? date : new Date(date);
  const year = instance.getFullYear();
  const month = `${instance.getMonth() + 1}`.padStart(2, '0');
  const day = `${instance.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}
