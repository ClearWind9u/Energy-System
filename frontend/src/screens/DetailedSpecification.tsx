import React, { useState } from "react";
import { 
  View, Text, Switch, TouchableOpacity, StyleSheet, Image 
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../navigation/ThemeContext";
export default function DetailedSpecification({ navigation }) {
  const {isDayMode, setIsDayMode} = useTheme();

  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;

  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header, currentStyles.container]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>Phòng khách</Text>
        <TouchableOpacity>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

                {/* Chế độ ban ngày / ban đêm */}
        <View style={[styles.modeContainer , currentStyles.modeContainer]}>
                  <FontAwesome name="sun-o" size={24} color={isDayMode? "black" : "white"} />
                  <Text style={[styles.modeText, currentStyles.text]} >
                    {isDayMode ? "Chế độ ban ngày" : "Chế độ ban đêm"}
                  </Text>
                  <Switch
                    value={isDayMode}
                    onValueChange={() => setIsDayMode(!isDayMode)}
                    trackColor={{ false: "#ccc", true: "#4cd964" }}
                  />
        </View>

     {/* Detail Section */}
     <Text style={[styles.sectionTitle, currentStyles.text]}>Thông số chi tiết</Text>
      <View style={[styles.deviceCard, currentStyles.deviceCard ]}>
        <Text style={[currentStyles.text]}>Công suất tối đa: 300 W</Text>
        <Text style={[currentStyles.text]}>Lượng điện đã tiêu thụ: 3500 kWh</Text>
        <Text style={[currentStyles.text]}>Thời gian sử dụng: 1500 h</Text>
        <Text style={[currentStyles.text]}>Màu đang bật: Màu đỏ</Text>
      </View>

       {/* Bottom Navigation */}
            <View style={[styles.bottomNav, currentStyles.bottomNav]}>
              <TouchableOpacity style={styles.navButton}>
                <MaterialCommunityIcons name="view-dashboard" size={24} color="white" />
                <Text style={styles.navText}>Bảng điều khiển</Text>
              </TouchableOpacity>
      
              <TouchableOpacity style={styles.navButton}>
                <MaterialCommunityIcons name="microphone" size={24} color="white" />
              </TouchableOpacity>
      
              <TouchableOpacity style={styles.navButton}>
                <MaterialCommunityIcons name="account" size={24} color="white" />
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
    marginBottom: 20
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
  },    modeText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  }
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
        marginBottom: 20
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
  
  

