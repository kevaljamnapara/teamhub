/** Theme Management Context */
import { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../store/slices/uiSlice";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (resolvedTheme) => {
      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);
    };

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      applyTheme(systemTheme);

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e) => applyTheme(e.matches ? "dark" : "light");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
