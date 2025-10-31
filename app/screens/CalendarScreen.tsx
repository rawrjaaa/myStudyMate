import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  color: string;
}

export default function CalendarScreen() {
  const router = useRouter();
  const [events] = useState<Event[]>([
    { 
      id: "1", 
      title: "Ujian Matematika", 
      date: "Rabu, 1 September 2025", 
      time: "09.00 AM",
      color: "#EF4444"
    },
    { 
      id: "2", 
      title: "Ujian Matematika", 
      date: "Rabu, 1 September 2025", 
      time: "09.00 AM",
      color: "#3B82F6"
    },
    { 
      id: "3", 
      title: "Ujian Matematika", 
      date: "Rabu, 1 September 2025", 
      time: "09.00 AM",
      color: "#10B981"
    },
    { 
      id: "4", 
      title: "Ujian Matematika", 
      date: "Rabu, 1 September 2025", 
      time: "09.00 AM",
      color: "#8B5CF6"
    },
  ]);

  const syncToGoogleCalendar = () => {
    alert("Google Calendar sync feature coming soon!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Study</Text>
        <Text style={styles.title}>Calendar</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={[styles.colorBar, { backgroundColor: event.color }]} />
            
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: event.color }]}>
                <MaterialCommunityIcons name="file-document" size={28} color="#FFFFFF" />
              </View>
              
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventDetail}>
                  <MaterialCommunityIcons name="calendar" size={14} color="#666666" />
                  <Text style={styles.eventDate}>{event.date}</Text>
                </View>
                <View style={styles.eventDetail}>
                  <MaterialCommunityIcons name="clock-outline" size={14} color="#666666" />
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.syncButton}
          onPress={syncToGoogleCalendar}
        >
          <MaterialCommunityIcons name="google" size={24} color="#4285F4" />
          <Text style={styles.syncButtonText}>Sync to Google Calendar</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  colorBar: {
    width: 8,
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 6,
  },
  eventTime: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 6,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    gap: 12,
  },
  syncButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
});
