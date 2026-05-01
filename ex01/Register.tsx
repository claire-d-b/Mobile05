import * as Location from "expo-location";
import React, { useState, useEffect, use } from "react";
import { View, ActivityIndicator, BlurEvent, Platform } from "react-native";
import {
  Appbar,
  Text,
  IconButton,
  Icon,
  Menu,
  TextInput,
} from "react-native-paper";
import { evaluate } from "mathjs";
import useGoogleAuth from "./auth_google";
import useGithubAuth from "./auth_github";
import CTextInput from "./CTextInput";
import CButton from "./CButton";
import * as Crypto from "expo-crypto";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { router } from "expo-router";

interface information {
  login: string;
  password: string;
  npassword: string;
}

type RootStackParamList = {
  Signin: undefined;
  Register: undefined;
};

type SigninScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

const Register = () => {
  const navigation = useNavigation<SigninScreenNavigationProp>();
  const [login, setLogin] = useState("");
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [npassword, setNPassword] = useState("");

  const [secure, setSecure] = useState(true);
  const [nsecure, setNSecure] = useState(true);

  const handleSubmit = async ({ login, password, npassword }: information) => {
    try {
      if (password === npassword) {
        if (Platform.OS === "android") {
          const res = await fetch("http://10.0.2.2:3000/user/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ login, password }),
          });
          const data = await res.json();
          console.log("User created:", data);
        } else {
          const res = await fetch("http://localhost:3000/user/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ login, password }),
          });
          const data = await res.json();
          console.log("User created:", data);
        }
      } else {
        console.error("Passwords do not match");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          padding: 10,
        }}
      >
        <CTextInput
          secureTextEntry={false}
          right={<></>}
          onBlur={() => setLogin(text)}
          onChangeText={(text: string) => {
            setText(text);
          }}
          label="login"
          msg={text}
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
          onChangeText={(secret) => {
            setPassword(secret);
          }}
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
          onChangeText={(nsecret) => {
            setNPassword(nsecret);
          }}
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
        />
        <CButton
          onClick={() => handleSubmit({ login, password, npassword })}
          msg="Send"
          variant="contained"
          textColor="white"
          style={{ display: "flex", alignSelf: "flex-end", marginTop: 20 }}
          buttonColor="#534DB3"
          labelStyle={{}}
        />
        <CButton
          onClick={() => router.push("/signin")}
          msg="Already registered ? Sign-in"
          variant="text"
          textColor="#534DB3"
          style={{ display: "flex", alignSelf: "flex-end" }}
          buttonColor="transparent"
          labelStyle={{}}
        />
      </View>
    </View>
  );
};

export default Register;
