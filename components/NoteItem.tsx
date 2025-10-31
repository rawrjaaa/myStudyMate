import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
}

export default function NoteItem({ note, onDelete }: NoteItemProps) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.content} numberOfLines={2}>{note.content}</Text>
        <Text style={styles.date}>{note.date}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(note.id)}>
        <Ionicons name="trash-outline" size={22} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { fontSize: 16, fontWeight: "600" },
  content: { color: "#555", marginTop: 4 },
  date: { fontSize: 12, color: "#888", marginTop: 6 },
});
