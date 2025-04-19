import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView, Modal
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../navigation/ThemeContext";
import axios from "axios";
import NavBar from "../component/Navbar";

export default function Notification({ navigation, route }) {
  const { isDayMode, setIsDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const userID = route.params?.userID || null;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [selectedNotification, setSelectedNotification] = useState(null); // Selected notification for deletion


//   const { id_group = 1 } = route.params || {};

const fetchNotification = async () =>{
  try {
    const response = await axios.get(`http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/notification/getAll?id_group=1`);
    setNotifications(response.data.notifications);
  } catch(error){
    console.log("Error fetching the data", error);
  } finally{
    setLoading(false);
  }
}

useEffect( () =>{
  fetchNotification();
})
  
  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true); // Open modal when a notification is pressed
  };

  const handleDeleteNotification = async () => {
    if (selectedNotification) {
      console.log("iddd",selectedNotification.id)
      let id_message = selectedNotification.id
      try {
        const response = await axios.delete(`http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/notification/delete`, {
          params: { id_message: id_message }  // hoặc selectedNotification.id
        })
        .then((response) => {
          console.log("Xóa thành công:", response.data);
          // reload lại danh sách thông báo nếu cần
          setModalVisible(false); // Close the modal after deletion
          fetchNotification();
        })
        .catch((error) => {
          console.error("Error deleting notification:", error.response?.data || error.message);
        });

      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <View style={[styles.notificationContainer, currentStyles.notificationContainer]}>
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
    </TouchableOpacity>
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
          {notifications.map((item) => renderNotification({ item }))}
        </ScrollView>
      )}

      {/* Modal for confirmation */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, currentStyles.notificationContainer]}>
            <Text style={[styles.modalText, currentStyles.text]}>Bạn có chắc chắn muốn xóa tin nhắn này không?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "red" }]}
                onPress={handleDeleteNotification}
              >
                <Text style={styles.modalButtonText}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "gray" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* Navigation Bar */}
      <NavBar navigation={navigation} route={{ params: { userID } }} />
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: 300,
    backgroundColor: "#fff",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
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