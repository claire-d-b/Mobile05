import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";
import { View, Platform } from "react-native";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuthContext } from "../context/AuthContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Modal, Portal, Text, Button, PaperProvider } from "react-native-paper";
import CTextInput from "./CTextInput";
import CIconButton from "./CIconButton";
import CRating from "./CRating";
import CChip from "./CChip";
import CModal from "./CModal";
import CAvatar from "./CAvatar";
import CBottomNav from "./CBottomNav";
import Profile from "./Profile";

const nbOfEntriesPerPage = 6;

const emotions = [
  "emoticon",
  "emoticon-happy",
  "emoticon-neutral",
  "emoticon-sad",
  "emoticon-angry",
];

const backendUrl =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

interface Entry {
  id: number;
  date: string;
  title: string;
  feeling: number;
  content: string;
  created_at: string;
}

interface PaginatedResponse {
  entries: Entry[];
  page: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface Props {
  setEntries: [];
}

const Home = () => {
  const { localLogin } = useAuthContext();
  // const [title, setTitle] = useState("");
  // const [content, setContent] = useState("");
  // const [feeling, setFeeling] = useState(1);
  // const [visible, setVisible] = useState(false);
  // const showModal = () => setVisible(true);
  // const hideModal = () => setVisible(false);
  // const [page, setPage] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);
  // const [entries, setEntries] = useState<Entry[]>([]);
  // const [message, setMessage] = useState("");
  // const [type, setType] = useState("");
  // // const auth = getAuth();
  // const email = localLogin;
  // console.log(localLogin);
  // const getEmail = () => {
  //   const firebaseEmail = getAuth().currentUser?.email;
  //   return firebaseEmail ?? null;
  // };
  // const formatDate = (timestamp: string) => {
  //   return new Date(timestamp).toISOString().split("T")[0]; // "2026-05-01"
  // };
  // const fetchEntries = async (pageNumber = 0) => {
  //   const email = getEmail();
  //   console.log("📡 fetchEntries email:", email);
  //   console.log(pageNumber);
  //   if (!email) return;
  //   try {
  //     const res = await fetch(
  //       `${backendUrl}/entries/${encodeURIComponent(email)}?page=${pageNumber}`,
  //     );
  //     const data = await res.json();
  //     console.log("data:", data);
  //     if (!res.ok) {
  //       console.error("❌ Failed to fetch entries:", data.error);
  //       return;
  //     }
  //     setEntries(data ?? []); // ← fallback si backend retourne encore un tableau brut
  //     // setPage(page ?? pageNumber);
  //     setTotalPages(Math.ceil(data.length / nbOfEntriesPerPage));
  //     console.log("✅ Entries fetched:", data.entries.length);
  //   } catch (err) {
  //     console.error("❌ Error fetching entries:", err);
  //   }
  // };
  // const deleteEntry = async (id: number) => {
  //   try {
  //     const res = await fetch(`${backendUrl}/entries/${id}`, {
  //       method: "DELETE",
  //     });
  //     const data = await res.json();
  //     if (!res.ok) {
  //       console.error("❌ Failed to delete entry:", data.error);
  //       return;
  //     }
  //     console.log("✅ Entry deleted:", data.entry);
  //     await fetchEntries(page); // ← recharge la page courante
  //   } catch (err) {
  //     console.error("❌ Error deleting entry:", err);
  //   }
  // };
  // const loadMore = async () => {
  //   if (page < totalPages) {
  //     const nextPage = page + 1;
  //     await fetchEntries(nextPage);
  //     setPage(nextPage);
  //   }
  // };
  // const loadLess = async () => {
  //   if (page > 0) {
  //     const nextPage = page - 1;
  //     await fetchEntries(nextPage);
  //     setPage(nextPage);
  //   }
  // };
  // useEffect(() => {
  //   fetchEntries(page);
  //   setPage(0);
  // }, [email]);
  return <CBottomNav style={{ flex: 1 }} />;
  // <Profile login={localLogin} />;
};

export default Home;

// id SERIAL PRIMARY KEY,
// user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
// date DATE NOT NULL DEFAULT CURRENT_DATE,
// title VARCHAR(255),
// feeling INTEGER CHECK (feeling BETWEEN 1 AND 5),
// content TEXT,
// created_at TIMESTAMP DEFAULT NOW(),
// updated_at TIMESTAMP DEFAULT NOW()
