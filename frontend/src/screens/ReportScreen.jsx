import { FontAwesome } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "../navigation/ThemeContext";
import NavBar from "../component/Navbar";
import { Calendar } from "react-native-calendars";
import axios from "axios";

export default function ReportScreen({ navigation, route }: any) {
  const { isDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const { userID } = route.params || {};

  const today = new Date().toISOString().split("T")[0];
  const [activeFilter, setActiveFilter] = useState("Ngày");
  const [expandedItem, setExpandedItem] = useState(null);
  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deviceNameMap = {
    "8fb0b170-00ce-11f0-a887-6d1a184f2bb5": "Thiết bị của hệ thống",
  };

  const filterMap = {
    "Ngày": "day",
    "Tháng": "month",
    "Năm": "year",
  };

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiURL = `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/device/records`;
      const response = await axios.get(apiURL, {
        params: {
          filter: filterMap[activeFilter],
          date: selectedDate,
        },
      });
      const transformedData = response.data.map((item) => ({
        date: item.date,
        displayDate: item.displayDate,
        usage: item.devices
          .reduce(
            (sum, device) => sum + (device.current * device.voltage_light) / 1000,
            0
          )
          .toFixed(2),
        recommendation: "Khuyến nghị tiết kiệm điện",
        status: "Khuyến nghị",
        devices: item.devices.map((device) => ({
          name: deviceNameMap[device.name] || device.name,
          usage: ((device.current * device.voltage_light) / 1000).toFixed(2) + " kWh",
          temperature: device.temperature.toFixed(1) + " °C",
          humidity: device.humidity.toFixed(1) + " %",
          current: device.current.toFixed(1) + " A",
          voltage_light: device.voltage_light.toFixed(0) + " V",
          time: new Date(device.time).toLocaleDateString("vi-VN"),
        })),
      }));
      setReportData(transformedData);
    } catch (err) {
      console.error("Error fetching records:", err.message);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [activeFilter, selectedDate]);

  const toggleExpand = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  return (
    <View style={[styles.container, currentStyles.container]}>
      <View style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>Báo cáo và phân tích</Text>
        <TouchableOpacity>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.dateContainer, currentStyles.dateContainer]}
        onPress={() => setShowCalendar(true)}
        activeOpacity={0.7}
      >
        <FontAwesome
          name="calendar"
          size={20}
          color={currentStyles.dateIcon.color}
          style={styles.dateIcon}
        />
        <Text style={[styles.dateText, currentStyles.text]}>
          {new Date(selectedDate).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={showCalendar}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.calendarContainer, currentStyles.modalContent]}>
                <Calendar
                  onDayPress={handleDateSelect}
                  markedDates={{
                    [selectedDate]: { selected: true, selectedColor: "#4A90E2" },
                  }}
                  theme={{
                    backgroundColor: isDayMode ? "#fff" : "#2C2C2C",
                    calendarBackground: isDayMode ? "#fff" : "#2C2C2C",
                    textSectionTitleColor: isDayMode ? "#333" : "#fff",
                    selectedDayBackgroundColor: "#4A90E2",
                    selectedDayTextColor: "#fff",
                    todayTextColor: "#4A90E2",
                    dayTextColor: isDayMode ? "#333" : "#fff",
                    textDisabledColor: isDayMode ? "#d9e1e8" : "#666",
                    arrowColor: "#4A90E2",
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.filterContainer}>
        {["Ngày", "Tháng", "Năm"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.reportList}>
        {loading ? (
          <Text style={[styles.noDataText, currentStyles.text]}>Đang tải...</Text>
        ) : error ? (
          <Text style={[styles.noDataText, currentStyles.text]}>{error}</Text>
        ) : reportData.length === 0 ? (
          <Text style={[styles.noDataText, currentStyles.text]}>
            Không có dữ liệu cho khoảng thời gian này
          </Text>
        ) : (
          reportData.map((item, index) => (
            <View key={index}>
              <View style={[styles.reportItem, currentStyles.reportItem]}>
                <TouchableOpacity onPress={() => toggleExpand(index)}>
                  <Text style={[styles.reportDate, currentStyles.text]}>
                    {item.displayDate}
                  </Text>
                  <View style={styles.reportDetails}>
                    <View style={styles.usageContainer}>
                      <Text style={[styles.reportUsage, currentStyles.text]}>
                        {item.usage} kWh
                      </Text>
                      
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.adviceButton, currentStyles.adviceButton]}
                  onPress={() => {
                    if (item.recommendation && item.recommendation.trim()) {
                      setSelectedAdvice(item.recommendation);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <FontAwesome
                    name="lightbulb-o"
                    size={20}
                    color={currentStyles.adviceButton.color}
                  />
                </TouchableOpacity>
              </View>

              {expandedItem === index && (
                <View style={[styles.deviceList, currentStyles.deviceList]}>
                  {item.devices
                    .slice()
                    .sort((a, b) => {
                      const [da, ma, ya] = a.time.split("/");
                      const [db, mb, yb] = b.time.split("/");
                      const dateA = new Date(`${ya}-${ma}-${da}`);
                      const dateB = new Date(`${yb}-${mb}-${db}`);
                      return dateA.getTime() - dateB.getTime();
                    })
                    .map((device: any, deviceIndex: number) => (
                      <View key={deviceIndex} style={styles.deviceItem}>
                        <View style={styles.deviceDetails}>
                          {device.time !== "Invalid Date" && (
                            <Text style={[styles.deviceName, currentStyles.text]}>
                              {device.time}
                            </Text>
                          )}
                          <Text style={[styles.deviceDetailText, currentStyles.text]}>
                            Tiêu thụ: {device.usage}
                          </Text>
                          <Text style={[styles.deviceDetailText, currentStyles.text]}>
                            Nhiệt độ: {device.temperature}
                          </Text>
                          <Text style={[styles.deviceDetailText, currentStyles.text]}>
                            Độ ẩm: {device.humidity}
                          </Text>
                          <Text style={[styles.deviceDetailText, currentStyles.text]}>
                            Dòng điện: {device.current}
                          </Text>
                          <Text style={[styles.deviceDetailText, currentStyles.text]}>
                            Điện áp: {device.voltage_light}
                          </Text>
                        </View>
                      </View>
                    ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        transparent={true}
        visible={!!selectedAdvice}
        animationType="fade"
        onRequestClose={() => setSelectedAdvice(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedAdvice(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, currentStyles.modalContent]}>
                <Text style={[styles.modalTitle, currentStyles.text]}>
                  Lời khuyên từ AI
                </Text>
                <Text style={[styles.modalText, currentStyles.text]}>
                  {selectedAdvice || "Hiện tại không có lời khuyên cụ thể."}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedAdvice(null)}
                >
                  <Text style={styles.closeButtonText}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: "#E5E5E5",
  },
  activeFilterButton: {
    backgroundColor: "#4A90E2",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  activeFilterText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
    color: "#666",
  },
  reportList: {
    flex: 1,
    marginBottom: 120,
  },
  reportItem: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportDate: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  reportDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  usageContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  reportUsage: {
    fontSize: 13,
    marginRight: 5,
  },
  statusBar: {
    flex: 1,
    height: 5,
    borderRadius: 2.5,
  },
  adviceButton: {
    padding: 5,
  },
  deviceList: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    marginLeft: 10,
  },
  deviceItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  deviceName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  deviceDetails: {
    marginLeft: 10,
  },
  deviceDetailText: {
    fontSize: 13,
    marginBottom: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  calendarContainer: {
    width: "90%",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
});

const dayModeStyles = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  text: { color: "black" },
  dateContainer: {
    backgroundColor: "#F5F9FF",
  },
  dateIcon: { color: "#4A90E2" },
  detailTitle: { color: "#666" },
  reportItem: { backgroundColor: "#F5F9FF" },
  deviceList: { backgroundColor: "#E6EFFF" },
  adviceButton: { color: "#4A90E2" },
  modalContent: { backgroundColor: "#fff" },
});

const nightModeStyles = StyleSheet.create({
  container: { backgroundColor: "#1E1E1E" },
  text: { color: "white" },
  dateContainer: {
    backgroundColor: "#2A3447",
  },
  dateIcon: { color: "#6B9BF2" },
  detailTitle: { color: "#999" },
  reportItem: { backgroundColor: "#1E293B" },
  deviceList: { backgroundColor: "#2A3447" },
  adviceButton: { color: "#6B9BF2" },
  modalContent: { backgroundColor: "#2C2C2C" },
});