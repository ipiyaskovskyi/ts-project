import type {
  KanbanTask,
  UserProfile,
  TimeSlot,
  EfficiencyItem,
  CompletedTaskData,
} from "../types";

export const mockKanbanTasks: KanbanTask[] = [
  {
    id: 1,
    title: "Main Task",
    description: "Task description with execution details",
    type: "Task",
    status: "draft",
    priority: "medium",
    createdAt: new Date(2024, 0, 15),
    deadline: new Date(2024, 1, 15),
    subtasks: [
      {
        id: "sub-1",
        label: "A",
        title: "Incididunt ut labore et dolore",
        completed: false,
      },
      { id: "sub-2", label: "B", title: "Magna aliqua enim", completed: false },
    ],
    comments: 3,
    files: 0,
    stars: 2,
  },
  {
    id: 2,
    title: "Main Task",
    description: "Important task requiring quick execution",
    type: "Bug",
    status: "in_progress",
    priority: "high",
    createdAt: new Date(2024, 0, 20),
    deadline: new Date(2024, 1, 10),
    subtasks: [
      {
        id: "sub-3",
        label: "C",
        title: "Incididunt ut labore et dolore",
        completed: false,
      },
    ],
    comments: 1,
    files: 0,
    stars: 5,
    progress: 75,
  },
  {
    id: 3,
    title: "Main Task",
    description: "Task for editing and review",
    type: "Story",
    status: "editing",
    priority: "low",
    createdAt: new Date(2024, 0, 25),
    deadline: new Date(2024, 1, 25),
    subtasks: [
      {
        id: "sub-4",
        label: "",
        title: "Adipiscing elit sed do eiusmod",
        completed: false,
      },
      {
        id: "sub-5",
        label: "",
        title: "Et dolore magna aliqua",
        completed: false,
      },
      {
        id: "sub-6",
        label: "",
        title: "Excepteur sint occaecat cupidatat",
        completed: false,
      },
    ],
    comments: 0,
    files: 0,
    stars: 0,
    supervisor: "Supervisor",
  },
  {
    id: 4,
    title: "Main Task",
    description: "Completed task with all subtasks finished",
    type: "Epic",
    status: "done",
    priority: "urgent",
    createdAt: new Date(2024, 0, 10),
    deadline: new Date(2024, 0, 30),
    subtasks: [
      {
        id: "sub-7",
        label: "A",
        title: "Incididunt ut labore et...",
        completed: true,
      },
      {
        id: "sub-8",
        label: "B",
        title: "Magna aliqua enim...",
        completed: true,
      },
      {
        id: "sub-9",
        label: "C",
        title: "Incididunt ut labore et...",
        completed: true,
      },
    ],
    comments: 0,
    files: 0,
    stars: 0,
  },
];

export const mockUserProfile: UserProfile = {
  id: "user-1",
  name: "Name",
  surname: "Surname",
  description: "Adipiscing elit sed do eiusmod",
};

export const mockTimeSlots: TimeSlot[] = [
  { id: "slot-1", title: "ABC", startTime: "12:00", endTime: "13:00" },
  { id: "slot-2", title: "ABC", startTime: "13:00", endTime: "14:00" },
];

export const mockEfficiency: EfficiencyItem[] = [
  { id: "eff-a", label: "A", percentage: 75, color: "#3b82f6" },
  { id: "eff-b", label: "B", percentage: 44, color: "#6b7280" },
  { id: "eff-c", label: "C", percentage: 68, color: "#ec4899" },
  { id: "eff-d", label: "D", percentage: 55, color: "#f59e0b" },
];

export const mockCompletedTasks: CompletedTaskData[] = [
  { id: "comp-1", author: "Author A", count: 210 },
  { id: "comp-2", author: "Author B", count: 110 },
  { id: "comp-3", author: "Author C", count: 176 },
  { id: "comp-4", author: "Author D", count: 145 },
];
