import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor, Lock, Trash2, AlertTriangle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../utils";
import toast from "react-hot-toast";

const themes = [
  { id: "light", label: "Light", icon: Sun, desc: "Clean and bright" },
  { id: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
  { id: "system", label: "System", icon: Monitor, desc: "Match your device" },
];

export default function SettingsPage() {
  const { theme, changeTheme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    toast.success("Password changed successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          Settings
        </h1>
        <p className="mt-1 text-[hsl(var(--muted-foreground))]">
          Customize your TeamHub experience
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Appearance */}
        <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-1">
            Appearance
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5">
            Choose your preferred theme
          </p>

          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => changeTheme(t.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                    isActive
                      ? "border-primary-500 bg-primary-500/5"
                      : "border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))]/30"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isActive
                        ? "bg-primary-500/10 text-primary-500"
                        : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isActive
                          ? "text-primary-500"
                          : "text-[hsl(var(--foreground))]"
                      )}
                    >
                      {t.label}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                      {t.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Change Password */}
        <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-1">
            Change Password
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5">
            Update your password to keep your account secure
          </p>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="Enter current password"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-medium shadow-lg shadow-primary-500/25 transition-all"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl border border-danger-500/20 bg-danger-50/50 dark:bg-danger-500/5">
          <h3 className="text-base font-semibold text-danger-600 dark:text-danger-500 mb-1">
            Danger Zone
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
            Once you delete your account, there is no going back.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-danger-500/30 text-danger-600 dark:text-danger-500 text-sm font-medium hover:bg-danger-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/20">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-danger-600 dark:text-danger-500">
                    Are you absolutely sure?
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    This action cannot be undone. All your data will be
                    permanently deleted.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.error("Account deletion is disabled in demo mode");
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-danger-500 hover:bg-danger-600 text-white text-sm font-medium transition-colors"
                >
                  Yes, delete my account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
