import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Switch,
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
        <Text style={[styles.title, currentStyles.text]}>Phòng khách</Text>
        <TouchableOpacity>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      {/* Chế độ ban ngày / ban đêm */}
      {/* <View style={[styles.modeContainer , currentStyles.modeContainer]}>
                  <FontAwesome name="sun-o" size={24} color={isDayMode? "black" : "white"} />
                  <Text style={[styles.modeText, currentStyles.text]} >
                    {isDayMode ? "Chế độ ban ngày" : "Chế độ ban đêm"}
                  </Text>
                  <Switch
                    value={isDayMode}
                    onValueChange={() => setIsDayMode(!isDayMode)}
                    trackColor={{ false: "#ccc", true: "#4cd964" }}
                  />
        </View> */}

      {/* Detail Section */}
      <Text style={[styles.sectionTitle, currentStyles.text]}>
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
      </View>

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
  deviceCard: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 10,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
  deviceCard: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 10,
    justifyContent: "space-between",
    marginBottom: 20,
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
  deviceCard: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
});
