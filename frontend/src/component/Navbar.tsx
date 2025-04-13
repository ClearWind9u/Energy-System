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

export default function NavBar({ navigation, route}) {


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
    <View style={[currentStyles.container]}>
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderRadius: 10,
    position: "absolute",
    marginTop:20,
    bottom: 20,
    left: 20,
    right: 20,
    height:80
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
    backgroundColor:"red",
    paddingHorizontal: 20,
  },
  bottomNav: {
    backgroundColor: "blue",
    
  },
});

// Style cho chế độ ban đêm
const nightModeStyles = StyleSheet.create({
  container: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
  },
  bottomNav: {
    backgroundColor: "#333",
  },
});

