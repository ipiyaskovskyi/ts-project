import { createTask, deleteTask, listTasks, updateTask } from "./api";
import type { Priority, Status, TaskType, DateString } from "./dto/Task";

function showMessage(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
  const toastContainer = getOrCreateToastContainer();
  
  const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const bgClass = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info'
  }[type];

  const toastEl = document.createElement('div');
  toastEl.id = toastId;
  toastEl.className = `toast ${bgClass} text-white`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <div class="toast-header ${bgClass} text-white">
      <strong class="me-auto">${type === 'error' ? 'Error' : type === 'success' ? 'Success' : type === 'warning' ? 'Warning' : 'Info'}</strong>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `;

  toastContainer.appendChild(toastEl);

  const toast = window.bootstrap ? new window.bootstrap.Toast(toastEl, {
    autohide: true,
    delay: type === 'error' ? 5000 : 3000
  }) : null;

  if (toast) {
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  }
}

function getOrCreateToastContainer(): HTMLElement {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }
  return container;
}

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

async function fetchTasks(): Promise<TaskType[]> {
  return await listTasks();
}

function createDeleteHandler(task: TaskType, container: HTMLElement) {
  return () => {
    if (!task.id) return;
    openDeleteModal(task.id, async () => {
      try {
        await deleteTask(task.id!);
        await renderTasks(container);
        showMessage('Task deleted successfully', 'success');
      } catch (e) {
        showMessage('Delete error: ' + String(e), 'error');
      }
    });
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
    tasks = await fetchTasks();
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
let deleteModalInstance: any = null;
let deleteModalEl: HTMLElement | null = null;
let deleteTaskCallback: (() => Promise<void>) | null = null;

function validateTaskData(data: Record<string, FormDataEntryValue>): string | null {
  const title = (data.title as string || '').trim();
  if (!title) {
    return 'Title is required';
  }

  const deadline = (data.deadline as string) || undefined;
  if (deadline) {
    const deadlineDate = new Date(deadline);
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
  const data = Object.fromEntries(formData);
  
  const validationError = validateTaskData(data);
  if (validationError) {
    showMessage(validationError, 'warning');
    return;
  }

  const id = Number(data.id);
  const title = (data.title as string || '').trim();
  const patch: Partial<TaskType> = {
    title,
    description: (data.description as string || '').trim(),
    status: (data.status as string) as TaskType['status'],
    priority: (data.priority as string) as TaskType['priority'],
    deadline: (data.deadline as string) || undefined,
  };
  try {
    await updateTask(id, patch);
    editModalInstance.hide();
    const container = document.getElementById('tasks')!;
    await renderTasks(container);
    showMessage('Task updated successfully', 'success');
  } catch (e) {
    showMessage('Update error: ' + String(e), 'error');
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

function ensureDeleteModal() {
  if (deleteModalEl) return deleteModalEl;
  const tpl = document.createElement('div');
  tpl.innerHTML = `
    <div class="modal fade" id="deleteTaskModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete task</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="confirm-delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;
  deleteModalEl = tpl.firstElementChild as HTMLElement;
  document.body.appendChild(deleteModalEl);

  const modalEl = document.getElementById('deleteTaskModal')!;
  deleteModalInstance = window.bootstrap ? new window.bootstrap.Modal(modalEl) : null;

  const confirmBtn = document.getElementById('confirm-delete-btn')!;
  confirmBtn.addEventListener('click', () => {
    if (deleteTaskCallback) {
      deleteTaskCallback();
      deleteTaskCallback = null;
    }
    if (deleteModalInstance) {
      deleteModalInstance.hide();
    }
  });

  return deleteModalEl;
}

function openDeleteModal(_taskId: number, callback: () => Promise<void>) {
  ensureDeleteModal();
  deleteTaskCallback = callback;

  if (!deleteModalInstance) {
    const modalElDom = document.getElementById('deleteTaskModal')!;
    deleteModalInstance = window.bootstrap ? new window.bootstrap.Modal(modalElDom) : null;
  }
  deleteModalInstance.show();
}


async function handleCreateTaskSubmit(ev: SubmitEvent, container: HTMLElement) {
  ev.preventDefault();
  const form = ev.target as HTMLFormElement;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  const validationError = validateTaskData(data);
  if (validationError) {
    showMessage(validationError, 'warning');
    return;
  }

  const title = (data.title as string || '').trim();
  const description = (data.description as string || '').trim();
  const status = (data.status as string) as Status;
  const priority = (data.priority as string) as Priority;
  const deadline = (data.deadline as string) || undefined;

  const newTask: Omit<TaskType, 'id'> = { title, description, status, priority, deadline };
  try {
    await createTask(newTask);
    form.reset();
    await renderTasks(container);
    showMessage('Task created successfully', 'success');
  } catch (e) {
    showMessage('Create error: ' + String(e), 'error');
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