import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  searchQuery: "",
  statusFilter: "all",
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects(state, action) {
      state.projects = action.payload;
    },
    addProject(state, action) {
      state.projects.unshift(action.payload);
    },
    updateProject(state, action) {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload };
      }
    },
    deleteProject(state, action) {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
    setSelectedProject(state, action) {
      state.selectedProject = action.payload;
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
  },
});

export const {
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setSelectedProject,
  setLoading,
  setSearchQuery,
  setStatusFilter,
} = projectSlice.actions;

export const selectFilteredProjects = (state) => {
  let projects = state.projects.projects;
  const query = state.projects.searchQuery.toLowerCase();
  const status = state.projects.statusFilter;

  if (query) {
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  if (status !== "all") {
    projects = projects.filter((p) => p.status === status);
  }

  return projects;
};

export default projectSlice.reducer;
