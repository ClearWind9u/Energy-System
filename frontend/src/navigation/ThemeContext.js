import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDayMode, setIsDayMode] = useState(true);

  return (
    <ThemeContext.Provider value={{ isDayMode, setIsDayMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
