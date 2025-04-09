import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../navigation/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NavBar({ navigation,route}) {


  const { isDayMode, setIsDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem("userID");
        if (storedUserID) {
          setUserID(storedUserID);
        }
      } catch (error) {
        console.log("Error retrieving userID:", error);
      }
    };
    fetchUserID();
  }, []);


  return (
    <View style={[styles.container, currentStyles.container]}>
      <View style={[styles.bottomNav, currentStyles.bottomNav]} >
             <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
               <MaterialCommunityIcons name="view-dashboard" size={24} color="white" />
               <Text style={styles.navText}>Bảng điều khiển</Text>
             </TouchableOpacity>
     
             <TouchableOpacity style={styles.navButton}>
               <MaterialCommunityIcons name="microphone" size={24} color="white" />
               <Text style={styles.navText}>Microphone</Text>
             </TouchableOpacity>
     
             <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("AccountInfor" ,{userID})}>
               <MaterialCommunityIcons name="account" size={24} color="white" />
               <Text style={styles.navText}>Tài khoản</Text>
             </TouchableOpacity>
           </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  navButton: {
    alignItems: "center",
  },
  navText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
});

const dayModeStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  bottomNav: {
    backgroundColor: "black",
  },
});

// Style cho chế độ ban đêm
const nightModeStyles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
  },
  bottomNav: {
    backgroundColor: "#333",
  },
});

