import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Switch, ImageBackground } from "react-native";
import { useTheme } from "../navigation/ThemeContext";
import NavBar from "../component/Navbar";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function AdjustComsumption({ navigation, route }) {
  const { isDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [devices, setDevices] = useState([]);
  const apiURL = `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/device`;
  const userID = route.params?.userID || null;
  const [isDeviceOn, setDeviceOn] = useState(false); // Initial state is false (off)
  const [isOnAutomatic, setIsOnAutomatic] = useState(null); // Initial state is false (off)
  const [token, setUserToken] = useState(null);
  const [areAllDevicesOn, setAreAllDevicesOn] = useState(false);
  const [isRelayOn, setRelayOn] = useState(false);
  const [isFanOn, setFanOn] = useState(false);
  const [isLedOn, setLedOn] = useState(false);
  // const [ledKey] = useState()

  const getAutoMode = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.warn("No userToken found");
        return;
      }
  
      const response = await axios.get(
        `https://app.coreiot.io/api/plugins/telemetry/DEVICE/8fb0b170-00ce-11f0-a887-6d1a184f2bb5/values/attributes/CLIENT_SCOPE?keys=switchState%5B0%5D%2CswitchState%5B1%5D%2CswitchState%5B2%5D%2CswitchState%5B3%5D%2CswitchState%5B4%5D`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("token",token)
  
      const data = response.data;
      console.log("Device States:", JSON.stringify(data, null, 2));
      // console.log("Device States:", data);
  
      const state4 = data.find((item) => item.key === "switchState[4]")?.value;  // auto or manual
      console.log("state4",state4 === false ? "che do tu dong false" : "che do thu cong true" )
      if (state4 !== undefined) {
        setIsOnAutomatic(!state4);
      }
      const state0 = data.find((item) => item.key === "switchState[0]")?.value; // relay
      const state1 = data.find((item) => item.key === "switchState[1]")?.value; //fan
      const state2 = data.find((item) => item.key === "switchState[2]")?.value; // ledmatrix
      const state3 = data.find((item) => item.key === "switchState[3]")?.value;   // switchAll
      const allKeys = data.map((item) => item.key);
      console.log("Tất cả các key:", allKeys);
      


      if (state3 === false) { setAreAllDevicesOn(false);  } 
      if( state0 === true){ setRelayOn(true) } else { setRelayOn(false) }

      if( state1 === true){ setFanOn(true) } else { setFanOn(false) }

      if( state2 === true){ setLedOn(true) } else { setLedOn(false) }

      const DEVICE_MAP = {
        "switchState[0]": "relay",
        "switchState[1]": "fan",
        "switchState[2]": "led",
        "switchState[3]": "switchAll",
        "switchState[4]": "autoMode"
      };
      console.log("ledddd",ledKey)
      
    
      const deviceName = DEVICE_MAP[ledKey]; // "led"
      const bg = getDeviceBackground(deviceName);
      console.log("Background for", deviceName, ":", bg);
      
    
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

    } catch (error) {
      if (error.response) {
        console.log("Server error:", error.response.status, error.response.data);
      } else {
        console.log("Other error:", error.message);
      }
    }
  };

  useEffect(() => {
    // Gọi lần đầu tiên khi component mount
    getAutoMode();
    // Gọi lại mỗi 5 giây
    const interval = setInterval(() => {
      getAutoMode();
    }, 5000); // 5000ms = 5 giây
    // Xóa interval khi component unmount
    return () => clearInterval(interval);
  }, []);

  const turnOffAllDevice  = async (newValue) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.warn("No userToken found");
        return;
      }
    
      console.log("outinn", token);
      console.log("newvalue", newValue);

      const payload = {
        method: "setStateAll",
        params: !newValue, 
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      await axios.post(
        "https://app.coreiot.io/api/rpc/oneway/8fb0b170-00ce-11f0-a887-6d1a184f2bb5",
        payload,
        config
      );
      console.log("payload", payload.params);

      console.log("Gửi turnOffAllDevice  thành côngggggg:", newValue);

      setAreAllDevicesOn(newValue); // cập nhật UI sau khi gửi thành công
    } catch (error) {
      console.log("Lỗi khi gửi chế độ:", error);
    }
  };



  // const fetchDevices = async () => {
  //   try {
  //     const response = await axios.get(`${apiURL}`);
  //     let copy = response.data;
  //     // console.log(response.data);
  //     copy.forEach((item) => {
  //       const backgroundImage = getDeviceBackground(item.name);
  //       // item.iconFamily = iconFamily;
  //     });
  //     setDevices(copy);
  //   } catch (error) {
  //     console.log("Lỗi khi lấy danh sách thiết bị:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchDevices();
  // }, []);
  
  // Gửi API khi component load lần đầu
  const toggleMode = async (newValue) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.warn("No userToken found");
        return;
      }
    
      console.log("outinn", token);
      console.log("newvalue", newValue);

      const payload = {
        method: "setStateMode",
        params: !newValue, 
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      await axios.post(
        "https://app.coreiot.io/api/rpc/oneway/8fb0b170-00ce-11f0-a887-6d1a184f2bb5",
        payload,
        config
      );
      console.log("payload", payload.params);

      console.log("Gửi chế độ thành côngggggg:", newValue);

      setIsOnAutomatic(newValue); // cập nhật UI sau khi gửi thành công
      // getAutoMode();
    } catch (error) {
      console.log("Lỗi khi gửi chế độ:", error);
    }
  };

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

          {/* Switch chọn giữa Tự động và Thủ công */}
          <Switch
            value={isOnAutomatic}
            onValueChange={toggleMode}
            trackColor={{ false: "#ccc", true: "#4cd964" }}
            thumbColor="white"
          />
        </View>

        {/* Nếu là chế độ thủ công thì mới hiển thị thêm Switch phụ */}
        {!isOnAutomatic && (
          <View style={[styles.modeContainer, currentStyles.modeContainer]}>
            <Text style={[styles.modeText, currentStyles.text]}>
              {areAllDevicesOn ?  "Chế độ tắt tất cả các thiết bị" :  "Chế độ bật tất cả các thiết bị"}
            </Text>
            <Switch
              value={areAllDevicesOn}
              onValueChange={turnOffAllDevice}
              trackColor={{ false: "#ccc", true: "#ff3b30" }}
              thumbColor="white"
            />
          </View>
        )}

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
  manualControlContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 20,
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