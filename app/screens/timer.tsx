import { View, Text, StyleSheet, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Audio } from 'expo-av';

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

interface TimerStats {
  totalSessions: number;
  totalMinutes: number;
  todaySessions: number;
  todayMinutes: number;
  lastSessionDate: string;
}

export default function TimerScreen() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stats, setStats] = useState<TimerStats>({
    totalSessions: 0,
    totalMinutes: 0,
    todaySessions: 0,
    todayMinutes: 0,
    lastSessionDate: new Date().toDateString(),
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    loadStats();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, seconds]);

  const loadStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem('@mystudymate_timer_stats');
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        const today = new Date().toDateString();
        if (parsed.lastSessionDate !== today) {
          parsed.todaySessions = 0;
          parsed.todayMinutes = 0;
          parsed.lastSessionDate = today;
        }
        setStats(parsed);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const saveStats = async (newStats: TimerStats) => {
    try {
      await AsyncStorage.setItem('@mystudymate_timer_stats', JSON.stringify(newStats));
    } catch (err) {
      console.error('Error saving stats:', err);
    }
  };

  const handleTimerComplete = async () => {
    setIsActive(false);
    setIsCompleted(true);
    
    const sessionMinutes = 25;
    const newStats = {
      ...stats,
      totalSessions: stats.totalSessions + 1,
      totalMinutes: stats.totalMinutes + sessionMinutes,
      todaySessions: stats.todaySessions + 1,
      todayMinutes: stats.todayMinutes + sessionMinutes,
      lastSessionDate: new Date().toDateString(),
    };
    setStats(newStats);
    saveStats(newStats);
    
    // Play alarm sound
    await playAlarm();
  };

  const playAlarm = async () => {
    try {
      // Using a simple beep sound - you can replace with your own alarm.mp3
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/button/beep-07.mp3' },
        { shouldPlay: true, isLooping: true }
      );
      soundRef.current = sound;
    } catch (error) {
      console.log('Error playing alarm:', error);
      // Fallback to vibration if audio fails
      alert('Timer Complete! 🎉');
    }
  };

  const stopAlarm = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const toggleTimer = async () => {
    if (isCompleted) {
      // Stop alarm and reset
      await stopAlarm();
      setIsCompleted(false);
      setSeconds(25 * 60);
      setIsActive(false);
    } else {
      setIsActive(!isActive);
    }
  };

  // Get timer color based on state
  const getTimerColor = () => {
    if (isCompleted) return "#EF4444"; // Red when completed (alarm ringing)
    if (isActive && seconds <= 180) return "#EF4444"; // Red when <= 3 minutes
    if (isActive) return "#34D399"; // Green when running
    return "#FFFFFF"; // White when idle
  };

  const getTimerText = () => {
    if (isCompleted) return "Tap to stop";
    if (isActive) return "";
    return "Tap to start";
  };

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
        
        <Text style={styles.title}>Pomodoro Timer</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Timer Display */}
        <Pressable 
          style={[styles.timerCard, { backgroundColor: getTimerColor() }]}
          onPress={toggleTimer}
        >
          <Text style={styles.timerDisplay}>{formatTime(seconds)}</Text>
          <Text style={styles.timerSubtext}>{getTimerText()}</Text>
        </Pressable>

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistic</Text>
          
          <View style={styles.statsGrid}>
            {/* Today's Session */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Today's{'\n'}Session</Text>
              <Text style={styles.statNumber}>{stats.todaySessions}</Text>
            </View>

            {/* Today's Minutes */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Today's{'\n'}Minutes</Text>
              <Text style={styles.statNumber}>{stats.todayMinutes}</Text>
            </View>

            {/* Total Session */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total{'\n'}Session</Text>
              <Text style={styles.statNumber}>{stats.totalSessions}</Text>
            </View>

            {/* Total Minutes */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total{'\n'}Minutes</Text>
              <Text style={styles.statNumber}>{stats.totalMinutes}</Text>
            </View>
          </View>
        </View>
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
    paddingBottom: 40,
  },
  timerCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -2,
    marginBottom: 8,
  },
  timerSubtext: {
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  statsSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  statNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -1,
  },
});
