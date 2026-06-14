/** Authentication Views Layout */
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Hexagon } from "lucide-react";

export default function AuthLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex bg-[hsl(var(--background))]">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-primary-300/20 blur-2xl" />
        </div>
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
                <Hexagon className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">TeamHub</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Where teams build
              <br />
              <span className="text-primary-200">amazing things</span> together.
            </h1>
            <p className="text-lg text-primary-100/80 max-w-md leading-relaxed">
              Streamline your workflow, collaborate seamlessly, and deliver
              projects faster with TeamHub's powerful project management
              platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {["AJ", "SC", "MR", "PP"].map((initials, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-sm font-semibold"
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-primary-100/70">
              Trusted by <span className="text-white font-semibold">2,000+</span> teams worldwide
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
              <Hexagon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[hsl(var(--foreground))]">
              TeamHub
            </span>
          </div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
