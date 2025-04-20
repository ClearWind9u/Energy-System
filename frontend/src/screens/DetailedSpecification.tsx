import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../navigation/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DetailedSpecification({ navigation }) {
  const { isDayMode, setIsDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [telemetry, setTelemetry] = useState({
    temperature: null,
    humidity: null,
    voltage_light: null,
    current: null,
  });
  const [telemetryHistory, setTelemetryHistory] = useState({
    temperature: [],
    humidity: [],
    voltage_light: [],
    current: [],
  });
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
          const newHistory = { ...telemetryHistory };
          let check = false;

          Object.entries(data.data).forEach(([key, value]) => {
            if (
              Array.isArray(value) &&
              value.length > 0 &&
              value[0].length === 2
            ) {
              const numericValue = parseFloat(value[0][1]);
              newTelemetry[key] = numericValue.toFixed(0);

              // Cập nhật lịch sử (giữ tối đa 10 điểm dữ liệu)
              newHistory[key] = [...(newHistory[key] || []), numericValue].slice(-10);

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

          setTelemetry(newTelemetry);
          setTelemetryHistory(newHistory);

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

  const cards = [
    {
      title: "Nhiệt độ",
      value: telemetry.temperature,
      unit: "°C",
      key: "temperature",
      icon: "thermometer",
      backgroundColor: "#F5A623",
    },
    {
      title: "Độ ẩm",
      value: telemetry.humidity,
      unit: "%",
      key: "humidity",
      icon: "tint",
      backgroundColor: "#4A90E2",
    },
    {
      title: "Hiệu điện thế ánh sáng",
      value: telemetry.voltage_light,
      unit: "V",
      key: "voltage_light",
      icon: "lightbulb-o",
      backgroundColor: "#7ED321",
    },
    {
      title: "Dòng điện",
      value: telemetry.current,
      unit: "A",
      key: "current",
      icon: "flash",
      backgroundColor: "#FF3333",
    },
  ];

  const handleCardPress = (card) => {
    navigation.navigate("Sensor", {
      sensorKey: card.key,
      sensorTitle: card.title,
      sensorUnit: card.unit,
      sensorHistory: telemetryHistory[card.key] || [],
      token: token,
    });
  };

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
          Theo dõi cảm biến
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.cardContainer}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCardPress(card)}
            style={[styles.card, { backgroundColor: card.backgroundColor }]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <FontAwesome
                name={card.icon}
                size={20}
                color="#fff"
                style={styles.cardIcon}
              />
            </View>
            <Text style={styles.cardValue}>{`${card.value || "..."}${card.unit}`}</Text>
          </TouchableOpacity>
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
  cardContainer: {
    paddingBottom: 80,
  },
  card: {
    width: "100%",
    height: 150,
    borderRadius: 15,
    marginBottom: 15,
    padding: 20,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  cardIcon: {
    marginLeft: 10,
  },
  cardValue: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    bottom: 10,
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
  header: {
    backgroundColor: "white",
  },
  text: {
    color: "black",
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
  bottomNav: {
    backgroundColor: "#333",
  },
});