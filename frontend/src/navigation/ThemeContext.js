import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDayMode, setIsDayMode] = useState(true);
  useEffect(() => {
    const getUserToken = async () => {
      let data = {
        username: process.env.ACCOUNT,
        password: process.env.PASSWORD,
      };
      const apiURL = `${process.env.CORE_IOT_URL}/auth/login`;
      try {
        const response = await axios.post(apiURL, data);
        if (response) {
          console.log("Get user token successfully");
          await AsyncStorage.setItem(
            "userToken",
            response.data["token"].toString()
          );
          await AsyncStorage.setItem(
            "refreshToken",
            response.data["refreshToken"].toString()
          );
        }
      } catch (error) {
        console.log("Lỗi ", error);
      }
    };
    getUserToken();
  }, []);
  return (
    <ThemeContext.Provider value={{ isDayMode, setIsDayMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
