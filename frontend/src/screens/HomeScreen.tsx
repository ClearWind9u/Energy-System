import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../navigation/ThemeContext";
import NavBar from "../component/Navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export default function HomeScreen({ navigation, route }) {
  const { isDayMode, setIsDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [userID, setUserID] = useState(null);
  const [telemetry, setTelemetry] = useState({});
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userID");
      navigation.replace("Login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        let apiURL = `${process.env.CORE_IOT_URL}/plugins/telemetry/DEVICE/${process.env.DEVICE_ID}/values/timeseries`;
        const today = getTodayDate();
        const token = await AsyncStorage.getItem("userToken");
        const response = await axios.get(apiURL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let data = {
          id_device: process.env.DEVICE_ID,
          current: parseFloat(response.data.current[0]["value"]).toFixed(0),
          humidity: parseFloat(response.data.humidity[0]["value"]).toFixed(0),
          temperature: parseFloat(
            response.data.temperature[0]["value"]
          ).toFixed(0),
          voltage_light: parseFloat(
            response.data.voltage_light[0]["value"]
          ).toFixed(0),
          time: today,
        };
        apiURL = `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/device/addRecord`;
        try {
          const result = await axios.post(apiURL, data);
          console.log("Response: ", result.data.message);
        } catch (error) {
          console.log("Error :", error);
        }
      } catch (error) {
        console.log("Error retrieving record:", error);
      }
    };
    fetchRecord();
  }, []);
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

  const features = [
    {
      id: 1,
      name: "Theo dõi mức tiêu thụ",
      backgroundImage: require("../../assets/consumption.jpg"),
      // color: "#FF7070", // Đỏ hồng
      icon: "eye",
      navigateTo: "Monitor",
      borderColor: "transparent",
    },
    {
      id: 2,
      name: "Điều chỉnh mức tiêu thụ",
      // color: "#A4FF80", // Xanh lá
      icon: "cog",
      navigateTo: "Adjust",
      borderColor: "transparent",
      backgroundImage: require("../../assets/adjustconsumption.jpg"),
    },
    {
      id: 3,
      name: "Quản lí thiết bị",
      // color: "#708DFF", // Xanh dương
      icon: "tablet",
      navigateTo: "DeviceManagement",
      // borderColor: "#8FA6FF",
      borderColor: "transparent",
      backgroundImage: require("../../assets/ManageDevice.jpg"),
    },
    {
      id: 4,
      name: "Báo cáo và phân tích",
      // color: "#FFE970", // Vàng
      icon: "line-chart",
      navigateTo: "Report",
      // borderColor: "#FFF08F",
      borderColor: "transparent",
      backgroundImage: require("../../assets/report2.jpg"),
    },
  ];

  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header]}>
        <TouchableOpacity style={styles.backButton} onPress={handleLogout}>
          <FontAwesome
            name="sign-out"
            size={24}
            color={currentStyles.text.color}
          />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>Trang chủ</Text>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      {/* <ImageBackground
  source={require("../../assets/consumption.jpg")}
  style={{ width: 400, height: 200 }}
>
  <Text style={{ color: "white" }}>Test</Text>
</ImageBackground> */}

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

      {/* Các ô chức năng */}
      <View style={styles.grid}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[
              styles.card,
              currentStyles.card,
              {
                // backgroundColor: feature.color,
                // borderColor: feature.borderColor,
              },
            ]}
            onPress={() => navigation.navigate(feature.navigateTo)}
            activeOpacity={0.8}
          >
            {/* <Text style={styles.cardText}>{feature.name}</Text>
            <FontAwesome name={feature.icon} size={40} color="#fff" style={styles.cardIcon} /> */}
            <ImageBackground
              source={feature.backgroundImage}
              style={styles.card}
              imageStyle={{ borderRadius: 15 }}
            >
              <View style={styles.overlay} />

              <View style={styles.cardContent}>
                <Text style={[styles.cardText, { color: "#fff" }]}>
                  {feature.name}
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>

      <NavBar navigation={navigation} route={{ params: { userID } }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 10,
  },
  modeContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  grid: {
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  height: 130,
  borderRadius: 20,
  overflow: "hidden", // để bo góc ảnh
  justifyContent: "flex-end",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",
  },
  cardIcon: {
    color: "#000",
    marginLeft: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 0.4 là độ mờ, chỉnh tùy ý
    borderRadius: 15,
    zIndex: 0,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    padding: 20,
    zIndex:1,
  },
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
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
});

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
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
});