import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ActivityIndicator, TextInput
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../navigation/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavBar from "../component/Navbar";



export default function AccountInfor({ navigation, route }) {


  const { isDayMode, setIsDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [userID, setUserID] = useState(null);
  const [user, setUser] = useState({
    name: "",
    id: "",
    account: "",
    id_group: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem("userID");
        if (storedUserID) {
          console.log("Retrieved userID at homeScreen:", storedUserID);
          setUserID(storedUserID);
        }
      } catch (error) {
        console.log("Error retrieving userID:", error);
      }
    };
  
    fetchUserID();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!route.params?.userID) return; // Kiểm tra userID trước khi fetch
      try {
        const response = await fetch(`http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/api/get-user/${route.params.userID}`);
        const data = await response.json();
        if (data.errCode === 0) {
          setUser(data.user);
        } else {
          setError("Không tìm thấy người dùng");
        }
      } catch (error) {
        setError("Lỗi khi tải dữ liệu");
      }
      setLoading(false);
    };
  
    fetchUserData();
  }, [route.params?.userID]);
  
  
  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header, currentStyles.container]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome
            name="arrow-left"
            size={24}
            color={currentStyles.text.color}
          />
        </TouchableOpacity>

        <Text style={[styles.title, currentStyles.text]}>
          Thông tin người dùng
        </Text>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      {/* Chế độ ban ngày */}
      <View style={[styles.modeContainer, currentStyles.modeContainer]}>
        <FontAwesome
          name="sun-o"
          size={24}
          color={isDayMode ? "black" : "white"}
        />
        <Text style={[styles.modeText, currentStyles.text]}>
          {isDayMode ? "Chế độ ban ngày" : "Chế độ ban đêm"}
        </Text>
        <Switch
          value={isDayMode}
          onValueChange={() => setIsDayMode(!isDayMode)}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
          thumbColor="white"
        />
      </View>

      <View style={styles.content}>
  {loading ? (
    <ActivityIndicator size="large" color="blue" />
  ) : error ? (
    <Text style={[styles.errorText, currentStyles.text]}>{error}</Text>
  ) : (
    <View>
      <Text style={[styles.label, currentStyles.text]}>Tên: {user.name}</Text>
      <Text style={[styles.label, currentStyles.text]}>Mã số: {user.id}</Text>
      <Text style={[styles.label, currentStyles.text]}>Tài khoản: {user.account}</Text>
      <Text style={[styles.label, currentStyles.text]}>Mã nhóm: {user.id_group}</Text>
    </View>
  )}
</View>

      {/* Thanh điều hướng */}
      <NavBar navigation={navigation} route={{params : {userID}} } />
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    backButton: {
      padding: 10,
      left: 0,
    },
    title: {
      paddingLeft: 5,
      fontSize: 24,
      fontWeight: "bold",
    },
    iconButton: {
      padding: 10,
    },
    modeContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F2F2F2",
      padding: 15,
      borderRadius: 10,
      justifyContent: "space-between",
      marginBottom: 20,
    },
    modeText: {
      fontSize: 16,
      flex: 1,
      marginLeft: 10,
    },
    content: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    userInfo: {
      backgroundColor: "#F2F2F2",
      padding: 20,
      borderRadius: 10,
      width: "100%",
    },
    infoText: {
      fontSize: 18,
      marginBottom: 10,
    },
    boldText: {
      fontWeight: "bold",
    },
    errorText: {
      fontSize: 18,
      color: "red",
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
    },inputContainer: {
        width: "90%",
      },
      label: {
        fontSize: 16,
        marginTop: 10,
        color: "#333",
      },
      input: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 8,
        marginTop: 5,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ddd",
      },
      buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        marginTop: 20,
      }
  });

const dayModeStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "white",
  },
  text: {
    color: "black",
  },
  modeContainer: {
    backgroundColor: "#F2F2F2",
  },
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
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
  header: {
    backgroundColor: "#2C2C2C",
  },
  text: {
    color: "white",
  },
  modeContainer: {
    backgroundColor: "#333",
  },
  card: {
    backgroundColor: "#444",
  },
  bottomNav: {
    backgroundColor: "#333",
  },
});

