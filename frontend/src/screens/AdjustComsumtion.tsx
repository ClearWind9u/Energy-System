import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Switch, ImageBackground } from "react-native";
import { useTheme } from "../navigation/ThemeContext";
import NavBar from "../component/Navbar";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdjustComsumption({ navigation, route }) {
  const { isDayMode, apiRequestWithToken } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [devices, setDevices] = useState([]);
  const [isOnAutomatic, setIsOnAutomatic] = useState(false); // switchState[4]: false = auto, true = manual
  const [areAllDevicesOn, setAreAllDevicesOn] = useState(false); // switchState[3]
  const userID = route.params?.userID || null;
  const [user, setUser] = useState({
      name: "",
      id: "",
      account: "",
      id_group: "",
    });

// api getAllDeviceState
  const apiURL = "https://app.coreiot.io/api/plugins/telemetry/DEVICE/8fb0b170-00ce-11f0-a887-6d1a184f2bb5/values/attributes/CLIENT_SCOPE?keys=switchState%5B0%5D%2CswitchState%5B1%5D%2CswitchState%5B2%5D%2CswitchState%5B3%5D%2CswitchState%5B4%5D";

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
    return require("../../assets/appliance.jpg");
  };

  const getDeviceIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("fan")) {
      return { icon: "fan", iconFamily: "MaterialCommunityIcons" };
    }
    if (lower.includes("led")) {
      return { icon: "lightbulb-on", iconFamily: "MaterialCommunityIcons" };
    }
    if (lower.includes("relay")) {
      return { icon: "power-plug", iconFamily: "MaterialCommunityIcons" };
    }
    return { icon: "cog", iconFamily: "MaterialCommunityIcons" };
  };

  const fetchUserData = async () => {
    if (!route.params?.userID) return;
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/api/get-user/${route.params.userID}`
      );
      const data = await response.json();
      if (data.errCode === 0) {
        setUser(data.user);
      } else {
        setError("Không tìm thấy người dùng");
      }

    } catch (error) {
      setError("Lỗi khi tải dữ liệu");
    }
    setLoading(false);
  };



  const fetchDevices = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.warn("No userToken found");
        return;
      }

      const response = apiRequestWithToken
        ? await apiRequestWithToken(() =>
            axios.get(apiURL, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          )
        : await axios.get(apiURL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

      const deviceMap = {
        "switchState[0]": "Relay",
        "switchState[1]": "Fan",
        "switchState[2]": "LED",
      };

      const devices = response.data
        .filter((item) => ["switchState[0]", "switchState[1]", "switchState[2]"].includes(item.key))
        .map((item, index) => {
          const deviceName = deviceMap[item.key] || "Unknown Device";
          const { icon, iconFamily } = getDeviceIcon(deviceName);
          return {
            id: index + 1,
            name: deviceName,
            state: item.value,
            key: item.key,
            icon,
            iconFamily,
            lastUpdateTs: item.lastUpdateTs,
            max_energy: null,
            id_group: null,
          };
        });

      const state0 = response.data.find((item) => item.key === "switchState[0]")?.value;
      const state1 = response.data.find((item) => item.key === "switchState[1]")?.value;
      const state2 = response.data.find((item) => item.key === "switchState[2]")?.value;
      const state3 = response.data.find((item) => item.key === "switchState[3]")?.value;
      const state4 = response.data.find((item) => item.key === "switchState[4]")?.value;

      setDevices(devices);
      setAreAllDevicesOn(state3 || false);
      setIsOnAutomatic(state4 === false);
    } catch (error) {
      console.log("Error fetching devices:", error);
    }
  };

  const toggleMode = async (newValue) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.warn("No userToken found");
        return;
      }

      const payload = {
        method: "setStateMode",
        params: !newValue,
      };

      const response = apiRequestWithToken
        ? await apiRequestWithToken(() =>
            axios.post(
              "https://app.coreiot.io/api/rpc/oneway/8fb0b170-00ce-11f0-a887-6d1a184f2bb5",
              payload,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            )
          )
        : await axios.post(
            "https://app.coreiot.io/api/rpc/oneway/8fb0b170-00ce-11f0-a887-6d1a184f2bb5",
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
// gửi thông báo khi chuyển chế độ thủ công/ tự động

// let userNameLocal = await AsyncStorage.getItem("userName");
console.log("username local auto", user.name);
fetchUserData();

          const payloadAddNoti = {
            id: 1,
            device: "switchState[4]",
            state: newValue,
            // username : userNameLocal
            username : user.name
          }

          const addNewNotification = await axios.post(
            `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/notification`,
            payloadAddNoti,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );



      console.log("Set mode to:", newValue ? "Auto" : "Manual");
      setIsOnAutomatic(newValue);
    } catch (error) {
      console.log("Error toggling mode:", error);
    }
  };

  const turnOffAllDevice = async (newValue) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.warn("No userToken found");
        return;
      }

      const payload = {
        method: "setStateAll",
        params: newValue,
      };

      const response = apiRequestWithToken
        ? await apiRequestWithToken(() =>
            axios.post(
              "https://app.coreiot.io/api/rpc/oneway/8fb0b170-00ce-11f0-a887-6d1a184f2bb5",
              payload,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            )
          )
        : await axios.post(
            "https://app.coreiot.io/api/rpc/oneway/8fb0b170-00ce-11f0-a887-6d1a184f2bb5",
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
// gửi thông báo khi chuyển chế độ bật tắt tất cả các thiệt bị
// console.log("userId at Ajusttt", route.params.userID);
        // let userNameLocal = await AsyncStorage.getItem("userName")  ;
        console.log("username local fulltoping", user.name);
        fetchUserData();


          const payloadAddNoti = {
            id: 1,
            device: "switchState[3]",
            state: newValue,
            // username : userNameLocal
            username : user.name
          }

          const addNewNotification = await axios.post(
            `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/notification`,
            payloadAddNoti,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          

      console.log("Set all devices to:", newValue ? "On" : "Off");
      setAreAllDevicesOn(newValue);
      setDevices((prev) =>
        prev.map((device) => ({ ...device, state: newValue }))
      );
    } catch (error) {
      console.log("Error toggling all devices:", error);
    }
  };

  const toggleDevice = async (device, newValue) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.warn("No userToken found");
        return;
      }
      console.log("token", token);

      console.log(device.name,"device dang thay doi thanh",newValue)


     let deviceMethod = "";
     if (device.name === "Fan" ){ deviceMethod = "setStateFan"; } 
     else if( device.name === "Relay" )  {deviceMethod = "setStateRelay"}
     else if( device.name === "LED") { deviceMethod = "setStateLedMatrix" }

      const payload = {
        method: deviceMethod,
        params: newValue,
        
      };
      const response = apiRequestWithToken
        ? await apiRequestWithToken(() =>
            axios.post(
              "https://app.coreiot.io/api/rpc/oneway/8fb0b170-00ce-11f0-a887-6d1a184f2bb5",
              payload,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            )
          )
        : await axios.post(
            "https://app.coreiot.io/api/rpc/oneway/8fb0b170-00ce-11f0-a887-6d1a184f2bb5",
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

      console.log(`Set ${device.name} to:`, newValue ? "On" : "Off");
      setDevices((prev) =>
        prev.map((d) =>
          d.id === device.id ? { ...d, state: newValue } : d
        )
      );

      devices.forEach((d) => console.log("state hiện tại",d.name, d.state));

      
    } catch (error) {
      console.log(`Error toggling ${device.name}:`, error);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header, currentStyles.header]}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>Điều chỉnh thiết bị</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")} >
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      {/* Mode Switches */}
      <Text style={[styles.sectionTitle, currentStyles.text]}>Chế độ điều khiển</Text>
      <View style={[styles.modeContainer, currentStyles.modeContainer]}>
        <FontAwesome name="sun-o" size={24} color={isDayMode ? "black" : "white"} />
        <Text style={[styles.modeText, currentStyles.text]}>
          {isOnAutomatic ? "Chế độ tự động" : "Chế độ thủ công"}
        </Text>
        <Switch
          value={isOnAutomatic}
          onValueChange={toggleMode}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
          thumbColor="white"
        />
      </View>

      {!isOnAutomatic && (
        <View style={[styles.modeContainer, currentStyles.modeContainer]}>
          <Text style={[styles.modeText, currentStyles.text]}>
            {areAllDevicesOn ? "Đang ở chế độ bật tất cả thiết bị" : "Đang ở chế độ tắt tất cả thiết bị"}
          </Text>
          <Switch
            value={areAllDevicesOn}
            onValueChange={turnOffAllDevice}
            trackColor={{ false: "#ccc", true: "#ff3b30" }}
            thumbColor="white"
          />
        </View>
      )}

      {/* Device List */}
      <Text style={[styles.sectionTitle, currentStyles.text]}>Danh sách thiết bị</Text>
      <ScrollView
        contentContainerStyle={styles.deviceList}
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 660 }}
      >
        {devices.length === 0 && (
          <Text style={[styles.deviceName, currentStyles.text]}>Không có thiết bị nào</Text>
        )}
        {devices.map((device) => (
          <View key={device.id} style={styles.deviceCardWrapper}>
            <ImageBackground
              source={getDeviceBackground(device.name)}
              imageStyle={{ borderRadius: 15 }}
              style={[styles.deviceCard, currentStyles.deviceCard]}
            >
              <View style={styles.overlay}>
                <Text style={[styles.deviceName, { color: "#fff" }]}>{device.name}</Text>
                {!isOnAutomatic && (
                  <Switch
                    value={device.state}
                    onValueChange={(newValue) => toggleDevice(device, newValue)}
                    trackColor={{ false: "#ccc", true: "#4cd964" }}
                    thumbColor="white"
                  />
                )}
              </View>
            </ImageBackground>
          </View>
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
  },
  deviceCard: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  deviceName: {
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  modeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    height: 70,
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100%",
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
  },
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
  },
});