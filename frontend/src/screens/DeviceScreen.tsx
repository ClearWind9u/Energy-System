import React, { useState } from "react";
import { 
  View, Text, Switch, TouchableOpacity, StyleSheet, Image 
} from "react-native";
import Slider from "@react-native-community/slider";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../navigation/ThemeContext";

export default function DeviceScreen({ navigation }) {
  const {isDayMode, setIsDayMode} = useTheme();
  const [power, setPower] = useState(24); // Power level
  const [isDeviceOn, setIsDeviceOn] = useState(true);
  const [selectedColor, setSelectedColor] = useState("green");

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

      {/* Device Switch */}
      <View style={[styles.deviceCard, currentStyles.modeContainer]}>
        <FontAwesome name="sun-o" size={24} color={isDayMode ? "black" : "white"} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.deviceName, currentStyles.text]}>Đèn LED</Text>
          <Text style={[styles.deviceCount, currentStyles.text]}>1 thiết bị</Text>
        </View>
        <Switch
          value={isDeviceOn}
          onValueChange={() => setIsDeviceOn(!isDeviceOn)}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
        />
      </View>

      {/* Power Display */}
      <Text style={[styles.sectionTitle, currentStyles.text]}>Công suất tối đa</Text>
      <Text style={[styles.powerDisplay, currentStyles.text]}>{power} W</Text>

      {/* Power Slider */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={power}
        onValueChange={(value) => setPower(value)}
        minimumTrackTintColor="green"
        maximumTrackTintColor="gray"
        thumbTintColor="green"
      />

      {/* Color Selection */}
      <Text style={[styles.sectionTitle, currentStyles.text]}>Màu sắc</Text>
      <View style={styles.colorContainer}>
        {["red", "green", "blue"].map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorBox,
              { borderColor : selectedColor === color ? (isDayMode ? "black" : "white"): "transparent"}
            ]}
            onPress={() => setSelectedColor(color)}
          >
            <MaterialCommunityIcons name="lightbulb" size={40} color={color} />
          </TouchableOpacity>
        ))}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 10,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  powerDisplay: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  colorBox: {
    width: 70,
    height: 70,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
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
  },     
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deviceCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
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
  
  

