import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import { useState } from "react";
import { Card, Button, IconButton } from "react-native-paper";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "exam" | "study" | "assignment";
}

export default function CalendarScreen() {
  const [events] = useState<Event[]>([
    { id: "1", title: "Ujian Matematika", date: "2025-11-05", time: "09:00", type: "exam" },
    { id: "2", title: "Belajar Fisika", date: "2025-11-01", time: "14:00", type: "study" },
    { id: "3", title: "Tugas Bahasa Inggris", date: "2025-11-03", time: "16:00", type: "assignment" },
  ]);

  const getEventColor = (type: string) => {
    switch (type) {
      case "exam": return "#F44336";
      case "study": return "#2196F3";
      case "assignment": return "#FF9800";
      default: return "#9E9E9E";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "exam": return "file-document";
      case "study": return "book-open-variant";
      case "assignment": return "clipboard-text";
      default: return "calendar";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📅 Kalender Belajar</Text>
      
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoText}>
            💡 Fitur integrasi Google Calendar akan segera ditambahkan!
          </Text>
          <Text style={styles.infoSubtext}>
            Sementara ini, Anda bisa melihat jadwal yang sudah ditambahkan.
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jadwal Mendatang</Text>
        
        {events.map((event) => (
          <Card key={event.id} style={[styles.eventCard, { borderLeftColor: getEventColor(event.type), borderLeftWidth: 4 }]}>
            <Card.Content>
              <View style={styles.eventHeader}>
                <View style={styles.eventInfo}>
                  <IconButton
                    icon={getEventIcon(event.type)}
                    size={24}
                    iconColor={getEventColor(event.type)}
                  />
                  <View>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDate}>
                      📆 {new Date(event.date).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Text>
                    <Text style={styles.eventTime}>🕐 {event.time}</Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Card style={styles.googleCard}>
        <Card.Content>
          <Text style={styles.googleTitle}>🔗 Google Calendar</Text>
          <Text style={styles.googleText}>
            Sinkronisasi otomatis dengan Google Calendar akan memudahkan Anda mengelola jadwal belajar dan ujian.
          </Text>
          <Button 
            mode="contained" 
            onPress={() => alert("Fitur akan segera tersedia!")}
            style={styles.googleButton}
            disabled
          >
            Hubungkan dengan Google
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
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
  infoCard: {
    marginBottom: 20,
    backgroundColor: "#E3F2FD",
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  infoSubtext: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  eventCard: {
    marginBottom: 12,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
  },
  googleCard: {
    marginBottom: 20,
    elevation: 2,
  },
  googleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  googleText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  googleButton: {
    marginTop: 10,
  },
});
