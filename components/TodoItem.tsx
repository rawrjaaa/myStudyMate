import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => onToggle(todo.id)}>
        <Ionicons
          name={todo.completed ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={todo.completed ? "#007AFF" : "gray"}
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.text,
          { textDecorationLine: todo.completed ? "line-through" : "none" },
        ]}
      >
        {todo.text}
      </Text>

      <TouchableOpacity onPress={() => onDelete(todo.id)}>
        <Ionicons name="trash-outline" size={22} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
  },
});
