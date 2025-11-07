import { createTask, deleteTask, listTasks, updateTask } from "./api";
import type { Priority, Status, TaskType, DateString, TaskId } from "./dto/Task";

function formatDate(date?: DateString) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString();
}

function toDateInputValue(date?: DateString) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}
function formatDeadline(date?: DateString) {
  if (!date) return '—';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

function createDeleteHandler(task: TaskType, container: HTMLElement) {
  return async () => {
    if (!task.id) return;
    if (!confirm('Delete task?')) return;
    try {
      await deleteTask(task.id);
      await renderTasks(container);
    } catch (e) {
      alert('Delete error: ' + String(e));
    }
  };
}

function createTaskCard(task: TaskType, container: HTMLElement): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card shadow-sm';

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h5');
  title.className = 'card-title';
  title.textContent = task.title;

  const desc = document.createElement('p');
  desc.className = 'card-text';
  desc.textContent = task.description || '';

  const meta = document.createElement('p');
  meta.className = 'mb-1 text-muted small';
  meta.innerHTML = `Status: <strong>${task.status}</strong> • Priority: <strong>${task.priority}</strong>`;

  const deadline = document.createElement('p');
  deadline.className = 'mb-1 text-muted small';
  deadline.textContent = `Deadline: ${formatDeadline(task.deadline)}`;

  const created = document.createElement('p');
  created.className = 'mb-0 text-muted small';
  created.textContent = `Created: ${formatDate(task.createdAt)}`;

  const actions = document.createElement('div');
  actions.className = 'mt-3 d-flex gap-2';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn btn-sm btn-outline-primary';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => openEditModal(task));

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'btn btn-sm btn-outline-danger';
  delBtn.textContent = 'Delete';
  delBtn.addEventListener('click', createDeleteHandler(task, container));

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(meta);
  body.appendChild(deadline);
  body.appendChild(created);
  body.appendChild(actions);

  card.appendChild(body);
  return card;
}

async function renderTasks(container: HTMLElement) {
  container.innerHTML = `<div class="text-muted">Loading...</div>`;
  
  let tasks: TaskType[] = [];
  try {
    tasks = await listTasks();
  } catch (e) {
    container.innerHTML = `<div class="alert alert-danger">Error loading tasks: ${String(e)}</div>`;
    return;
  }

  if (tasks.length === 0) {
    container.innerHTML = `<div class="alert alert-info">No tasks.</div>`;
    return;
  }

  const list = document.createElement('div');
  list.className = 'd-flex flex-column gap-3';

  for (const task of tasks) {
    const card = createTaskCard(task, container);
    list.appendChild(card);
  }

  container.innerHTML = '';
  container.appendChild(list);
}

let editModalInstance: any = null;
let editModalEl: HTMLElement | null = null;

type TaskFormValues = {
  id?: TaskId;
  title: string;
  description: string;
  status?: Status;
  priority?: Priority;
  deadline?: string;
};

function normalizeTaskFormData(formData: FormData): TaskFormValues {
  const getStringValue = (name: string) => {
    const value = formData.get(name);
    return typeof value === 'string' ? value : '';
  };

  const idValue = getStringValue('id').trim();
  const statusValue = getStringValue('status').trim();
  const priorityValue = getStringValue('priority').trim();
  const deadlineValue = getStringValue('deadline').trim();

  return {
    id: idValue ? (idValue as TaskId) : undefined,
    title: getStringValue('title').trim(),
    description: getStringValue('description').trim(),
    status: statusValue ? (statusValue as Status) : undefined,
    priority: priorityValue ? (priorityValue as Priority) : undefined,
    deadline: deadlineValue || undefined,
  };
}

function validateTaskData(data: TaskFormValues): string | null {
  if (!data.title) {
    return 'Title is required';
  }

  if (data.deadline) {
    const deadlineDate = new Date(data.deadline);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (deadlineDate < now) {
      return 'Deadline cannot be in the past';
    }
  }

  return null;
}

