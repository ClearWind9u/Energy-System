// import React, { createContext, useState, useContext, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [isDayMode, setIsDayMode] = useState(true);
//   useEffect(() => {
//     const getUserToken = async () => {
//       let data = {
//         username: process.env.ACCOUNT,
//         password: process.env.PASSWORD,
//       };
//       const apiURL = `${process.env.CORE_IOT_URL}/auth/login`;
//       try {
//         const response = await axios.post(apiURL, data);
//         if (response) {
//           console.log("Get user token successfully");
//           await AsyncStorage.setItem(
//             "userToken",
//             response.data["token"].toString()
//           );
//           await AsyncStorage.setItem(
//             "refreshToken",
//             response.data["refreshToken"].toString()
//           );
//         }
//       } catch (error) {
//         console.log("Lỗi ", error);
//       }
//     };
//     getUserToken();
//   }, []);
//   return (
//     <ThemeContext.Provider value={{ isDayMode, setIsDayMode }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);

import React, { createContext, useState, useContext, useEffect } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDayMode, setIsDayMode] = useState(true);

  // Load theme and initial token on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        if (storedTheme !== null) {
          setIsDayMode(JSON.parse(storedTheme));
        }
        await getUserToken();
      } catch (error) {
        console.log("Error initializing app:", error);
      }
    };

    initializeApp();
  }, []);

  // Save theme whenever it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem("theme", JSON.stringify(isDayMode));
      } catch (error) {
        console.log("Error saving theme:", error);
      }
    };
    saveTheme();
  }, [isDayMode]);

  // Listen to app state changes to trigger token fetch on app start
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        console.log("App has come to the foreground, checking token...");
        getUserToken();
      }
    };

    // Subscribe to AppState changes
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    // Cleanup subscription on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiration = payload.exp * 1000; // Convert Unix seconds to milliseconds
      return Date.now() < expiration;
    } catch (error) {
      console.log("Error parsing token:", error);
      return false;
    }
  };

  const getUserToken = async () => {
    // Check if a valid token exists
    const existingToken = await AsyncStorage.getItem("userToken");
    if (existingToken && isTokenValid(existingToken)) {
      console.log("Valid token found, skipping login");
      return true;
    }

    let data = {
      username: process.env.ACCOUNT,
      password: process.env.PASSWORD,
    };
    const apiURL = `${process.env.CORE_IOT_URL}/auth/login`;
    try {
      const response = await axios.post(apiURL, data);
      if (response?.data?.token && response?.data?.refreshToken) {
        console.log("Get user token successfully");
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem("refreshToken", response.data.refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.log("Error fetching token:", error);
      return false;
    }
  };

  return (
    <ThemeContext.Provider value={{ isDayMode, setIsDayMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);