import * as Location from "expo-location";
import React, { useState, useEffect, use } from "react";
import { View, ActivityIndicator, BlurEvent } from "react-native";
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

interface information {
  login: string;
  password: string;
}

export default function CAppbar() {
  const [login, setLogin] = useState("");
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [secure, setSecure] = useState(true);

  const handleSubmit = async ({ login, password }: information) => {
    try {
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password,
      );
      const res = await fetch("http://10.0.2.2:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password: hashedPassword }),
      });
      const data = await res.json();
      console.log("User created:", data);
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
          onBlur={() => setPassword(secret)}
          onChangeText={(text: string) => {
            setSecret(text);
          }}
          label="password"
          msg={password}
          placeholder="Type your password"
          variant="outlined"
          textColor="#534DB3"
          outlineColor="#534DB3"
          activeOutlineColor="#534DB3"
          underlineColor="#534DB3"
          activeUnderlineColor="#534DB3"
          selectionColor="#534DB3"
          contentStyle={{}}
          style={{ width: "100%" }}
        />
        <CButton
          onClick={() => handleSubmit({ login, password })}
          msg="Send"
          variant="contained"
          textColor="white"
          style={{ display: "flex", alignSelf: "flex-end", marginTop: 20 }}
          buttonColor="#534DB3"
          labelStyle={{}}
        />
      </View>
    </View>
  );
}
