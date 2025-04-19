import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../navigation/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export default function DetailedSpecification({ navigation }) {
  const { isDayMode, setIsDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [telemetry, setTelemetry] = useState({});
  const [maxHumidity, setMaxHumidity] = useState(0);
  const [maxTemperature, setMaxTemperature] = useState(0);
  const [connected, setConnected] = useState(false);
  const [token, setToken] = useState("");
  const socketRef = useRef(null);
  const deviceId = "8fb0b170-00ce-11f0-a887-6d1a184f2bb5";
  const keys = "current,humidity,temperature,voltage_light";
  useEffect(() => {
    const getTokenAndConnect = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      if (savedToken) {
        setToken(savedToken);
      }
    };
    getTokenAndConnect();
  }, []);
  useEffect(() => {
    const updateRecord = async (data) => {
      const apiURL = `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/device/addRecord`;
      try {
        const response = await axios.post(apiURL, data);
        if (response.data) {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log("Lỗi khi cập nhật bản ghi ", error);
      }
    };
    if (token) {
      const socket = new WebSocket(
        `wss://app.coreiot.io/api/ws/plugins/telemetry?token=${token}`
      );
      socketRef.current = socket;

      socket.onopen = () => {
        setConnected(true);
        console.log("✅ WebSocket connected");
        const subscribeMsg = {
          tsSubCmds: [
            {
              entityType: "DEVICE",
              entityId: deviceId,
              scope: "Latest telemetry",
              cmdId: 1,
              keys: keys,
            },
          ],
          attrSubCmds: [],
          historyCmds: [],
        };
        socket.send(JSON.stringify(subscribeMsg));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.data) {
          const newTelemetry = { ...telemetry };
          let check = false;
          Object.entries(data.data).forEach(([key, value]) => {
            if (
              Array.isArray(value) &&
              value.length > 0 &&
              value[0].length === 2
            ) {
              const numericValue = parseFloat(value[0][1]);
              newTelemetry[key] = numericValue.toFixed(0);
              if (key === "humidity") {
                check = maxHumidity < numericValue;
                setMaxHumidity((prev) =>
                  prev === 0 ? numericValue : Math.max(prev, numericValue)
                );
              }
              if (key === "temperature") {
                check = check || maxTemperature < numericValue;
                setMaxTemperature((prev) =>
                  prev === 0 ? numericValue : Math.max(prev, numericValue)
                );
              }
            }
          });
          //console.log("New Telemetry ", newTelemetry);
          setTelemetry((prev) => ({
            ...prev,
            ...newTelemetry,
          }));
          if (check) {
            const data = {
              ...telemetry,
              ...newTelemetry,
              id_device: process.env.DEVICE_ID,
              time: getTodayDate(),
            };
            updateRecord(data);
          }
        }
      };

      socket.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
      };

      socket.onclose = () => {
        setConnected(false);
        console.warn("⚠️ WebSocket closed");
      };

      return () => {
        socket.close();
      };
    }
  }, [token]);
  if (!token) {
    return (
      <View style={[styles.container, currentStyles.container]}>
        <Text>Đang lấy token...</Text>
      </View>
    );
  }

  // // Logic điều kiện cho LED matrix, quạt, và relay
  // const isLedMatrixOn = deviceData.voltage_light <= 0.2;
  // const isFanOn = deviceData.voltage_light > 0.2;
  // const isRelayOn = deviceData.current < 5;

  // Dữ liệu card với icon và màu nền
  const cards = [
    {
      title: "Nhiệt độ",
      value: `${telemetry.temperature ?? "..."} °C`,
      icon: "thermometer",
      color: "#FF3B30",
      backgroundImage: require("../../assets/temp.jpg"),
    },
    {
      title: "Độ ẩm",
      value: `${telemetry.humidity ?? "..."} %`,
      icon: "tint",
      color: "#00C7BE",
      backgroundImage: require("../../assets/humid.jpg"),
    },
    {
      title: "Hiệu điện thế ánh sáng",
      value: `${telemetry.voltage_light ?? "..."} V`,
      icon: "lightbulb-o",
      color: "#FF6D6A",
      backgroundImage: require("../../assets/von3.jpg"),
    },
    {
      title: "Dòng điện",
      value: `${telemetry.current ?? "..."} A`,
      icon: "flash",
      color: "#5856D6",
      backgroundImage: require("../../assets/dien3.jpg"),
    },
  ];

  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header, currentStyles.container]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome
            name="arrow-left"
            size={24}
            color={currentStyles.text.color}
          />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>
          Thông số chi tiết
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.cardContainer}>
        {cards.map((card, index) => (
          <ImageBackground
            key={index}
            source={card.backgroundImage}
            imageStyle={{ borderRadius: 15 }}
            style={[styles.card, currentStyles.card]}
          >
            <View style={styles.overlay}>
              <FontAwesome
                name={card.icon}
                size={40}
                color="#fff"
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardValue}>{card.value}</Text>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, currentStyles.bottomNav]}>
        <TouchableOpacity style={styles.navButton}>
          <MaterialCommunityIcons
            name="view-dashboard"
            size={24}
            color="white"
          />
          <Text style={styles.navText}>Bảng điều khiển</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <MaterialCommunityIcons name="microphone" size={24} color="white" />
          <Text style={styles.navText}>Microphone</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <MaterialCommunityIcons name="account" size={24} color="white" />
          <Text style={styles.navText}>Tài khoản</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  // card: {
  //   width: "48%",
  //   aspectRatio: 1,
  //   borderRadius: 15,
  //   padding: 15,
  //   marginBottom: 15,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  cardIcon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  cardSubValue: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    marginTop: 5,
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
  card: {
    width: 175,
    height: 180,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // lớp overlay đen mờ
    justifyContent: 'center',
    alignItems: 'center',
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
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  bottomNav: {
    backgroundColor: "black",
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
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  bottomNav: {
    backgroundColor: "#333",
  },
});
