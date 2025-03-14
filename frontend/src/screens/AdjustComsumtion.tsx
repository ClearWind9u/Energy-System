import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";


export default function AdjustComsumption({navigation}){

    const [isDayMode, setIsDayMode] = useState(true);
    const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
    const [devices, setDevices] = useState([
        {id: 1, name:"TV", isOn: true, icon:"tv", count: 1 },
        {id: 2, name:"Đèn Led", isOn: true, icon:"lightbulb-o", count: 1 },
        {id: 3, name:"Quạt", isOn: true, icon:"fan", count: 1 },
    ])
    const toggleDevice = (id) => {
        setDevices((prev) =>
            prev.map((device) =>
                device.id === id? {...device, isOn:!device.isOn} : device
            )
        );
    }

    return (
        <View style={[styles.container, currentStyles.container]}>
          {/* Header */}
          <View style={[styles.header, currentStyles.container]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
            </TouchableOpacity>
            <Text style={[styles.title, currentStyles.text]}>Điều chỉnh mức tiêu thụ</Text>
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
    
          {/* Danh sách thiết bị */}
          <Text style={[styles.sectionTitle, currentStyles.text]}>Danh sách thiết bị</Text>
          <View style={styles.deviceList}>
            {devices.map((device) => (
              <TouchableOpacity
                key={device.id}
                style={[styles.deviceCard, currentStyles.deviceCard]}
                onPress={() => toggleDevice(device.id)}
              >
                <FontAwesome
                  name={device.icon}
                  size={24}
                  color={isDayMode? "black" : "white"}
                  style={styles.deviceIcon}
                />
                <Text style={[styles.deviceName, currentStyles.text]}>{device.name}</Text>
                <Text style={[styles.deviceCount, currentStyles.text]}>{device.count} Thiết bị</Text>
                <Switch
                  value={device.isOn}
                  onValueChange={() => toggleDevice(device.id)}
                  trackColor={{ false: "#333", true: "#4cd964" }}
                />
              </TouchableOpacity>
            ))}
          </View>
    
          {/* Thanh điều hướng */}
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
      backgroundColor: "#fff",
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
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    deviceList: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    deviceCard: {
      width: "47%",
      backgroundColor: "#F8F8F8",
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      alignItems: "center",
    },
    deviceIcon: {
      marginBottom: 5,
    },
    deviceName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    deviceCount: {
      fontSize: 14,
      color: "#666",
      marginBottom: 5,
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
        width: "47%",
        backgroundColor: "#F8F8F8",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: "center",
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
        width: "47%",
        backgroundColor: "#333",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: "center",
      },
  });
  
  