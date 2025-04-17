import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground
} from "react-native";
import { useTheme } from "../navigation/ThemeContext";
import NavBar from "../component/Navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DeviceManagement({ navigation }) {
  const { isDayMode, apiRequestWithToken } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem("userID");
        if (storedUserID) {
          console.log("Retrieved userID at DeviceManagement:", storedUserID);
          setUserID(storedUserID);
        }
      } catch (error) {
        console.log("Error retrieving userID:", error);
      }
    };

    fetchUserID();
  }, []);

  const apiURL = "https://app.coreiot.io/api/plugins/telemetry/DEVICE/8fb0b170-00ce-11f0-a887-6d1a184f2bb5/values/attributes/CLIENT_SCOPE?keys=switchState%5B0%5D%2CswitchState%5B1%5D%2CswitchState%5B2%5D%2CswitchState%5B3%5D%2CswitchState%5B4%5D";

  useEffect(() => {
    fetchDevices();
  }, []);

  const getDeviceIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("bulb")) {
      return { icon: "lightbulb", iconFamily: "FontAwesome" };
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
    return require("../../assets/appliance.jpg");
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
            icon,
            iconFamily,
            state: item.value,
            lastUpdateTs: item.lastUpdateTs,
            max_energy: null,
            id_group: null,
          };
        });

      setDevices(devices);
    } catch (error) {
      console.log("Lỗi khi lấy danh sách thiết bị:", error);
    }
  };

  const handleAddDevice = async (newDevice) => {
    let data = {
      device_name: newDevice.name,
      max_energy: newDevice.maxEnergy,
      id_group: newDevice.clusterID,
    };
    try {
      // Note: This endpoint is from the old API and may not work with the new API
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/device/addDevice`, data);
      if (response.status === 200) {
        alert("Thêm thiết bị thành công!");
        fetchDevices();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("Lỗi khi thêm thiết bị:", error);
      alert("Không thể thêm thiết bị: API không hỗ trợ");
    }
  };

  const handleEditDevice = (device) => {
    setSelectedDevice(device);
    setEditModalVisible(true);
  };

  const handleUpdateDevice = async (updatedDevice) => {
    let data = {
      device_id: updatedDevice.id,
      device_name: updatedDevice.name,
      max_energy: updatedDevice.maxEnergy,
      id_group: updatedDevice.clusterID,
    };
    try {
      // Note: This endpoint is from the old API and may not work with the new API
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/device/editDevice`, data);
      if (response.status === 200) {
        alert("Cập nhật thiết bị thành công!");
        fetchDevices();
        setEditModalVisible(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("Lỗi khi cập nhật thiết bị:", error);
      alert("Không thể cập nhật thiết bị: API không hỗ trợ");
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      // Note: This endpoint is from the old API and may not work with the new API
      const response = await axios.delete(`http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/device/deleteDevice`, {
        params: { device_id: deviceId },
      });
      if (response.status === 200) {
        alert("Xóa thiết bị thành công!");
        fetchDevices();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("Lỗi khi xóa thiết bị:", error);
      alert("Không thể xóa thiết bị: API không hỗ trợ");
    }
  };

  const cardColors = ["#4A90E2", "#FF9500", "#34C759"];

  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>Quản lí thiết bị</Text>
        <TouchableOpacity>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      {/* Thêm thiết bị */}
      <TouchableOpacity
        style={[styles.addDevice, currentStyles.addDevice]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.addText, { color: "#fff" }]}>Thêm thiết bị</Text>
        <FontAwesome name="plus-circle" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Danh sách thiết bị */}
      <Text style={[styles.sectionTitle, currentStyles.text]}>Danh sách thiết bị</Text>

      <ScrollView
        contentContainerStyle={styles.deviceList}
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 660 }}
      >
        {devices.length === 0 && (
          <Text style={[styles.deviceName, currentStyles.text]}>Không có thiết bị nào</Text>
        )}
        {devices.map((device, index) => (
          <View
            key={device.id}
            style={[styles.deviceCardWrapper]}
          >
            <ImageBackground
              source={getDeviceBackground(device.name)}
              imageStyle={{ borderRadius: 15 }}
              style={[styles.deviceCard, currentStyles.deviceCard]}
            >
              <View style={styles.overlay}>
                <Text style={[styles.deviceName, { color: "#fff" }]}>{device.name}</Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity onPress={() => handleEditDevice(device)}>
                    <FontAwesome name="pencil" size={20} color="#fff" style={styles.actionButton} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDevice(device);
                      setDeleteModalVisible(true);
                    }}
                  >
                    <FontAwesome name="trash" size={20} color="#fff" style={styles.actionButton} />
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      {/* Modal Thêm Thiết Bị */}
      <AddDeviceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddDevice}
      />
      {/* Modal Sửa Thiết Bị */}
      <EditDeviceModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleUpdateDevice}
        device={selectedDevice}
      />
      {/* Modal Xóa Thiết Bị */}
      <DeleteDeviceModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={() => {
          handleDeleteDevice(selectedDevice?.id);
          setDeleteModalVisible(false);
        }}
        deviceName={selectedDevice?.name}
      />
      {/* Thanh điều hướng */}
      <NavBar navigation={navigation} route={{ params: { userID } }} />
    </View>
  );
}

