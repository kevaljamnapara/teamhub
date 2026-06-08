import { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Loader2, AlertCircle } from "lucide-react";
import {
  fetchProjects,
  setSearchQuery,
  setStatusFilter,
  selectFilteredProjects,
  selectProjectsLoading,
  selectProjectsError,
} from "../../store/slices/projectSlice";
import { fetchUsers } from "../../store/slices/usersSlice";
import ProjectCard from "../../components/project/ProjectCard";
import CreateProjectModal from "../../components/project/CreateProjectModal";

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const projects = useSelector(selectFilteredProjects);
  const loading = useSelector(selectProjectsLoading);
  const error = useSelector(selectProjectsError);
  const { searchQuery, statusFilter } = useSelector((state) => state.projects);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Projects</h1>
          <p className="mt-1 text-[hsl(var(--muted-foreground))]">
            Manage and track all your projects
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-medium shadow-lg shadow-primary-500/25 hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          {["all", "active", "on_hold", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => dispatch(setStatusFilter(status))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === status
                  ? "bg-primary-500/10 text-primary-600 dark:text-primary-400"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
              }`}
            >
              {status === "all"
                ? "All"
                : status === "on_hold"
                ? "On Hold"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-3" />
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading projects...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-danger-500/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-danger-500" />
          </div>
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-1">
            Failed to Load Projects
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchProjects())}
            className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
          </div>
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-1">
            No Projects Found
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm">
            {searchQuery
              ? "Try adjusting your search or filter criteria."
              : "Create your first project to get started."}
          </p>
        </div>
      )}

      <CreateProjectModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </motion.div>
  );
}
