import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../navigation/ThemeContext";
import NavBar from "../component/Navbar";
export default function AdjustComsumption({ navigation, route }) {

  const { isDayMode, setIsDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [devices, setDevices] = useState([]);
  const apiURL = `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/device`;
  const userID = route.params?.userID || null;

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
          var response = await axios.get(`${apiURL}`);
          let copy = response.data;
          copy.forEach(item => {
            if(item.name.toLowerCase().includes("bulb")){
              item.icon = "lightbulb-o";
            }
            else if(item.name.toLowerCase().includes("tv") || item.name.toLowerCase().includes("television")){
                item.icon = "tv";
            }
            else item.icon = "gears";
          });
          setDevices(copy);
        } catch (error) {
            console.log("Lỗi khi lấy danh sách thiết bị:", error);
        }
    };
  // const toggleDevice = (id) => {
  //   setDevices((prev) =>
  //     prev.map((device) =>
  //       device.id === id ? { ...device, isOn: !device.isOn } : device
  //     )
  //   );
  // }

  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header, currentStyles.container]}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>Điều chỉnh mức tiêu thụ</Text>
        <TouchableOpacity>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      {/* Chế độ ban ngày / ban đêm */}
      {/* <View style={[styles.modeContainer, currentStyles.modeContainer]}>
        <FontAwesome name="sun-o" size={24} color={isDayMode ? "black" : "white"} />
        <Text style={[styles.modeText, currentStyles.text]} >
          {isDayMode ? "Chế độ ban ngày" : "Chế độ ban đêm"}
        </Text>
        <Switch
          value={isDayMode}
          onValueChange={() => setIsDayMode(!isDayMode)}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
        />
      </View> */}

      {/* Danh sách thiết bị */}
      <Text style={[styles.sectionTitle, currentStyles.text]}>Danh sách thiết bị</Text>
      <View style={styles.deviceList}>
        {devices.map((device) => (
          <TouchableOpacity
            key={device.id}
            style={[styles.deviceCard, currentStyles.deviceCard]}
            onPress={() => navigation.navigate("device",{
              deviceName: device.name,
              maxEnergy: device.max_energy,  
            })}
          >
            {device.iconFamily === "MaterialCommunityIcons" ? (
              <MaterialCommunityIcons name="devices" size={24} color={isDayMode ? "black" : "white"} />
            ) : (
              <FontAwesome name={device.icon} size={24} color={isDayMode ? "black" : "white"} />
            )}
            <Text style={[styles.deviceName, currentStyles.text]}>{device.name}</Text>
            <Text style={[styles.deviceCount, currentStyles.text]}>{device.count} Thiết bị</Text>
          </TouchableOpacity>
        ))}
      </View>

      <NavBar navigation={navigation} route={{params : {userID}} } />
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

