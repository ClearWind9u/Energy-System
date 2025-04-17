import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../navigation/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function DetailedSpecification({ navigation }) {
  const { isDayMode, setIsDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [telemetry, setTelemetry] = useState({});
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
        console.log("Dữ liệu nhận được: ", data.data);
        if (data.data) {
          const newTelemetry = { ...telemetry };
          Object.entries(data.data).forEach(([key, value]) => {
            if (
              Array.isArray(value) &&
              value.length > 0 &&
              value[0].length === 2
            ) {
              newTelemetry[key] = parseFloat(value[0][1]).toFixed(0);
            }
          });
          //console.log("New Telemetry ", newTelemetry);
          setTelemetry((prev) => ({
            ...prev,
            ...newTelemetry,
          }));
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

  // // Dữ liệu card với icon và màu nền
  const cards = [
    {
      title: "Nhiệt độ",
      value: `${telemetry.temperature ?? "..."} °C`,
      icon: "thermometer",
      color: "#FF3B30", // Màu đỏ
    },
    {
      title: "Độ ẩm",
      value: `${telemetry.humidity ?? "..."} %`,
      icon: "tint",
      color: "#00C7BE", // Màu xanh lam
    },
    {
      title: "Hiệu điện thế ánh sáng",
      value: `${telemetry.voltage_light ?? "..."} V`,
      // subValue: `LED Matrix: ${isLedMatrixOn ? "Bật" : "Tắt"}, Quạt: ${isFanOn ? "Bật" : "Tắt"}`,
      icon: "lightbulb-o",
      color: "#FF6D6A", // Màu hồng
    },
    {
      title: "Dòng điện",
      value: `${telemetry.current ?? "..."} A`,
      // subValue: `Relay: ${isRelayOn ? "Bật" : "Tắt"}`,
      icon: "flash",
      color: "#5856D6", // Màu tím
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
        {/* <Text style={[styles.title, currentStyles.text]}>{deviceData.name}</Text> */}
        <TouchableOpacity>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      {/* Detail Section */}
      {/* <Text style={[styles.sectionTitle, currentStyles.text]}>
        Thông số chi tiết
      </Text>
      <View style={[styles.deviceCard, currentStyles.deviceCard]}>
        <Text style={[currentStyles.text]}>
          Độ ẩm: {telemetry.humidity ?? "..."} %
        </Text>
        <Text style={[currentStyles.text]}>
          Nhiệt độ: {telemetry.temperature ?? "..."} °C
        </Text>
        <Text style={[currentStyles.text]}>
          Dòng điện: {telemetry.current ?? "..."} A
        </Text>
        <Text style={[currentStyles.text]}>
          Điệp áp: {telemetry.voltage_light ?? "..."} V
        </Text>
        <Text style={[currentStyles.text]}>
          Trạng thái: {connected ? "🟢 Kết nối" : "🔴 Mất kết nối"}
        </Text>
      </View> */}

      {/* Detail Section */}
      <Text style={[styles.sectionTitle, currentStyles.text]}>Thông số chi tiết</Text>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {cards.map((card, index) => (
          <View
            key={index}
            style={[styles.card, { backgroundColor: card.color }, currentStyles.card]}
          >
            <FontAwesome name={card.icon} size={40} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardValue}>{card.value}</Text>
            {/* {card.subValue && <Text style={styles.cardSubValue}>{card.subValue}</Text>} */}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, currentStyles.bottomNav]}>
        <TouchableOpacity style={styles.navButton}>
          <MaterialCommunityIcons name="view-dashboard" size={24} color="white" />
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
  card: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
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
