import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../navigation/ThemeContext";

export default function DetailedSpecification({ navigation }) {
  const { isDayMode, setIsDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;

  // Dữ liệu giả định cho các thông số
  const deviceData = {
    name: "TV",
    maxPower: "300 W",
    energyConsumed: "3500 kWh",
    usageTime: "1500 h",
    color: "Màu đỏ",
    temperature: 25, // °C
    humidity: 60, // %
    voltage_light: 0.3, // V
    current: 4, // A
  };

  // Logic điều kiện cho LED matrix, quạt, và relay
  const isLedMatrixOn = deviceData.voltage_light <= 0.2;
  const isFanOn = deviceData.voltage_light > 0.2;
  const isRelayOn = deviceData.current < 5;

  // Dữ liệu card với icon và màu nền
  const cards = [
    {
      title: "Công suất tối đa",
      value: deviceData.maxPower,
      icon: "bolt",
      color: "#4A90E2", // Màu xanh giống "French"
    },
    {
      title: "Lượng điện tiêu thụ",
      value: deviceData.energyConsumed,
      icon: "plug",
      color: "#FF9500", // Màu cam giống "Portuguese"
    },
    {
      title: "Thời gian sử dụng",
      value: deviceData.usageTime,
      icon: "clock-o",
      color: "#34C759", // Màu xanh lá giống "Italian"
    },
    {
      title: "Màu đang bật",
      value: deviceData.color,
      icon: "paint-brush",
      color: "#FFCC00", // Màu vàng giống "German"
    },
    {
      title: "Nhiệt độ",
      value: `${deviceData.temperature}°C`,
      icon: "thermometer",
      color: "#FF3B30", // Màu đỏ
    },
    {
      title: "Độ ẩm",
      value: `${deviceData.humidity}%`,
      icon: "tint",
      color: "#00C7BE", // Màu xanh lam
    },
    {
      title: "Hiệu điện thế ánh sáng",
      value: `${deviceData.voltage_light} V`,
      // subValue: `LED Matrix: ${isLedMatrixOn ? "Bật" : "Tắt"}, Quạt: ${isFanOn ? "Bật" : "Tắt"}`,
      icon: "lightbulb-o",
      color: "#FF6D6A", // Màu hồng
    },
    {
      title: "Dòng điện",
      value: `${deviceData.current} A`,
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
          <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>{deviceData.name}</Text>
        <TouchableOpacity>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

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
            {card.subValue && <Text style={styles.cardSubValue}>{card.subValue}</Text>}
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