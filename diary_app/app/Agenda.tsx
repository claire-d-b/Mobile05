import React from "react";
import { View, Text, Platform } from "react-native";
import { Button, IconButton } from "react-native-paper";
import {
  DatePickerModal,
  registerTranslation,
  en,
} from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CIconButton from "./CIconButton";
import CChip from "./CChip";
import CTouchableRipple from "./CTouchableRipple";

registerTranslation("en", en);
const backendUrl =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

const emotions = [
  "emoticon",
  "emoticon-happy",
  "emoticon-neutral",
  "emoticon-sad",
  "emoticon-angry",
];

interface Entry {
  id: number;
  date: string;
  title: string;
  feeling: number;
  content: string;
  created_at: string;
}

interface Props {
  login: string | null;
}

const _ = ({ login }: Props) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const [entries, setEntries] = React.useState<Entry[]>([]);

  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toISOString().split("T")[0]; // "2026-05-01"
  };

  const fetchEntriesByDate = async (selectedDate: Date) => {
    if (!login) return;

    const dateStr = selectedDate.toISOString().split("T")[0]; // "2026-05-01"

    try {
      const res = await fetch(
        `${backendUrl}/entries/${encodeURIComponent(login)}/date/${dateStr}`,
      );
      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Failed to fetch entries by date:", data.error);
        return;
      }

      console.log("✅ Entries by date:", data.length);
      console.log(data);
      setEntries(data);
    } catch (err) {
      console.error("❌ Error fetching entries by date:", err);
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
      if (date) await fetchEntriesByDate(date);
    } catch (err) {
      console.error("❌ Error deleting entry:", err);
    }
  };

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = (params: { date: Date | undefined }) => {
    setOpen(false);
    setDate(params.date);
    if (params.date) fetchEntriesByDate(params.date); // ← ici
  };

  return (
    <SafeAreaProvider>
      <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
        <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
          Pick single date
        </Button>
        <DatePickerModal
          locale="en"
          mode="single"
          visible={open}
          onDismiss={onDismissSingle}
          date={date}
          onConfirm={onConfirmSingle}
        />
        {entries &&
          entries.length > 0 &&
          entries.map((e, i) => {
            return (
              // <View key={`entry_${i}`}>

              <View
                key={`entry_agenda_${i}`}
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
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CTouchableRipple
                    onPress={() => {}}
                    rippleColor="rgba(0, 0, 0, .32)"
                  >
                    <View
                      key={`touchable_${i}`}
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
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
                        icon={emotions[(e.feeling ?? 3) - 1]}
                        iconColor="#534DB3"
                        containerColor=""
                        size={20}
                        onPress={() => {}}
                      />
                      {/* <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ flex: 1, color: "#353172" }}
                      >
                        {e.content}
                      </Text> */}
                      <Text style={{ flex: 1, color: "#353172" }}>
                        {e.title}
                      </Text>
                      <CIconButton
                        style={{ alignSelf: "flex-end" }}
                        icon="close"
                        iconColor="#534DB3"
                        containerColor=""
                        size={20}
                        onPress={() => {
                          deleteEntry(e.id);
                        }}
                      />
                    </View>
                  </CTouchableRipple>
                </View>
              </View>
            );
          })}
      </View>
    </SafeAreaProvider>
  );
};

export default _;
