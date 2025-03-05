import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backText}>Trở lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Đăng ký</Text>

      {/* Ô nhập Tên đầy đủ */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="person-outline" size={24} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Tên đầy đủ"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      {/* Ô nhập Số điện thoại */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="phone" size={24} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* Ô nhập Email */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Ô nhập Mật khẩu */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="lock-outline" size={24} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Ô nhập Xác nhận Mật khẩu */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="lock-outline" size={24} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <MaterialIcons
            name={showConfirmPassword ? "visibility" : "visibility-off"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Nút Đăng ký */}
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Đăng ký</Text>
      </TouchableOpacity>

      {/* Điều hướng đến màn hình Đăng nhập */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>
            Bạn đã có tài khoản? <Text style={styles.loginLink}>Đăng nhập ngay</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 50,
    left: 20,
  },
  backText: {
    fontSize: 16,
    marginLeft: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 15,
    width: "100%",
    height: 50,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#007AFF",
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
    marginTop: 20,
  },
  loginLink: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});
