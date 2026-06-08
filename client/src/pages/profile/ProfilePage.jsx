import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Camera, Save, X, Loader2 } from "lucide-react";
import { updateProfile } from "../../store/slices/authSlice";
import { getInitials } from "../../utils";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put("/users/profile", {
        name: form.name,
        bio: form.bio,
      });
      // Update Redux auth state with the new profile data
      const updatedUser = response.data.data?.user || response.data.data;
      dispatch(updateProfile(updatedUser));
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      bio: user?.bio || "",
    });
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          Profile
        </h1>
        <p className="mt-1 text-[hsl(var(--muted-foreground))]">
          Manage your personal information
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Avatar section */}
        <div className="flex items-center gap-6 mb-8 p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/25">
              {getInitials(user?.name)}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-[hsl(var(--background))] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors shadow-sm">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
              {user?.name}
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {user?.role}
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">
              Personal Information
            </h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-primary-500 hover:bg-primary-500/10 transition-colors"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] transition-colors flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Email
              </label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                Email cannot be changed for security reasons.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Role
              </label>
              <input
                value={user?.role || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                disabled={!editing}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
