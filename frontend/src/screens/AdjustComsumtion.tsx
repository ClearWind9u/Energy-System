import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Switch, ImageBackground } from "react-native";
import { useTheme } from "../navigation/ThemeContext";
import NavBar from "../component/Navbar";
import { ScrollView } from "react-native-gesture-handler";

export default function AdjustComsumption({ navigation, route }) {
  const { isDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [devices, setDevices] = useState([]);
  const apiURL = `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/device`;
  const userID = route.params?.userID || null;
  const [isDeviceOn, setDeviceOn] = useState(false); // Initial state is false (off)
  const [isOnAutomatic, setOnAutomatic] = useState(false); // Initial state is false (off)
  

  useEffect(() => {
    fetchDevices();
  }, []);


  const getDeviceIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("led")) {
      return { icon: "lightbulb-o", iconFamily: "FontAwesome" };
    }
    if (lower.includes("tv") || lower.includes("television")) {
      return { icon: "tv", iconFamily: "FontAwesome" };
    }
    if (lower.includes("relay")) {
      return { icon: "plug", iconFamily: "FontAwesome" };
    }
    if (lower.includes("fan")) {
      return { icon: "fan", iconFamily: "MaterialCommunityIcons" };
    }
    return { icon: "gears", iconFamily: "FontAwesome" }; 
  };

  const getDeviceBackground = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("fan")) {
      return require("../../assets/fan.jpg");
    }
    if (lower.includes("led")) {
      return require("../../assets/led.jpg");
    }
    if (lower.includes("tv") || lower.includes("television")) {
      return require("../../assets/tv.png");
    }
    if (lower.includes("relay")) {
      return require("../../assets/relay.jpg");
    }
    if (lower.includes("sensor")) {
      return require("../../assets/SENSOR.jpg");
    }
    return require("../../assets/appliance.jpg"); // fallback image
  };


  

  const fetchDevices = async () => {
    try {
      const response = await axios.get(`${apiURL}`);
      let copy = response.data;
      console.log(response.data);
      copy.forEach((item) => {
        const { icon, iconFamily } = getDeviceIcon(item.name);
        const backgroundImage = getDeviceBackground(item.name);
        item.icon = icon;
        item.iconFamily = iconFamily;
        // isOn : False,
      });
      setDevices(copy);
    } catch (error) {
      console.log("Lỗi khi lấy danh sách thiết bị:", error);
    }
  };

  // Mảng màu cho các card
  const cardColors = ["#4A90E2", "#FF9500", "#34C759", "#FFCC00"];

  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header, currentStyles.header]}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>Điều chỉnh mức tiêu thụ</Text>
        <TouchableOpacity>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      {/* Danh sách thiết bị */}
      <Text style={[styles.sectionTitle, currentStyles.text]}>Danh sách thiết bị</Text>

            <View style={[styles.modeContainer, currentStyles.modeContainer]}>
              <FontAwesome name="sun-o" size={24} color={isDayMode ? "black" : "white"} />
              <Text style={[styles.modeText, currentStyles.text]}>
                {isOnAutomatic ? "Chế độ bật tự động" : "Chế độ bật thủ công"}
              </Text>
              <Switch
                value={isOnAutomatic}
                onValueChange={() => setOnAutomatic(!isOnAutomatic)}
                trackColor={{ false: "#ccc", true: "#4cd964" }}
                thumbColor="white"
              />
            </View>

      <ScrollView contentContainerStyle={styles.deviceList} showsVerticalScrollIndicator={false} style={{ maxHeight: 660 }}>
        {devices.map((device, index) => (
          <TouchableOpacity
            key={device.id}
            style={[
              // styles.deviceCard,
              // currentStyles.deviceCard,
              styles.deviceCardWrapper,
              // { backgroundColor: cardColors[index % cardColors.length] },
            ]}
            onPress={() =>
              navigation.navigate("device", {
                deviceName: device.name,
                maxEnergy: device.max_energy,
              })
            }
            activeOpacity={0.8}
          >
            {/* {device.iconFamily === "MaterialCommunityIcons" ? (
              <MaterialCommunityIcons
                name={device.icon}
                size={40}
                color="#fff"
                style={styles.deviceIcon}
              />
            ) : (
              <FontAwesome
                name={device.icon}
                size={40}
                color="#fff"
                style={styles.deviceIcon}
              />
            )}
            <Text style={[styles.deviceName, { color: "#fff" }]}>{device.name}</Text>
            <Text style={[styles.deviceCount, { color: "#fff" }]}>
              {device.count} Thiết bị
            </Text>
            
             <View style={[]}>
                    <Switch
                      value={isDeviceOn}
                      onValueChange={() => setDeviceOn(!isDeviceOn)}
                      trackColor={{ false: "#ccc", true: "#4cd964" }}
                      thumbColor="white"
                    />
                  </View> */}
<ImageBackground
  source={getDeviceBackground(device.name)}
  imageStyle={{ borderRadius: 15 }}
  style={[styles.deviceCard, currentStyles.deviceCard]}
>
  <View style={styles.overlay}>
    <Text style={[styles.deviceName, { color: "#fff" }]}>{device.name}</Text>
    <Text style={[styles.deviceCount, { color: "#fff" }]}>
      {device.count} Thiết bị
    </Text>
    <Switch
      value={isDeviceOn}
      onValueChange={() => setDeviceOn(!isDeviceOn)}
      trackColor={{ false: "#ccc", true: "#4cd964" }}
      thumbColor="white"
    />
  </View>
</ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  deviceList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor:"transparent"
  },
  deviceCard: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 15,

    marginBottom: 15,
    alignItems: "center",
    overflow: "hidden", // để bo góc ảnh
    justifyContent: "center",
    backgroundColor:"transparent"
  },
  deviceIcon: {
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  deviceCount: {
    fontSize: 14,
    textAlign: "center",
  },
  modeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    height:70,
    borderRadius: 10,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modeText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  deviceCardWrapper: {
    width: "48%",
    marginBottom: 15,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: "100%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 15,
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
  deviceCard: {
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  modeContainer: {
    backgroundColor: "#F2F2F2",
  }
});

const nightModeStyles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
  },
  header: {
    backgroundColor: "#1E1E1E",
  },
  text: {
    color: "white",
  },
  deviceCard: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  modeContainer: {
    backgroundColor: "#333",
  }
});