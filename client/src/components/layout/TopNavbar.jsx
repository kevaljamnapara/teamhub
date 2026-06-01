import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Bell,
  Menu,
  LogOut,
  User,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { toggleMobileSidebar } from "../../store/slices/uiSlice";
import { selectUnreadCount } from "../../store/slices/notificationSlice";
import { logout } from "../../store/slices/authSlice";
import { useTheme } from "../../context/ThemeContext";
import { cn, getInitials } from "../../utils";
import { useIsMobile } from "../../hooks/useMediaQuery";

export default function TopNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const user = useSelector((state) => state.auth.user);
  const unreadCount = useSelector(selectUnreadCount);
  const { theme, changeTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  return (
    <header className="h-16 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={() => dispatch(toggleMobileSidebar())}
            className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search */}
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200",
            searchFocused
              ? "border-primary-500 bg-[hsl(var(--background))] shadow-sm shadow-primary-500/10 w-80"
              : "border-[hsl(var(--border))] bg-[hsl(var(--accent))]/50 w-64"
          )}
        >
          <Search className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none w-full"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {!isMobile && (
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] text-xs font-mono">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() =>
            changeTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] transition-colors"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-lg hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary-500 text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[hsl(var(--accent))] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
              {user ? getInitials(user.name) : "?"}
            </div>
            {!isMobile && (
              <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                {user?.name?.split(" ")[0] || "Guest"}
              </span>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-xl shadow-xl animate-fade-in z-50">
              <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {user?.name}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {user?.email}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
              <div className="border-t border-[hsl(var(--border))] pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
