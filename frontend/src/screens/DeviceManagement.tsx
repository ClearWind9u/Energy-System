import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Switch, TouchableOpacity, StyleSheet, TextInput, Modal } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useTheme } from "../navigation/ThemeContext";

export default function DeviceManagement({ navigation }) {
    const { isDayMode, setIsDayMode } = useTheme();
    const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);

    const apiURL = `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/device`;

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await axios.get(`${apiURL}`);
            setDevices(response.data);
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
            const response = await axios.post(`${apiURL}/addDevice`, data);
            if (response.status === 200) {
                alert("Thêm thiết bị thành công!");
                fetchDevices();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log("Lỗi khi thêm thiết bị:", error);
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
            const response = await axios.post(`${apiURL}/editDevice`, data);
            if (response.status === 200) {
                alert("Cập nhật thiết bị thành công!");
                fetchDevices();
                setEditModalVisible(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log("Lỗi khi cập nhật thiết bị:", error);
        }
    };

    // API: Xóa thiết bị
    const handleDeleteDevice = async (deviceId) => {
        try {
            const response = await axios.delete(`${apiURL}/deleteDevice`, {
                params: { device_id: deviceId } // Truyền device_id vào params
            });
            if (response.status === 200) {
                alert("Xóa thiết bị thành công!");
                fetchDevices(); // Cập nhật danh sách thiết bị
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log("Lỗi khi xóa thiết bị:", error);
        }
    };

    return (
        <View style={[styles.container, currentStyles.container]}>
            {/* Header */}
            <View style={[styles.header, currentStyles.header]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
                </TouchableOpacity>
                <Text style={[styles.title, currentStyles.text]}>Quản lí thiết bị</Text>
                <TouchableOpacity>
                    <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
                </TouchableOpacity>
            </View>

            {/* Chế độ */}
            <Text style={[styles.sectionTitle, currentStyles.text]}>Chế độ</Text>
            <View style={[styles.modeContainer, currentStyles.modeContainer]}>
                <FontAwesome name="sun-o" size={24} color={isDayMode ? "black" : "white"} />
                <Text style={[styles.modeText, currentStyles.text]}>
                    {isDayMode ? "Chế độ ban ngày" : "Chế độ ban đêm"}
                </Text>
                <Switch value={isDayMode} onValueChange={() => setIsDayMode(!isDayMode)} />
            </View>

            {/* Thêm thiết bị */}
            <TouchableOpacity style={styles.addDevice} onPress={() => setModalVisible(true)}>
                <Text style={[styles.addText, currentStyles.text]}>Thêm thiết bị</Text>
                <FontAwesome name="plus-circle" size={20} color={currentStyles.text.color} />
            </TouchableOpacity>

            {/* Danh sách thiết bị */}
            <Text style={[styles.sectionTitle, currentStyles.text]}>Danh sách thiết bị</Text>
            <ScrollView contentContainerStyle={styles.deviceList} showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
                {devices.map((device) => (
                    <View key={device.id} style={[styles.deviceCard, currentStyles.deviceCard]}>
                        <MaterialCommunityIcons name="devices" size={24} color={isDayMode ? "black" : "white"} />
                        <Text style={[styles.deviceName, currentStyles.text]}>{device.name}</Text>

                        {/* Nhóm nút Sửa & Xóa */}
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity onPress={() => handleEditDevice(device)}>
                                <FontAwesome name="pencil" size={20} color="blue" style={styles.actionButton} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteDevice(device.id)}>
                                <FontAwesome name="trash" size={20} color="red" style={styles.actionButton} />
                            </TouchableOpacity>
                        </View>
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
            <EditDeviceModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} onSubmit={handleUpdateDevice} device={selectedDevice} />

            {/* Thanh điều hướng */}
            <View style={[styles.bottomNav, currentStyles.bottomNav]}>
                <TouchableOpacity style={styles.navButton}>
                    <MaterialCommunityIcons name="view-dashboard" size={24} color="white" />
                    <Text style={styles.navText}>Bảng điều khiển</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton}>
                    <MaterialCommunityIcons name="microphone" size={24} color="white" />
                    <Text style={styles.navText}>Microphone</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton}>
                    <MaterialCommunityIcons name="account" size={24} color="white" />
                    <Text style={styles.navText}>Tài khoản</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const AddDeviceModal = ({ visible, onClose, onSubmit }) => {
    const [deviceName, setDeviceName] = useState("");
    const [maxEnergy, setMaxEnergy] = useState("");
    const [clusterID, setClusterID] = useState("");

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Thêm thiết bị</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Tên thiết bị"
                        value={deviceName}
                        onChangeText={setDeviceName}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Mức năng lượng tối đa (W)"
                        keyboardType="numeric"
                        value={maxEnergy}
                        onChangeText={setMaxEnergy}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="ID cụm"
                        keyboardType="numeric"
                        value={clusterID}
                        onChangeText={setClusterID}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                onSubmit({ name: deviceName, maxEnergy, clusterID });
                                onClose();
                            }}
                            style={styles.submitButton}
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
    const [deviceName, setDeviceName] = useState(device?.name || "");
    const [maxEnergy, setMaxEnergy] = useState(device?.max_energy?.toString() || "");
    const [clusterID, setClusterID] = useState(device?.id_group?.toString() || "");

    useEffect(() => {
        if (device) {
            setDeviceName(device.name);
            setMaxEnergy(device.max_energy?.toString());
            setClusterID(device.id_group?.toString());
        }
    }, [device]);

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Chỉnh sửa thiết bị</Text>
                    <TextInput style={styles.input} placeholder="Tên thiết bị" value={deviceName} onChangeText={setDeviceName} />
                    <TextInput style={styles.input} placeholder="Mức năng lượng tối đa (W)" keyboardType="numeric" value={maxEnergy} onChangeText={setMaxEnergy} />
                    <TextInput style={styles.input} placeholder="ID cụm" keyboardType="numeric" value={clusterID} onChangeText={setClusterID} />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { onSubmit({ id: device.id, name: deviceName, maxEnergy, clusterID }); onClose(); }} style={styles.submitButton}>
                            <Text style={styles.buttonText}>Lưu</Text>
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
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
        flexDirection: "column",
    },
    buttonGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 50,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    deviceCount: {
        fontSize: 14,
        color: "#666",
    },
    addDevice: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 5,
    },
    addText: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 10,
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
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "white",
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
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginVertical: 10,
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: "#F9F9F9",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        width: "100%",
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "gray",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginRight: 10,
    },
    submitButton: {
        flex: 1,
        backgroundColor: "#007BFF",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
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