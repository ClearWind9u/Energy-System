import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../navigation/ThemeContext";
import { LineChart } from "react-native-chart-kit";

export default function SensorGraph({ navigation, route }) {
  const { isDayMode, setIsDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const { sensorKey, sensorTitle, sensorUnit, sensorHistory, token } = route.params;
  const [data, setData] = useState(sensorHistory.length > 0 ? sensorHistory : [0]);
  const [timestamps, setTimestamps] = useState([]); // Lưu thời gian
  const [lastValue, setLastValue] = useState(null); // Lưu giá trị gần nhất
  const socketRef = useRef(null);
  const deviceId = "8fb0b170-00ce-11f0-a887-6d1a184f2bb5";

  useEffect(() => {
    if (token) {
      const socket = new WebSocket(
        `wss://app.coreiot.io/api/ws/plugins/telemetry?token=${token}`
      );
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ WebSocket connected for graph");
        const subscribeMsg = {
          tsSubCmds: [
            {
              entityType: "DEVICE",
              entityId: deviceId,
              scope: "Latest telemetry",
              cmdId: 1,
              keys: sensorKey,
            },
          ],
          attrSubCmds: [],
          historyCmds: [],
        };
        socket.send(JSON.stringify(subscribeMsg));
      };

      socket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        if (receivedData.data && receivedData.data[sensorKey]) {
          const numericValue = parseFloat(receivedData.data[sensorKey][0][1]);
          setLastValue(numericValue); // Cập nhật giá trị gần nhất
          updateChartData(numericValue, true); // Cập nhật dữ liệu mới
        }
      };

      socket.onerror = (error) => {
        console.error("❌ WebSocket error in graph:", error);
      };

      socket.onclose = () => {
        console.warn("⚠️ WebSocket closed in graph");
      };

      // Cập nhật thời gian mỗi giây để biểu đồ di chuyển
      const interval = setInterval(() => {
        updateChartData(lastValue, false); // Chỉ cập nhật thời gian, không thêm giá trị mới nếu không có dữ liệu
      }, 1000); // Cập nhật mỗi giây

      return () => {
        clearInterval(interval);
        socket.close();
      };
    }
  }, [token, sensorKey]);

  // Hàm cập nhật dữ liệu và thời gian
  const updateChartData = (numericValue, updateValue) => {
    const currentTime = new Date();
    const timeLabel = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, "0")}`;

    if (updateValue && numericValue !== null) {
      // Chỉ cập nhật dữ liệu nếu có giá trị mới từ WebSocket
      setData((prevData) => {
        const newData = [...prevData, numericValue].slice(-10); // Giữ 10 điểm dữ liệu gần nhất
        return newData.length > 0 ? newData : [0];
      });
    }

    // Luôn cập nhật thời gian để biểu đồ di chuyển
    setTimestamps((prevTimestamps) => {
      const newTimestamps = [...prevTimestamps, timeLabel].slice(-10); // Giữ 10 thời gian gần nhất
      return newTimestamps.length > 0 ? newTimestamps : [timeLabel];
    });
  };

  // Tạo nhãn thời gian cho trục X (hiển thị 5 mốc thời gian)
  const getTimeLabels = () => {
    if (timestamps.length < 1) return [""];
    if (timestamps.length === 1) return [timestamps[0]];

    const step = Math.max(1, Math.floor(timestamps.length / 4)); // Chia thành 5 mốc
    const labels = [];
    for (let i = 0; i < timestamps.length; i += step) {
      labels.push(timestamps[i]);
    }
    if (labels[labels.length - 1] !== timestamps[timestamps.length - 1]) {
      labels.push(timestamps[timestamps.length - 1]); // Đảm bảo mốc cuối được hiển thị
    }
    return labels;
  };

  // Dữ liệu cho đồ thị
  const chartData = {
    labels: getTimeLabels(),
    datasets: [
      {
        data: data,
        color: (opacity = 1) => `#FF3333`, // Màu đường đỏ
        strokeWidth: 2,
      },
    ],
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
          {sensorTitle} - Biểu đồ
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      {/* Đồ thị (căn giữa màn hình) */}
      <View style={styles.chartWrapper}>
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: isDayMode ? "#fff" : "#1E1E1E",
              backgroundGradientFrom: isDayMode ? "#fff" : "#1E1E1E",
              backgroundGradientTo: isDayMode ? "#fff" : "#1E1E1E",
              fillShadowGradient: "#FF3333",
              fillShadowGradientOpacity: 0.1,
              decimalPlaces: 0,
              color: (opacity = 1) => `#FF3333`,
              labelColor: (opacity = 1) => isDayMode ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 0,
              },
              propsForBackgroundLines: {
                stroke: isDayMode ? "#e0e0e0" : "#444",
              },
              fromZero: true, // Đặt giá trị thấp nhất là 0
              yAxisInterval: 1, // Đảm bảo trục Y bắt đầu từ 0
            }}
            bezier
            style={{
              marginVertical: 8,
            }}
          />
        </View>
      </View>

      {/* Navbar */}
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
  chartWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120,
  },
  chartContainer: {
    alignItems: "center",
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