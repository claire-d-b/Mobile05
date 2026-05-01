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
import * as Crypto from "expo-crypto";
import { useNavigation } from "@react-navigation/native";
import SignIn from "./Signin";

interface information {
  login: string;
  password: string;
}

export default function CAppbar() {
  return <SignIn />;
}