const AddDeviceModal = ({ visible, onClose, onSubmit }) => {
  const { isDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [deviceName, setDeviceName] = useState("");
  const [maxEnergy, setMaxEnergy] = useState("");
  const [clusterID, setClusterID] = useState("");

  useEffect(() => {
    if (!visible) {
      setDeviceName("");
      setMaxEnergy("");
      setClusterID("");
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={[styles.modalOverlay, currentStyles.modalOverlay]}>
        <View style={[styles.modalContainer, currentStyles.modalContainer]}>
          <Text style={[styles.modalTitle, currentStyles.modalText]}>Thêm thiết bị</Text>

          <Text style={[styles.label, currentStyles.modalText]}>Tên thiết bị:</Text>
          <TextInput
            style={[styles.input, currentStyles.input]}
            value={deviceName}
            onChangeText={setDeviceName}
          />

          <Text style={[styles.label, currentStyles.modalText]}>Mức năng lượng tối đa (W):</Text>
          <TextInput
            style={[styles.input, currentStyles.input]}
            keyboardType="numeric"
            value={maxEnergy}
            onChangeText={setMaxEnergy}
          />

          <Text style={[styles.label, currentStyles.modalText]}>ID cụm:</Text>
          <TextInput
            style={[styles.input, currentStyles.input]}
            keyboardType="numeric"
            value={clusterID}
            onChangeText={setClusterID}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.cancelButton, currentStyles.cancelButton]}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!deviceName || !maxEnergy || !clusterID) {
                  alert("Vui lòng điền đầy đủ thông tin!");
                  return;
                }
                onSubmit({ name: deviceName, maxEnergy, clusterID });
                onClose();
              }}
              style={[styles.submitButton, currentStyles.submitButton]}
            >
              <Text style={styles.buttonText}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const EditDeviceModal = ({ visible, onClose, onSubmit, device }) => {
  const { isDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [deviceName, setDeviceName] = useState(device?.name || "");
  const [maxEnergy, setMaxEnergy] = useState(device?.max_energy?.toString() || "");
  const [clusterID, setClusterID] = useState(device?.id_group?.toString() || "");

  useEffect(() => {
    if (device) {
      setDeviceName(device.name);
      setMaxEnergy(device.max_energy?.toString() || "");
      setClusterID(device.id_group?.toString() || "");
    }
  }, [device]);

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={[styles.modalOverlay, currentStyles.modalOverlay]}>
        <View style={[styles.modalContainer, currentStyles.modalContainer]}>
          <Text style={[styles.modalTitle, currentStyles.modalText]}>Chỉnh sửa thiết bị</Text>

          <Text style={[styles.label, currentStyles.modalText]}>Tên thiết bị:</Text>
          <TextInput
            style={[styles.input, currentStyles.input]}
            value={deviceName}
            onChangeText={setDeviceName}
          />

          <Text style={[styles.label, currentStyles.modalText]}>Mức năng lượng tối đa (W):</Text>
          <TextInput
            style={[styles.input, currentStyles.input]}
            keyboardType="numeric"
            value={maxEnergy}
            onChangeText={setMaxEnergy}
          />

          <Text style={[styles.label, currentStyles.modalText]}>ID cụm:</Text>
          <TextInput
            style={[styles.input, currentStyles.input]}
            keyboardType="numeric"
            value={clusterID}
            onChangeText={setClusterID}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.cancelButton, currentStyles.cancelButton]}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!deviceName || !maxEnergy || !clusterID) {
                  alert("Vui lòng điền đầy đủ thông tin!");
                  return;
                }
                onSubmit({ id: device.id, name: deviceName, maxEnergy, clusterID });
                onClose();
              }}
              style={[styles.submitButton, currentStyles.submitButton]}
            >
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const DeleteDeviceModal = ({ visible, onClose, onConfirm, deviceName }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer]}>
          <Text style={styles.modalTitle}>Xác nhận xóa</Text>
          <Text style={styles.label}>
            Bạn có chắc chắn muốn xóa thiết bị "{deviceName}" không?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.submitButton}>
              <Text style={styles.buttonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 10,
  },
  actionButton: {
    padding: 5,
  },
  addDevice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  addText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 4,
    marginTop: 12,
    fontSize: 15,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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
  addDevice: {
    backgroundColor: "#4A90E2",
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
  },
  modalText: {
    color: "#333",
  },
  input: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
    color: "#333",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  submitButton: {
    backgroundColor: "#007BFF",
  },
});

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
  deviceCard: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  addDevice: {
    backgroundColor: "#6B9BF2",
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    backgroundColor: "#333",
  },
  modalText: {
    color: "#fff",
  },
  input: {
    borderColor: "#666",
    backgroundColor: "#444",
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#555",
  },
  submitButton: {
    backgroundColor: "#1E90FF",
  },
});