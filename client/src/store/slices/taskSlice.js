import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
  searchQuery: "",
  statusFilter: "all",
  priorityFilter: "all",
  projectFilter: "all",
  sortBy: "dueDate",
  sortOrder: "asc",
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks(state, action) {
      state.tasks = action.payload;
    },
    addTask(state, action) {
      state.tasks.unshift(action.payload);
    },
    updateTask(state, action) {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    setSelectedTask(state, action) {
      state.selectedTask = action.payload;
    },
    clearSelectedTask(state) {
      state.selectedTask = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setPriorityFilter(state, action) {
      state.priorityFilter = action.payload;
    },
    setProjectFilter(state, action) {
      state.projectFilter = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setSortOrder(state, action) {
      state.sortOrder = action.payload;
    },
    addComment(state, action) {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.comments.push(action.payload.comment);
      }
      if (state.selectedTask?.id === action.payload.taskId) {
        state.selectedTask.comments.push(action.payload.comment);
      }
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setSelectedTask,
  clearSelectedTask,
  setLoading,
  setSearchQuery,
  setStatusFilter,
  setPriorityFilter,
  setProjectFilter,
  setSortBy,
  setSortOrder,
  addComment,
} = taskSlice.actions;

export const selectFilteredTasks = (state) => {
  let tasks = state.tasks.tasks;
  const query = state.tasks.searchQuery.toLowerCase();
  const status = state.tasks.statusFilter;
  const priority = state.tasks.priorityFilter;
  const project = state.tasks.projectFilter;

  if (query) {
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
    );
  }

  if (status !== "all") {
    tasks = tasks.filter((t) => t.status === status);
  }

  if (priority !== "all") {
    tasks = tasks.filter((t) => t.priority === priority);
  }

  if (project !== "all") {
    tasks = tasks.filter((t) => t.projectId === project);
  }

  return tasks;
};

export default taskSlice.reducer;
