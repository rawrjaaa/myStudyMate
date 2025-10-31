import { View, TextInput, ScrollView, StyleSheet, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  timestamp: string;
  deadline?: string;
}

export default function TodoScreen() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const stored = await AsyncStorage.getItem("todos");
      if (stored) setTodos(JSON.parse(stored));
    } catch (err) {
      console.error("Error loading todos:", err);
    }
  };

  const saveTodos = async (newTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (err) {
      console.error("Error saving todos:", err);
    }
  };

  const addTodo = () => {
    if (newTaskText.trim() !== "") {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: newTaskText,
        completed: false,
        timestamp: new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        deadline: taskDeadline || undefined,
      };
      saveTodos([...todos, newTodo]);
      setNewTaskText("");
      setTaskDeadline("");
      setModalVisible(false);
    }
  };

  const openTimerModal = () => {
    // Placeholder untuk set timer functionality
    alert("Timer feature coming soon!");
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTodos(updated);
  };

  const deleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    saveTodos(updated);
  };

  const filteredTodos = todos.filter(todo => 
    todo.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const activeTodos = filteredTodos.filter(t => !t.completed);
  const completedTodos = filteredTodos.filter(t => t.completed);

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
        
        <Text style={styles.title}>To-Do List</Text>
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

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* To-Do Section */}
        {activeTodos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>To-Do</Text>
            <View style={styles.card}>
              {activeTodos.map((item, index) => (
                <View key={item.id}>
                  <TouchableOpacity 
                    style={styles.todoItem}
                    onPress={() => toggleTodo(item.id)}
                  >
                    <View style={styles.checkboxGray}>
                      <MaterialCommunityIcons 
                        name="check" 
                        size={28} 
                        color="#FFFFFF" 
                      />
                    </View>
                    <View style={styles.todoTextContainer}>
                      <Text style={styles.todoText}>{item.text}</Text>
                      <Text style={styles.timestamp}>{item.timestamp}</Text>
                    </View>
                  </TouchableOpacity>
                  {index < activeTodos.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Completed Section */}
        {completedTodos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed</Text>
            <View style={styles.card}>
              {completedTodos.map((item, index) => (
                <View key={item.id}>
                  <TouchableOpacity 
                    style={styles.todoItem}
                    onPress={() => toggleTodo(item.id)}
                  >
                    <View style={styles.checkboxGreen}>
                      <MaterialCommunityIcons 
                        name="check" 
                        size={28} 
                        color="#FFFFFF" 
                      />
                    </View>
                    <View style={styles.todoTextContainer}>
                      <Text style={styles.todoText}>{item.text}</Text>
                      <Text style={styles.timestamp}>{item.timestamp}</Text>
                    </View>
                  </TouchableOpacity>
                  {index < completedTodos.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setNewTaskText("");
          setTaskDeadline("");
        }}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => {
            setModalVisible(false);
            setNewTaskText("");
            setTaskDeadline("");
          }}
        >
          <Pressable 
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>New To-Do</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Write down your task.."
              placeholderTextColor="#C4C4C4"
              value={newTaskText}
              onChangeText={setNewTaskText}
              autoFocus
              multiline
            />
            <View style={styles.modalButtons}>
              <Pressable 
                style={styles.timerButton}
                onPress={openTimerModal}
              >
                <MaterialCommunityIcons name="clock-outline" size={24} color="#9CA3AF" />
                <Text style={styles.timerButtonText}>Set Timer</Text>
              </Pressable>
              <Pressable 
                style={styles.doneButton}
                onPress={addTodo}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </Pressable>
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
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  checkboxGray: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  checkboxGreen: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#34D399",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  timestamp: {
    fontSize: 13,
    color: "#9CA3AF",
    letterSpacing: -0.1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 96,
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
    paddingBottom: 0,
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
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  modalInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: "#000000",
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  timerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 50,
    gap: 8,
  },
  timerButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  doneButton: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
});
