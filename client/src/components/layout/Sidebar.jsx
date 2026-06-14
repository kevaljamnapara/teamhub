/** Application Sidebar Component */
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Hexagon,
} from "lucide-react";
import { NAV_ITEMS } from "../../constants/navigation";
import {
  toggleSidebar,
  setMobileSidebarOpen,
} from "../../store/slices/uiSlice";
import { selectUnreadCount } from "../../store/slices/notificationSlice";
import { cn, getInitials } from "../../utils";
import { useIsMobile } from "../../hooks/useMediaQuery";

export default function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isMobile = useIsMobile();
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const user = useSelector((state) => state.auth.user);
  const unreadCount = useSelector(selectUnreadCount);

  const handleToggle = () => {
    if (isMobile) {
      dispatch(setMobileSidebarOpen(false));
    } else {
      dispatch(toggleSidebar());
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      dispatch(setMobileSidebarOpen(false));
    }
  };

  const sidebarWidth = collapsed && !isMobile ? "w-[72px]" : "w-[260px]";

  return (
    <motion.aside
      className={cn(
        "h-screen flex flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--sidebar-background))] transition-all duration-300 ease-in-out relative z-40",
        sidebarWidth
      )}
      layout
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
            <Hexagon className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-lg text-[hsl(var(--foreground))] whitespace-nowrap overflow-hidden"
              >
                TeamHub
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {!isMobile && (
          <button
            onClick={handleToggle}
            className="p-1.5 rounded-lg hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");
          const showBadge = item.label === "Notifications" && unreadCount > 0;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-primary-500/10 text-primary-600 dark:text-primary-400"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive
                    ? "text-primary-500"
                    : "text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]"
                )}
              />
              <AnimatePresence>
                {(!collapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {showBadge && (!collapsed || isMobile) && (
                <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary-500 text-white text-xs font-semibold">
                  {unreadCount}
                </span>
              )}
              {showBadge && collapsed && !isMobile && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-[hsl(var(--sidebar-background))]" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-[hsl(var(--sidebar-border))] p-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[hsl(var(--accent))] transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {user ? getInitials(user.name) : "?"}
          </div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                  {user?.name || "Guest"}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                  {user?.role || "User"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
