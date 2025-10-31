import { View, TextInput, ScrollView, StyleSheet, Text, TouchableOpacity, Modal, Pressable, Image, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
}

export default function NotesScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem("@mystudymate_notes");
      if (stored) setNotes(JSON.parse(stored));
    } catch (err) {
      console.error("Error loading notes:", err);
    }
  };

  const saveNotes = async (newNotes: Note[]) => {
    try {
      await AsyncStorage.setItem("@mystudymate_notes", JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (err) {
      console.error("Error saving notes:", err);
    }
  };

  const addNote = (noteTitle: string, noteContent: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      date: new Date().toLocaleString(),
      image: selectedImage || undefined,
    };
    saveNotes([...notes, newNote]);
  };

  const updateNote = (id: string, noteTitle: string, noteContent: string) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, title: noteTitle, content: noteContent, date: new Date().toLocaleString(), image: selectedImage || n.image } : n
    );
    saveNotes(updated);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
  };

  const handleAdd = () => {
    if (title.trim() && content.trim()) {
      if (editingId) {
        updateNote(editingId, title, content);
        setEditingId(null);
      } else {
        addNote(title, content);
      }
      setTitle("");
      setContent("");
      setSelectedImage(null);
      setModalVisible(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSelectedImage(note.image || null);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setSelectedImage(null);
    setModalVisible(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const recordAudio = () => {
    Alert.alert('Audio Recording', 'Audio recording feature coming soon!');
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchText.toLowerCase()) ||
    note.content.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Notes</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons 
          name="magnify" 
          size={20} 
          color="#999999" 
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search.."
          placeholderTextColor="#CCCCCC"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Notes Grid */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.notesGrid}>
          {filteredNotes.map((note) => (
            <TouchableOpacity 
              key={note.id}
              style={styles.noteCard}
              onPress={() => router.push({
                pathname: '/screens/NoteDetailScreen',
                params: {
                  id: note.id,
                  title: note.title,
                  content: note.content,
                  image: note.image || '',
                }
              })}
            >
              <Text style={styles.noteTitle} numberOfLines={2}>
                {note.title}
              </Text>
              <Text style={styles.noteContent} numberOfLines={2}>
                {note.content}
              </Text>
              {/* Image - Only show if exists */}
              {note.image && (
                <Image source={{ uri: note.image }} style={styles.noteImage} resizeMode="cover" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/screens/NoteDetailScreen')}
      >
        <MaterialCommunityIcons name="plus" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add/Edit Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={handleCancel}
        >
          <Pressable 
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Note" : "New Note"}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Title..."
              placeholderTextColor="#C4C4C4"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
            
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Write your note here..."
              placeholderTextColor="#C4C4C4"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={styles.saveButton}
                onPress={handleAdd}
              >
                <Text style={styles.saveButtonText}>
                  {editingId ? "Update" : "Save"}
                </Text>
              </Pressable>
              {editingId && (
                <Pressable 
                  style={styles.deleteButton}
                  onPress={() => {
                    deleteNote(editingId);
                    handleCancel();
                  }}
                >
                  <MaterialCommunityIcons name="delete" size={24} color="#FFFFFF" />
                </Pressable>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0EFF5",
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: "#F0EFF5",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  notesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  noteCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  noteContent: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 12,
    lineHeight: 18,
  },
  noteImage: {
    width: "100%",
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  noteImagePlaceholder: {
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  modalInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#000000",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  modalTextArea: {
    minHeight: 150,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  noteDetailContainer: {
    flex: 1,
    backgroundColor: "#F0EFF5",
  },
  noteDetailHeader: {
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: "#F0EFF5",
  },
  noteDetailScroll: {
    flex: 1,
  },
  noteDetailScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  noteDetailTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 16,
  },
  noteDetailContent: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    minHeight: 200,
  },
  selectedImageContainer: {
    marginTop: 20,
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 40,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  toolbarButton: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
