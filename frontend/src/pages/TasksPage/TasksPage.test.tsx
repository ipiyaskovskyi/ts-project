import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, vi } from "vitest";
import { createTask, listTasks } from "../../api/tasks";
import { TasksPage } from "./TasksPage";

vi.mock("../../api/tasks", () => ({
  listTasks: vi.fn(),
  createTask: vi.fn(),
}));

const mockedListTasks = vi.mocked(listTasks);
const mockedCreateTask = vi.mocked(createTask);

describe("TasksPage", () => {
  beforeEach(() => {
    mockedListTasks.mockResolvedValue([]);
    mockedCreateTask.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads tasks on mount and renders them", async () => {
    mockedListTasks.mockResolvedValue([
      {
        id: 1,
        title: "Demo task",
        description: "Demo description",
        status: "todo",
        priority: "medium",
        assignee: null,
        deadline: null,
      },
    ]);

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText("Demo task")).toBeInTheDocument();
    });
  });

  it("shows error state when loading fails and allows retry", async () => {
    mockedListTasks.mockRejectedValueOnce(new Error("Server unavailable"));

    const user = userEvent.setup();
    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Server unavailable");
    });

    mockedListTasks.mockResolvedValueOnce([]);
    await user.click(screen.getByRole("button", { name: /try again/i }));

    await waitFor(() => {
      expect(mockedListTasks).toHaveBeenCalledTimes(2);
    });
  });
});
