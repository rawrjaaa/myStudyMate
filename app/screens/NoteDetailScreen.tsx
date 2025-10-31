import { View, TextInput, ScrollView, StyleSheet, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
}

export default function NoteDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const noteId = params.id as string || Date.now().toString();
  const [title, setTitle] = useState(params.title as string || "");
  const [content, setContent] = useState(params.content as string || "");
  const [selectedImage, setSelectedImage] = useState<string | null>(params.image as string || null);

  const saveNote = async () => {
    // Only save if there's title or content
    if (!title.trim() && !content.trim()) {
      return;
    }

    try {
      const stored = await AsyncStorage.getItem("@mystudymate_notes");
      let notes: Note[] = stored ? JSON.parse(stored) : [];
      
      const noteData: Note = {
        id: noteId,
        title: title.trim() || "Untitled",
        content: content.trim(),
        date: new Date().toLocaleString(),
        image: selectedImage || undefined,
      };

      // Check if note exists (edit mode)
      const existingIndex = notes.findIndex(n => n.id === noteId);
      if (existingIndex !== -1) {
        // Update existing note
        notes[existingIndex] = noteData;
      } else {
        // Add new note
        notes.push(noteData);
      }

      await AsyncStorage.setItem("@mystudymate_notes", JSON.stringify(notes));
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleBack = async () => {
    await saveNote();
    router.back();
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

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Input */}
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor="#999999"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Content Input */}
        <TextInput
          style={styles.contentInput}
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
          placeholderTextColor="#999999"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        {/* Selected Image */}
        {selectedImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} resizeMode="cover" />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={removeImage}
            >
              <MaterialCommunityIcons name="close" size={20} color="#000000" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity 
          style={styles.toolbarButton}
          onPress={() => {/* Edit text functionality */}}
        >
          <MaterialCommunityIcons name="format-text" size={28} color="#000000" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.toolbarButton}
          onPress={takePhoto}
        >
          <MaterialCommunityIcons name="camera" size={28} color="#000000" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.toolbarButton}
          onPress={pickImage}
        >
          <MaterialCommunityIcons name="image" size={28} color="#000000" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.toolbarButton}
          onPress={recordAudio}
        >
          <MaterialCommunityIcons name="microphone" size={28} color="#000000" />
        </TouchableOpacity>
      </View>
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
    paddingBottom: 16,
    backgroundColor: "#F0EFF5",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 16,
    letterSpacing: -0.5,
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    minHeight: 200,
    paddingVertical: 8,
  },
  imageContainer: {
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
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
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
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
