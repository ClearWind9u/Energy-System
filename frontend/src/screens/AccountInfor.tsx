import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../navigation/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavBar from "../component/Navbar";
import axios from "axios";


export default function AccountInfor({ navigation, route }) {
  const { isDayMode, setIsDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const [user, setUser] = useState({
    name: "",
    id: "",
    account: "",
    id_group: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAccount, setNewAccount] = useState("");
  const [newName, setNewName] = useState("");
  const handleLogout = async () => {
    try {
      // Xóa token khỏi AsyncStorage (hoặc SecureStore nếu dùng)
      await AsyncStorage.removeItem("userID");
      // Điều hướng về màn hình đăng nhập
      navigation.replace("Login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
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


  useEffect(() => {
    fetchUserData();
  }, [route.params?.userID]);



    const updateUser = async () => {
      axios
        .patch(
          `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/api/update-user/${route.params.userID}`,
          { account: newAccount, name: newName }
        )
        .then(() => {
          alert("Cập nhật thành công!");
          setUser({ ...user, account: newAccount, name: newName });
          setNewAccount("")
          setNewName("")
        })
        .catch(() => {
          alert("Lỗi khi cập nhật thông tin!");
        });
        
    };




  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header, currentStyles.header]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>Thông tin người dùng</Text>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="bell" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
  <Image
    source={require("../../assets/avar.png")} // Đường dẫn tương đối từ thư mục chứa file này
    style={styles.avatar}
  />
  <Text style={[styles.userName, currentStyles.text]}>{user.name}</Text>
  <Text style={[styles.userEmail, currentStyles.text]}>email@gmail.com</Text>
</View>


      {/* User Info */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : error ? (
          <Text style={[ currentStyles.text]}>{error}</Text>
        ) : (
          <View style={[styles.form, currentStyles.form]}>
            <TextInput
              style={[currentStyles.input, currentStyles.text]}
              value={newName}
              onChangeText={setNewName}
              placeholder={`Họ và tên: ${user.name}`}
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={[currentStyles.input, currentStyles.text]}
              placeholder={`Mã số: ${user.id}`}
              placeholderTextColor="#aaa"
              editable={false}
            />

            <TextInput
              style={[currentStyles.input, currentStyles.text]}
              value={newAccount}
              onChangeText={setNewAccount}
              placeholder={`Tên tài khoản: ${user.account}`}
              placeholderTextColor="#aaa"
            />

            <TextInput
              style={[currentStyles.input, currentStyles.text]}
              placeholder={`Mã cụm : ${user.id_group}`}
              placeholderTextColor="#aaa"
              editable={false}
            />
          </View>
        )}
      </View>


      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={updateUser}>
  <View style={styles.buttonContent}>
    <FontAwesome name="cog" size={20} color="black" style={styles.icon} />
    <Text style={styles.saveButtonText}>Lưu thông tin</Text>
    <FontAwesome name="chevron-right" size={16} color="black" />
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.saveButton} onPress={handleLogout}>
  <View style={styles.buttonContent}>
    <FontAwesome name="sign-out" size={18} color="black" />
    <Text style={styles.logoutButtonText}>Đăng xuất</Text>
    <FontAwesome name="chevron-right" size={14} color="black" />
  </View>
</TouchableOpacity>


      {/* Navigation Bar */}
      <NavBar navigation={navigation} route={{ params: { userID: user.id } }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userEmail: {
    color: "gray",
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 10,
  },
  modeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modeText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
    marginBottom: 250,
    backgroundColor:"white"
  },
  form: {

    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#f7f7f7",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    marginVertical: 10,
    marginLeft:10,
    width:"95%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
alignItems:"center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
    marginLeft: 10,
    alignItems: "center",
  },
});

const dayModeStyles = StyleSheet.create({
  container: { backgroundColor: "#ffffff" },
  header: { backgroundColor: "white" },
  text: { color: "#000" },
  modeContainer: { backgroundColor: "#f0f0f0" },
  input: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  }
});

const nightModeStyles = StyleSheet.create({
  container: { backgroundColor: "#1e1e1e" },
  header: { backgroundColor: "#1e1e1e" },
  text: { color: "white" },
  form: {

    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 0,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  }
});
