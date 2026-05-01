// app/index.tsx
import "../global.css";
import Signin from "./signin"
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
  return <Signin />
}
