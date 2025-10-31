import { View, Text, StyleSheet, FlatList, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Card, Button, IconButton, FAB } from "react-native-paper";
import { loadDreams, saveDreams } from "../../services/storage";

interface Dream {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  completed: boolean;
}

export default function DreamScreen() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("🎓 Akademik");

  useEffect(() => {
    loadDreamsData();
  }, []);

  const loadDreamsData = async () => {
    const data = await loadDreams();
    if (data) setDreams(data);
  };

  const addDream = () => {
    if (newTitle.trim() && newDescription.trim()) {
      const dream: Dream = {
        id: Date.now().toString(),
        title: newTitle,
        description: newDescription,
        category: newCategory,
        date: new Date().toLocaleDateString("id-ID"),
        completed: false,
      };
      const updatedDreams = [...dreams, dream];
      setDreams(updatedDreams);
      saveDreams(updatedDreams);
      
      setNewTitle("");
      setNewDescription("");
      setIsAdding(false);
    }
  };

  const toggleComplete = (id: string) => {
    const updatedDreams = dreams.map(dream =>
      dream.id === id ? { ...dream, completed: !dream.completed } : dream
    );
    setDreams(updatedDreams);
    saveDreams(updatedDreams);
  };

  const deleteDream = (id: string) => {
    Alert.alert(
      "Hapus Impian",
      "Yakin ingin menghapus impian ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          onPress: () => {
            const updatedDreams = dreams.filter(dream => dream.id !== id);
            setDreams(updatedDreams);
            saveDreams(updatedDreams);
          },
          style: "destructive",
        },
      ]
    );
  };

  const categories = ["🎓 Akademik", "💼 Karir", "🌟 Pribadi", "🌍 Perjalanan", "💰 Finansial"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌠 Daftar Impian</Text>
      
      <Card style={styles.motivationCard}>
        <Card.Content>
          <Text style={styles.motivationText}>
            "Impian adalah kunci untuk masa depan yang lebih baik. Tulislah dan wujudkan!"
          </Text>
        </Card.Content>
      </Card>

      {isAdding && (
        <Card style={styles.addCard}>
          <Card.Content>
            <Text style={styles.addTitle}>Tambah Impian Baru</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Judul impian..."
              value={newTitle}
              onChangeText={setNewTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Deskripsi impian..."
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  mode={newCategory === cat ? "contained" : "outlined"}
                  onPress={() => setNewCategory(cat)}
                  style={styles.categoryButton}
                  compact
                >
                  {cat}
                </Button>
              ))}
            </View>
            
            <View style={styles.buttonRow}>
              <Button mode="contained" onPress={addDream} style={styles.button}>
                Simpan
              </Button>
              <Button mode="outlined" onPress={() => setIsAdding(false)} style={styles.button}>
                Batal
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      <FlatList
        data={dreams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card 
            style={[
              styles.dreamCard, 
              item.completed && styles.dreamCardCompleted
            ]}
          >
            <Card.Content>
              <View style={styles.dreamHeader}>
                <View style={styles.dreamInfo}>
                  <Text style={[styles.dreamTitle, item.completed && styles.dreamTitleCompleted]}>
                    {item.title}
                  </Text>
                  <Text style={styles.dreamCategory}>{item.category}</Text>
                </View>
                <View style={styles.dreamActions}>
                  <IconButton
                    icon={item.completed ? "check-circle" : "check-circle-outline"}
                    size={24}
                    iconColor={item.completed ? "#4CAF50" : "#999"}
                    onPress={() => toggleComplete(item.id)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    iconColor="#F44336"
                    onPress={() => deleteDream(item.id)}
                  />
                </View>
              </View>
              <Text style={[styles.dreamDescription, item.completed && styles.dreamDescriptionCompleted]}>
                {item.description}
              </Text>
              <Text style={styles.dreamDate}>Ditambahkan: {item.date}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada impian yang ditambahkan</Text>
            <Text style={styles.emptySubtext}>Tekan tombol + untuk menambah impian baru</Text>
          </View>
        }
        contentContainerStyle={dreams.length === 0 ? styles.emptyList : undefined}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setIsAdding(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  motivationCard: {
    marginBottom: 15,
    backgroundColor: "#E8F5E9",
    elevation: 2,
  },
  motivationText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    color: "#2E7D32",
  },
  addCard: {
    marginBottom: 15,
    elevation: 4,
  },
  addTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  categoryButton: {
    minWidth: 80,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
  },
  dreamCard: {
    marginBottom: 12,
    elevation: 2,
  },
  dreamCardCompleted: {
    opacity: 0.7,
    backgroundColor: "#F0F0F0",
  },
  dreamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  dreamInfo: {
    flex: 1,
  },
  dreamTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  dreamTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  dreamCategory: {
    fontSize: 14,
    color: "#666",
  },
  dreamActions: {
    flexDirection: "row",
  },
  dreamDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  dreamDescriptionCompleted: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  dreamDate: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#999",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#BBB",
  },
  emptyList: {
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#2196F3",
  },
});