async function handleEditTaskSubmit(ev: SubmitEvent) {
  ev.preventDefault();
  const form = ev.target as HTMLFormElement;
  const formData = new FormData(form);
  const values = normalizeTaskFormData(formData);

  const validationError = validateTaskData(values);
  if (validationError) {
    alert(validationError);
    return;
  }

  const { id, title, description, status, priority, deadline } = values;
  if (!id) {
    alert('Task id is missing');
    return;
  }
  const patch: Partial<TaskType> = {
    title,
    description,
    status,
    priority,
    deadline,
  };
  try {
    await updateTask(id, patch);
    editModalInstance.hide();
    const container = document.getElementById('tasks')!;
    await renderTasks(container);
  } catch (e) {
    alert('Update error: ' + String(e));
  }
}

function ensureEditModal() {
  if (editModalEl) return editModalEl;
  const tpl = document.createElement('div');
  tpl.innerHTML = `
    <div class="modal fade" id="editTaskModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <form class="modal-content" id="edit-task-form">
          <div class="modal-header">
            <h5 class="modal-title">Edit task</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" name="id" />
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input class="form-control" name="title" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" name="description" rows="3"></textarea>
            </div>
            <div class="row">
              <div class="col-6 mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" name="status">
                  <option value="todo">todo</option>
                  <option value="in-progress">in-progress</option>
                  <option value="done">done</option>
                </select>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">Priority</label>
                <select class="form-select" name="priority">
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Deadline</label>
              <input class="form-control" type="date" name="deadline" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
  editModalEl = tpl.firstElementChild as HTMLElement;
  document.body.appendChild(editModalEl);

  const modalEl = document.getElementById('editTaskModal')!;
  editModalInstance = window.bootstrap ? new window.bootstrap.Modal(modalEl) : null;

  const editForm = document.getElementById('edit-task-form') as HTMLFormElement;
  editForm.addEventListener('submit', handleEditTaskSubmit);

  return editModalEl;
}

function openEditModal(task: TaskType) {
  const modalEl = ensureEditModal();
  const form = modalEl.querySelector('#edit-task-form') as HTMLFormElement;
  (form.elements.namedItem('id') as HTMLInputElement).value = String(task.id || '');
  (form.elements.namedItem('title') as HTMLInputElement).value = task.title || '';
  (form.elements.namedItem('description') as HTMLTextAreaElement).value = task.description || '';
  (form.elements.namedItem('status') as HTMLSelectElement).value = task.status || 'todo';
  (form.elements.namedItem('priority') as HTMLSelectElement).value = task.priority || 'medium';
  (form.elements.namedItem('deadline') as HTMLInputElement).value = toDateInputValue(task.deadline);

  if (!editModalInstance) {
    const modalElDom = document.getElementById('editTaskModal')!;
    editModalInstance = window.bootstrap ? new window.bootstrap.Modal(modalElDom) : null;
  }
  editModalInstance.show();
}


async function handleCreateTaskSubmit(ev: SubmitEvent, container: HTMLElement) {
  ev.preventDefault();
  const form = ev.target as HTMLFormElement;
  const formData = new FormData(form);
  const values = normalizeTaskFormData(formData);

  const validationError = validateTaskData(values);
  if (validationError) {
    alert(validationError);
    return;
  }

  const newTask: Omit<TaskType, 'id'> = {
    title: values.title,
    description: values.description,
    status: values.status ?? 'todo',
    priority: values.priority ?? 'medium',
    deadline: values.deadline,
  };
  try {
    await createTask(newTask);
    form.reset();
    await renderTasks(container);
  } catch (e) {
    alert('Create error: ' + String(e));
  }
}

export function initUI() {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('tasks') as HTMLElement | null;
    const form = document.getElementById('task-form') as HTMLFormElement | null;
    if (!container || !form) return;

    renderTasks(container).catch((e) => console.error(e));

    form.addEventListener('submit', (ev) => handleCreateTaskSubmit(ev, container));
  });
}

initUI();