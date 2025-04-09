import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { useTheme } from "../navigation/ThemeContext";
import NavBar from "../component/Navbar";

export default function ReportScreen({ navigation, route }) {
  const { isDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const { userID } = route.params || {};

  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Ngày");

  // Dữ liệu mẫu
  const reportData = Array(8).fill({
    date: "Thứ hai, 14/02/2025",
    usage: "25 kWh",
    recommendation: "Khuyến nghị tiết kiệm điện",
  });

  const handleDateChange = (text) => {
    setDate(text);
  };

  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header, currentStyles.header]}>
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

        <View style={styles.headerCenter}>
          <Text style={[styles.title, currentStyles.text]}>
            Báo cáo và phân tích
          </Text>
        </View>

        <View style={styles.iconButtonPlaceholder} />
      </View>

      {/* Ngày hiện tại */}
      <View style={[styles.dateContainer, currentStyles.dateContainer]}>
        <TextInput
          style={[styles.dateInput, currentStyles.text]}
          placeholder="Nhập ngày (dd/mm/yyyy)"
          keyboardType="numeric"
          value={date}
          onChangeText={handleDateChange}
        />
      </View>

      {/* Tiêu đề phần chi tiết */}
      <View style={[styles.detailHeader, currentStyles.detailHeader]}>
        <Text style={[styles.detailTitle, currentStyles.text]}>
          Chi tiết tiêu thụ điện năng
        </Text>
        <Text style={[styles.detailTitle, currentStyles.text]}>Lời khuyên</Text>
      </View>

      {/* Danh sách báo cáo */}
      <ScrollView style={styles.reportList}>
        {reportData.map((item, index) => (
          <View
            key={index}
            style={[styles.reportItem, currentStyles.reportItem]}
          >
            <Text style={[styles.reportDate, currentStyles.text]}>
              {item.date}
            </Text>
            <View style={styles.reportDetails}>
              <Text style={[styles.reportUsage, styles.usedText]}>
                Đã sử dụng: {item.usage}
              </Text>
              <Text
                style={[styles.reportRecommendation, styles.recommendationText]}
              >
                {item.recommendation}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <NavBar navigation={navigation} route={{ params: { userID } }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 15 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
  },
  headerCenter: { alignItems: "center" },
  backButton: { padding: 5 },
  timeText: { fontSize: 16, marginBottom: 5 },
  title: { fontSize: 18, fontWeight: "bold" },
  iconButtonPlaceholder: { width: 24 },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#4A90E2",
  },
  dateInput: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 8,
    borderRadius: 5,
    backgroundColor: "white",
    textAlign: "center",
    width: "80%",
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#4A90E2",
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "#4A90E2",
  },
  reportList: { flex: 1, marginBottom: 0 },
  reportItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F5F9FF",
  },
  reportDate: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  reportDetails: { flexDirection: "row", justifyContent: "space-between" },
  reportUsage: { fontSize: 13, flex: 1 },
  reportRecommendation: {
    fontSize: 13,
    flex: 1,
    textAlign: "right",
    fontWeight: "500",
  },
  usedText: { color: "#FF6B6B" },
  recommendationText: { color: "#4A90E2" },
});

const dayModeStyles = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  header: { backgroundColor: "white" },
  text: { color: "black" },
  dateContainer: { backgroundColor: "#4A90E2" },
  reportItem: { backgroundColor: "#F5F9FF" },
});

const nightModeStyles = StyleSheet.create({
  container: { backgroundColor: "#1E1E1E" },
  header: { backgroundColor: "#2C2C2C" },
  text: { color: "white" },
  dateContainer: { backgroundColor: "#1E3A8A" },
  reportItem: { backgroundColor: "#1E293B" },
});
