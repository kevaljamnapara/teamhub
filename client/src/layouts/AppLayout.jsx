/** Main Application Layout Wrapper */
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import { setMobileSidebarOpen } from "../store/slices/uiSlice";
import { useIsMobile } from "../hooks/useMediaQuery";

export default function AppLayout() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const sidebarMobileOpen = useSelector((state) => state.ui.sidebarMobileOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-[hsl(var(--background))]">
      {/* Desktop sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobile && sidebarMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(setMobileSidebarOpen(false))}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
