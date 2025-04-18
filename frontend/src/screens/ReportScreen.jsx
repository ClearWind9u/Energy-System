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
} from "react-native";
import { useTheme } from "../navigation/ThemeContext";
import NavBar from "../component/Navbar";
import { Calendar } from "react-native-calendars";

export default function ReportScreen({ navigation, route }: any) {
  const { isDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const { userID } = route.params || {};

  const [activeFilter, setActiveFilter] = useState("Ngày");
  const [expandedItem, setExpandedItem] = useState(null);
  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [selectedDate, setSelectedDate] = useState("2025-02-14");
  const [showCalendar, setShowCalendar] = useState(false);

  // Dữ liệu mẫu với ngày cụ thể (để lọc theo ngày, tháng, năm)
  const reportData = [
    {
      date: "2025-02-14",
      displayDate: "Thứ hai, 14/02/2025",
      usage: 50,
      recommendation: "Khuyến nghị tiết kiệm điện",
      status: "Khuyến nghị",
      devices: [
        { name: "Điều hòa", usage: "20 kWh" },
        { name: "Tủ lạnh", usage: "15 kWh" },
        { name: "Máy giặt", usage: "10 kWh" },
      ],
    },
    {
      date: "2025-02-14",
      displayDate: "Thứ hai, 14/02/2025",
      usage: 50,
      recommendation: "Đã sử dụng",
      status: "Đã sử dụng",
      devices: [
        { name: "Điều hòa", usage: "25 kWh" },
        { name: "Tivi", usage: "10 kWh" },
        { name: "Quạt", usage: "5 kWh" },
      ],
    },
    {
      date: "2025-02-15",
      displayDate: "Thứ ba, 15/02/2025",
      usage: 45,
      recommendation: "Khuyến nghị tiết kiệm điện",
      status: "Khuyến nghị",
      devices: [
        { name: "Điều hòa", usage: "20 kWh" },
        { name: "Tủ lạnh", usage: "15 kWh" },
        { name: "Máy giặt", usage: "10 kWh" },
      ],
    },
    {
      date: "2025-03-01",
      displayDate: "Thứ bảy, 01/03/2025",
      usage: 60,
      recommendation: "Đã sử dụng",
      status: "Đã sử dụng",
      devices: [
        { name: "Điều hòa", usage: "25 kWh" },
        { name: "Tivi", usage: "10 kWh" },
        { name: "Quạt", usage: "5 kWh" },
      ],
    },
    {
      date: "2024-12-31",
      displayDate: "Thứ ba, 31/12/2024",
      usage: 55,
      recommendation: "Khuyến nghị tiết kiệm điện",
      status: "Khuyến nghị",
      devices: [
        { name: "Điều hòa", usage: "20 kWh" },
        { name: "Tủ lạnh", usage: "15 kWh" },
        { name: "Máy giặt", usage: "10 kWh" },
      ],
    },
  ];

  // Hàm lọc và nhóm dữ liệu theo Ngày, Tháng, Năm
  const getFilteredData = () => {
    const selectedDateObj = new Date(selectedDate);
    const selectedYear = selectedDateObj.getFullYear();
    const selectedMonth = selectedDateObj.getMonth() + 1; // getMonth() trả về 0-11
    const selectedDay = selectedDateObj.getDate();

    if (activeFilter === "Ngày") {
      return reportData.filter((item) => item.date === selectedDate);
    } else if (activeFilter === "Tháng") {
      // Nhóm theo tháng và năm
      const filtered = reportData.filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate.getFullYear() === selectedYear &&
          itemDate.getMonth() + 1 === selectedMonth
        );
      });

      // Tổng hợp dữ liệu theo tháng
      if (filtered.length === 0) return [];
      const totalUsage = filtered.reduce((sum, item) => sum + item.usage, 0);
      return [
        {
          date: `${selectedMonth}/${selectedYear}`,
          displayDate: `Tháng ${selectedMonth}, ${selectedYear}`,
          usage: totalUsage,
          recommendation: filtered[0].recommendation, // Lấy lời khuyên của ngày đầu tiên trong tháng
          status: filtered[0].status,
          devices: filtered.flatMap((item) => item.devices), // Tổng hợp tất cả thiết bị
        },
      ];
    } else {
      // Nhóm theo năm
      const filtered = reportData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === selectedYear;
      });

      // Tổng hợp dữ liệu theo năm
      if (filtered.length === 0) return [];
      const totalUsage = filtered.reduce((sum, item) => sum + item.usage, 0);
      return [
        {
          date: `${selectedYear}`,
          displayDate: `Năm ${selectedYear}`,
          usage: totalUsage,
          recommendation: filtered[0].recommendation, // Lấy lời khuyên của ngày đầu tiên trong năm
          status: filtered[0].status,
          devices: filtered.flatMap((item) => item.devices), // Tổng hợp tất cả thiết bị
        },
      ];
    }
  };

  const filteredData = getFilteredData();

  const toggleExpand = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>Báo cáo và phân tích</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      {/* Ngày hiện tại với nút mở calendar */}
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

      {/* Calendar Modal */}
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

      {/* Bộ lọc (Ngày, Tháng, Năm) */}
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

      {/* Tiêu đề phần chi tiết */}
      <View style={[styles.detailHeader, currentStyles.detailHeader]}>
        <Text style={[styles.detailTitle, currentStyles.detailTitle]}>
          Chi tiết tiêu thụ điện năng
        </Text>
      </View>

      {/* Danh sách báo cáo */}
      <ScrollView style={styles.reportList}>
        {filteredData.length === 0 ? (
          <Text style={[styles.noDataText, currentStyles.text]}>
            Không có dữ liệu cho khoảng thời gian này
          </Text>
        ) : (
          filteredData.map((item, index) => (
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
                      <View
                        style={[
                          styles.statusBar,
                          { backgroundColor: item.status === "Khuyến nghị" ? "#34C759" : "#FF3B30" },
                        ]}
                      />
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

              {/* Danh sách thiết bị */}
              {expandedItem === index && (
                <View style={[styles.deviceList, currentStyles.deviceList]}>
                  {item.devices.map((device: any, deviceIndex: number) => (
                    <View key={deviceIndex} style={styles.deviceItem}>
                      <Text style={[styles.deviceName, currentStyles.text]}>
                        {device.name}
                      </Text>
                      <Text style={[styles.deviceUsage, currentStyles.text]}>
                        {device.usage}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Pop-up cho lời khuyên */}
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
    marginBottom: 0,
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  deviceName: {
    fontSize: 13,
    fontWeight: "500",
  },
  deviceUsage: {
    fontSize: 13,
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