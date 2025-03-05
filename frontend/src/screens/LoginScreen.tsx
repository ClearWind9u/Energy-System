import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/login-illustration.png")}
        style={styles.image}
      />

      <Text style={styles.title}>Đăng nhập</Text>

      {/* Ô nhập Email */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="person-outline" size={24} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Email hoặc số điện thoại"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Ô nhập mật khẩu */}
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

      {/* Quên mật khẩu */}
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {/* Nút đăng nhập */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Đăng nhập bằng mạng xã hội */}
      <Text style={styles.orText}>hoặc đăng nhập với</Text>
      <View style={styles.socialContainer}>
        <FontAwesome name="google" size={32} color="#DB4437" />
        <FontAwesome name="facebook" size={32} color="#4267B2" />
        <FontAwesome name="instagram" size={32} color="#C13584" />
        <FontAwesome name="linkedin" size={32} color="#0077B5" />
      </View>

      {/* Đăng ký tài khoản */}
      <Text style={styles.signupText}>
        Bạn chưa có tài khoản? <Text style={styles.signupLink}>Đăng ký ngay</Text>
      </Text>

      <StatusBar style="auto" />
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
  image: {
    width: 300,
    height: 150,
    marginBottom: 20,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#007AFF",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  orText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  signupText: {
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});