import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

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

// ─── Async Thunks ────────────────────────────────────────────

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tasks");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks."
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post("/tasks", taskData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task."
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/tasks/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task."
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      return taskId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task."
      );
    }
  }
);

// Comments
export const fetchComments = createAsyncThunk(
  "tasks/fetchComments",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tasks/${taskId}/comments`);
      return { taskId, comments: response.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments."
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "tasks/addComment",
  async ({ taskId, text }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { text });
      return { taskId, comment: response.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment."
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "tasks/deleteComment",
  async ({ taskId, commentId }, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/comments/${commentId}`);
      return { taskId, commentId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment."
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setSelectedTask(state, action) {
      state.selectedTask = action.payload;
    },
    clearSelectedTask(state) {
      state.selectedTask = null;
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
    taskCreated(state, action) {
      state.tasks.unshift(action.payload);
    },
    taskUpdated(state, action) {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id || t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.selectedTask && (state.selectedTask.id === action.payload.id || state.selectedTask._id === action.payload._id)) {
        state.selectedTask = action.payload;
      }
    },
    commentAdded(state, action) {
      const { taskId, comment } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId || t._id === taskId);
      if (task) {
        if (!task.comments) task.comments = [];
        task.comments.push(comment);
      }
      if (state.selectedTask && (state.selectedTask.id === taskId || state.selectedTask._id === taskId)) {
        if (!state.selectedTask.comments) state.selectedTask.comments = [];
        state.selectedTask.comments.push(comment);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id || t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.selectedTask && (state.selectedTask.id === action.payload.id || state.selectedTask._id === action.payload._id)) {
          state.selectedTask = action.payload;
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload && t._id !== action.payload);
        if (state.selectedTask && (state.selectedTask.id === action.payload || state.selectedTask._id === action.payload)) {
          state.selectedTask = null;
        }
      })
      // Fetch Comments
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { taskId, comments } = action.payload;
        const task = state.tasks.find((t) => t.id === taskId || t._id === taskId);
        if (task) {
          task.comments = comments;
        }
        if (state.selectedTask && (state.selectedTask.id === taskId || state.selectedTask._id === taskId)) {
          state.selectedTask.comments = comments;
        }
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { taskId, comment } = action.payload;
        const task = state.tasks.find((t) => t.id === taskId || t._id === taskId);
        if (task) {
          if (!task.comments) task.comments = [];
          task.comments.push(comment);
        }
        if (state.selectedTask && (state.selectedTask.id === taskId || state.selectedTask._id === taskId)) {
          if (!state.selectedTask.comments) state.selectedTask.comments = [];
          state.selectedTask.comments.push(comment);
        }
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { taskId, commentId } = action.payload;
        const task = state.tasks.find((t) => t.id === taskId || t._id === taskId);
        if (task && task.comments) {
          task.comments = task.comments.filter(c => c.id !== commentId && c._id !== commentId);
        }
        if (state.selectedTask && (state.selectedTask.id === taskId || state.selectedTask._id === taskId) && state.selectedTask.comments) {
          state.selectedTask.comments = state.selectedTask.comments.filter(c => c.id !== commentId && c._id !== commentId);
        }
      });
  },
});

export const {
  setSelectedTask,
  clearSelectedTask,
  setSearchQuery,
  setStatusFilter,
  setPriorityFilter,
  setProjectFilter,
  setSortBy,
  setSortOrder,
  taskCreated,
  taskUpdated,
  commentAdded,
} = taskSlice.actions;

/**
 * Selector to filter tasks based on search query, status, priority, and project
 * @param {Object} state - The Redux state object
 * @returns {Array} Array of filtered task objects
 */
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
