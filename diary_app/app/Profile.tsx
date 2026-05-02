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
  login: string | null;
}

const successColor = "#25783F";
const errorColor = "#A12237";

const Profile = ({ login }: Props) => {
  const { localLogin } = useAuthContext();
  const firebaseEmail = getAuth().currentUser?.email;
  const email = firebaseEmail ?? localLogin;

  useEffect(() => {
    if (!email) return;

    fetchCount();
    fetchEntries(0);
    setPage(0);
  }, [email]);

  console.log("authhhh", localLogin);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [feeling, setFeeling] = useState(3);

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [totalNbOfEntries, setTotalNbOfEntries] = useState(0);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  // const auth = getAuth();
  // const email = auth.currentUser?.email ?? localLogin;
  console.log(localLogin);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toISOString().split("T")[0]; // "2026-05-01"
  };

  const fetchEntries = async (pageNumber = 0) => {
    if (!login) return;

    const res = await fetch(
      `${backendUrl}/entries/${encodeURIComponent(login)}?page=${pageNumber}`,
    );

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.log("❌ backend not JSON:", text);
      return;
    }

    setEntries(Array.isArray(data) ? data : (data.entries ?? []));
    setTotalPages(data.totalPages ?? 0);
  };

  const fetchCount = async () => {
    if (!login) return;

    try {
      const res = await fetch(
        `${backendUrl}/entries/${encodeURIComponent(login)}/count`,
      );

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("❌ count not JSON:", text);
        return;
      }

      setTotalNbOfEntries(data.count ?? 0);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      const res = await fetch(`${backendUrl}/entries/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("❌ Failed to delete entry:", data.error);
        return;
      }
      console.log("✅ Entry deleted:", data.entry);
      await fetchEntries(page); // ← recharge la page courante
      fetchCount();
    } catch (err) {
      console.error("❌ Error deleting entry:", err);
    }
  };

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

  const handleSubmit = async () => {
    setMessage("");
    if (!title || !content) {
      setMessage("Please provide a title and content.");
      setType("error");
      return;
    }
    console.log("📡 auth.currentUser:", login);
    console.log("📡 email utilisé:", email);

    try {
      const res = await fetch(`${backendUrl}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
          title,
          feeling,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Failed to create entry:", data.error);
        return;
      }

      console.log("✅ Entry created:", data);
      setMessage("Entry successfully created!");
      setType("success");

      // Reset
      setTitle("");
      setContent("");
      setFeeling(1);
      await fetchEntries(0);
      fetchCount();
      // hideModal();
    } catch (err) {
      console.error("❌ Error creating entry:", err);
    }
  };
  useEffect(() => {
    setType("");
    if (!login) return;

    fetchCount();
    fetchEntries(0);
    setPage(0);
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={["top", "bottom", "left", "right"]}
    >
      <PaperProvider>
        <View
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CAvatar
              size={80}
              icon="account"
              color="white"
              style={{ backgroundColor: "#534DB3" }}
            />
            <Text style={{ padding: 20, color: "#353172" }}>{email}</Text>
          </View>
          <Text style={{ color: "#353172", padding: 40 }}>
            Your last diary entries
          </Text>
          {/* <CModal
            type={type}
            message={message}
            visible={visible}
            hideModal={hideModal}
            showModal={showModal}
            style={{ width: "100%", height: "100%" }}
          >
            <View style={{ width: "100%", alignSelf: "flex-start" }}>
              <CTextInput
                secureTextEntry={false}
                right={<></>}
                onBlur={() => {}}
                onChangeText={(str) => {
                  setTitle(str);
                }}
                label="Title"
                msg={title}
                placeholder="Please add a title"
                variant="outlined"
                textColor="#534DB3"
                outlineColor="#534DB3"
                outlineStyle={{ borderRadius: 10 }}
                activeOutlineColor="#534DB3"
                underlineColor="#534DB3"
                activeUnderlineColor="#534DB3"
                selectionColor="#534DB3"
                contentStyle={{}}
                style={{ marginHorizontal: 20 }}
                disabled={false}
                multiline={false}
              />
            </View>
            <View style={{ display: "flex", width: "100%" }}>
              <CRating
                setRating={setFeeling}
                color="#BBB0D1"
                focusColor="#534DB3"
              />
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <CTextInput
                  secureTextEntry={false}
                  right={<></>}
                  onBlur={() => {}}
                  onChangeText={(str) => {
                    setContent(str);
                  }}
                  label="Content"
                  msg={content}
                  placeholder="Please add entries"
                  variant="outlined"
                  textColor="#534DB3"
                  outlineColor="#534DB3"
                  outlineStyle={{ borderRadius: 10 }}
                  activeOutlineColor="#534DB3"
                  underlineColor="#534DB3"
                  activeUnderlineColor="#534DB3"
                  selectionColor="#534DB3"
                  contentStyle={{}}
                  style={{ marginHorizontal: 20, height: 100 }}
                  disabled={false}
                  multiline={true}
                />
              </View>
              <View style={{ alignSelf: "flex-end", marginRight: 20 }}>
                <CIconButton
                  icon="plus"
                  iconColor="white"
                  containerColor="#534DB3"
                  size={20}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          </CModal> */}
          {/* </View> */}
          {/* <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <CIconButton
              icon="chevron-left"
              iconColor="#534DB3"
              containerColor=""
              size={25}
              onPress={loadLess}
            />
            <CIconButton
              icon="chevron-right"
              iconColor="#534DB3"
              containerColor=""
              size={25}
              onPress={loadMore}
            />
          </View> */}
          {totalNbOfEntries < 2 && (
            // <CModal
            //   type={type}
            //   message={message}
            //   visible={visible}
            //   hideModal={hideModal}
            //   showModal={showModal}
            //   style={{ width: "100%", height: "100%" }}
            // >
            <View style={{ flex: 1, width: "100%" }}>
              <View style={{ width: "100%", alignSelf: "flex-start" }}>
                <CTextInput
                  secureTextEntry={false}
                  right={<></>}
                  onBlur={() => {}}
                  onChangeText={(str) => {
                    setTitle(str);
                  }}
                  label="Title"
                  msg={title}
                  placeholder="Please add a title"
                  variant="outlined"
                  textColor="#534DB3"
                  outlineColor="#534DB3"
                  outlineStyle={{ borderRadius: 10 }}
                  activeOutlineColor="#534DB3"
                  underlineColor="#534DB3"
                  activeUnderlineColor="#534DB3"
                  selectionColor="#534DB3"
                  contentStyle={{}}
                  style={{ marginHorizontal: 20 }}
                  disabled={false}
                  multiline={false}
                />
              </View>
              <View style={{ display: "flex", width: "100%" }}>
                <CRating
                  setRating={setFeeling}
                  color="#BBB0D1"
                  focusColor="#534DB3"
                />
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <CTextInput
                    secureTextEntry={false}
                    right={<></>}
                    onBlur={() => {}}
                    onChangeText={(str) => {
                      setContent(str);
                    }}
                    label="Content"
                    msg={content}
                    placeholder="Please add entries"
                    variant="outlined"
                    textColor="#534DB3"
                    outlineColor="#534DB3"
                    outlineStyle={{ borderRadius: 10 }}
                    activeOutlineColor="#534DB3"
                    underlineColor="#534DB3"
                    activeUnderlineColor="#534DB3"
                    selectionColor="#534DB3"
                    contentStyle={{}}
                    style={{ marginHorizontal: 20 }}
                    disabled={false}
                    multiline={true}
                  />
                </View>
                <View
                  style={{
                    alignSelf: "flex-end",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 20,
                  }}
                >
                  <Text style={{ color: "#353172" }}>Add a new entry</Text>
                  <CIconButton
                    icon="plus"
                    iconColor="white"
                    containerColor="#534DB3"
                    size={20}
                    onPress={handleSubmit}
                  />
                </View>
                {type === "error" && (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CIconButton
                      mode="outlined"
                      style={{ borderColor: errorColor, borderWidth: 1 }}
                      icon="close"
                      iconColor={errorColor}
                      containerColor=""
                      size={12}
                      onPress={() => {}}
                    />
                    <Text style={{ color: errorColor }}>{message}</Text>
                  </View>
                )}
                {type === "success" && (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CIconButton
                      mode="outlined"
                      style={{ borderColor: successColor, borderWidth: 1 }}
                      icon="check"
                      iconColor={successColor}
                      containerColor=""
                      size={12}
                      onPress={() => {}}
                    />
                    <Text style={{ color: successColor }}>{message}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
          <View
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            {entries &&
              entries.length > 0 &&
              entries.slice(0, 2).map((e, i) => {
                return (
                  <View
                    key={`entry_${i}`}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginHorizontal: 20,
                      marginVertical: 2.5,
                      padding: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#BBB0D1",
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "white",
                        borderRadius: 10,
                        margin: 5,
                      }}
                    >
                      <CChip
                        theme={{
                          colors: {
                            surfaceDisabled: "#BBB0D1",
                            onSurfaceDisabled: "#534DB3",
                          } as any,
                        }}
                        onPress={() => {}}
                        label=""
                        mode="outlined"
                        textStyle={{ color: "#534DB3" }}
                        style={{}}
                        buttonColor="#534DB3"
                        icon=""
                        disabled={true}
                      >
                        {formatDate(e.created_at)}
                      </CChip>
                    </View>
                    <CIconButton
                      icon={emotions[(e.feeling ?? 1) - 1]}
                      iconColor="#534DB3"
                      containerColor=""
                      size={20}
                      onPress={() => {}}
                    />
                    {/* <Text numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1, color: "#353172"  }}>{e.content}</Text> */}
                    <Text style={{ flex: 1, color: "#353172" }}>{e.title}</Text>
                    <CIconButton
                      icon="close"
                      iconColor="#534DB3"
                      containerColor=""
                      size={20}
                      onPress={() => {
                        deleteEntry(e.id);
                      }}
                    />
                  </View>
                );
              })}
          </View>
          <Text style={{ color: "#353172", padding: 40 }}>
            {(totalNbOfEntries > 0 &&
              `Your feel for ${totalNbOfEntries} entries`) ||
              `No entry found.`}
          </Text>
        </View>
      </PaperProvider>
    </SafeAreaView>
  );
};

export default Profile;

// id SERIAL PRIMARY KEY,
// user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
// date DATE NOT NULL DEFAULT CURRENT_DATE,
// title VARCHAR(255),
// feeling INTEGER CHECK (feeling BETWEEN 1 AND 5),
// content TEXT,
// created_at TIMESTAMP DEFAULT NOW(),
// updated_at TIMESTAMP DEFAULT NOW()
