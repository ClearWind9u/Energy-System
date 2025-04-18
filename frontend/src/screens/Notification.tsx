import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../navigation/ThemeContext";
import axios from "axios";
import NavBar from "../component/Navbar";

export default function Notification({ navigation }) {
  const { isDayMode, setIsDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

//   const { id_group = 1 } = route.params || {};

  useEffect(() => {
    axios
      .get(`http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/notification?id_group=1`)
      .then((response) => {
        setNotifications(response.data.notifications);
        setLoading(false);
        // console.log("response", response.data.notifications);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      });
  }, []);
  
  const renderNotification = ({ item }) => (
    <View style={[styles.notificationContainer, currentStyles.notificationContainer]}>
      <Text style={[styles.notificationContent, currentStyles.text]}>{item.content}</Text>
      <Text style={[styles.notificationTime, currentStyles.text]}>
        {new Date(item.time).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        })}
      </Text>
    </View>
  );
  
  

  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header, currentStyles.header]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>Thông báo</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Notification")}>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
            {loading ? (
        <ActivityIndicator size="large" color={currentStyles.text.color} />
        ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
            {notifications.map((item) => (
            <View key={item.id} style={[styles.notificationContainer, currentStyles.notificationContainer]}>
                <Text style={[styles.notificationContent, currentStyles.text]}>
                {item.content.split("vào")[0]?.trim() || item.content}
                </Text>

                <Text style={[styles.notificationTime, currentStyles.text]}>
                {new Date(item.time).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })}
                </Text>
            </View>
            ))}
        </ScrollView>
        )}


      {/* Navigation Bar */}
      <NavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 10,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationMessage: {
    fontSize: 14,
    marginTop: 5,
  },
  notificationContent: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  
  notificationTime: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
  notificationContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f4f4f4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  
});

const dayModeStyles = StyleSheet.create({
  container: { backgroundColor: "#ffffff" },
  header: { backgroundColor: "white" },
  text: { color: "#000" },
  notificationContainer: { backgroundColor: "#f4f4f4" },
});

const nightModeStyles = StyleSheet.create({
  container: { backgroundColor: "#1e1e1e" },
  header: { backgroundColor: "#1e1e1e" },
  text: { color: "white" },
  notificationContainer: { backgroundColor: "#2b2b2b" },
});
