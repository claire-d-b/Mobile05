import React, { useState } from "react";
import { View, Platform } from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import auth from "../config/firebase";
import { useAuthContext } from "../context/AuthContext"
import CTextInput from "./CTextInput";
import CButton from "./CButton";

interface Information {
  login: string;
  password: string;
  npassword: string;
}

const backendUrl = Platform.OS === "android"
  ? "http://10.0.2.2:3000"
  : "http://localhost:3000";

const Register = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [npassword, setNPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [nsecure, setNSecure] = useState(true);
  const [error, setError] = useState("");
  const { setLocalLogin } = useAuthContext();

  const handleSubmit = async ({ login, password, npassword }: Information) => {
    setError("");
    if (password !== npassword) {
      setError("Passwords do not match");
      return;
    }    

    try {
      // 1. Appel backend
      const res = await fetch(`${backendUrl}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        console.error("❌ Registration failed:", data.error);
        return;
      }

      console.log("✅ Backend registration success:", data.user);
      await setLocalLogin(login);
      router.push("/home")

      // 3. _layout.tsx détecte onAuthStateChanged → redirige vers /(tabs)

    } catch (err: any) {
      console.error("❌ Error during registration:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Account already exists");
      } else {
        setError("An error occurred");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom", "left", "right"]}>
    <View style={{ width: "100%", height: "100%", flexDirection: "column",
      alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: "100%", padding: 10 }}>
        <CTextInput
          secureTextEntry={false}
          right={<></>}
          onBlur={() => {}}
          onChangeText={(text: string) => setLogin(text)}
          label="login"
          msg={login}
          placeholder="Type your login"
          variant="outlined"
          textColor="#534DB3"
          outlineColor="#534DB3"
          outlineStyle={{ borderRadius: 10 }}
          activeOutlineColor="#534DB3"
          underlineColor="#534DB3"
          activeUnderlineColor="#534DB3"
          selectionColor="#534DB3"
          contentStyle={{}}
          style={{ width: "100%" }}
          disabled={false}
          multiline={false}
        />
        <CTextInput
          secureTextEntry={secure}
          right={
            <TextInput.Icon
              icon={secure ? "eye-off" : "eye"}
              onPress={() => setSecure(!secure)}
            />
          }
          onBlur={() => {}}
          onChangeText={(secret) => setPassword(secret)}
          label="password"
          msg={password}
          placeholder="Type your password"
          variant="outlined"
          textColor="#534DB3"
          outlineColor="#534DB3"
          outlineStyle={{ borderRadius: 10 }}
          activeOutlineColor="#534DB3"
          underlineColor="#534DB3"
          activeUnderlineColor="#534DB3"
          selectionColor="#534DB3"
          contentStyle={{}}
          style={{ width: "100%", borderRadius: 10 }}
          disabled={false}
          multiline={false}
        />
        <CTextInput
          secureTextEntry={nsecure}
          right={
            <TextInput.Icon
              icon={nsecure ? "eye-off" : "eye"}
              onPress={() => setNSecure(!nsecure)}
            />
          }
          onBlur={() => {}}
          onChangeText={(nsecret) => setNPassword(nsecret)}
          label="confirm password"
          msg={npassword}
          placeholder="confirm your password"
          variant="outlined"
          textColor="#534DB3"
          outlineColor="#534DB3"
          outlineStyle={{ borderRadius: 10 }}
          activeOutlineColor="#534DB3"
          underlineColor="#534DB3"
          activeUnderlineColor="#534DB3"
          selectionColor="#534DB3"
          contentStyle={{}}
          style={{ width: "100%", borderRadius: 10 }}
          disabled={false}
          multiline={false}
        />
        {error ? (
          <CButton
            msg={error}
            variant="text"
            textColor="red"
            style={{}}
            buttonColor="transparent"
            labelStyle={{}}
            onPress={() => {}}
          />
        ) : null}
        <CButton
          onPress={() => handleSubmit({ login, password, npassword })}
          msg="Send"
          variant="contained"
          textColor="white"
          style={{ display: "flex", alignSelf: "flex-end", marginTop: 20 }}
          buttonColor="#534DB3"
          labelStyle={{}}
        />
        <CButton
          onPress={() => router.push("/signin")}
          msg="Already registered ? Sign-in"
          variant="text"
          textColor="#534DB3"
          style={{ display: "flex", alignSelf: "flex-end" }}
          buttonColor="transparent"
          labelStyle={{}}
        />
      </View>
    </View>
    </SafeAreaView>
  );
};

export default Register;