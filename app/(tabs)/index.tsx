import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loadTodos, loadTimerStats } from '../../services/storage';

export default function HomeScreen() {
  const [completedTodos, setCompletedTodos] = useState(0);
  const [totalTodos, setTotalTodos] = useState(0);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [minutesToday, setMinutesToday] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const todos = await loadTodos();
    const timerStats = await loadTimerStats();
    
    if (todos) {
      setTotalTodos(todos.length);
      setCompletedTodos(todos.filter((t: any) => t.completed).length);
    }
    
    if (timerStats) {
      setSessionsToday(timerStats.todaySessions || 0);
      setMinutesToday(timerStats.todayMinutes || 0);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeHeader}>
          <View>
            <Text style={styles.welcomeText}>WELCOME,</Text>
            <Text style={styles.username}>USERNAME!</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/images/hello_img_home.png')} 
              style={styles.avatarImage}
            />
          </View>
        </View>
        <View style={styles.dailyTipBadge}>
          <MaterialCommunityIcons name="lightning-bolt" size={16} color="#000" />
          <Text style={styles.dailyTipText}>Daily Tips</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#4DD4FF' }]}>
          <MaterialCommunityIcons name="clock-outline" size={32} color="#FFF" />
          <Text style={styles.statNumber}>{minutesToday}</Text>
          <Text style={styles.statLabel}>Minutes Focus</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#2DD881' }]}>
          <MaterialCommunityIcons name="timer-outline" size={32} color="#FFF" />
          <Text style={styles.statNumber}>{sessionsToday}</Text>
          <Text style={styles.statLabel}>Pomodoro Session</Text>
        </View>
      </View>

      {/* Finished Task Card */}
      <View style={styles.finishedTaskCard}>
        <View style={styles.finishedTaskHeader}>
          <MaterialCommunityIcons name="check-circle" size={28} color="#9B59FF" />
          <Text style={styles.finishedTaskTitle}>Finished Task</Text>
        </View>
        <Text style={styles.finishedTaskNumber}>{completedTodos}</Text>
        <Text style={styles.finishedTaskSubtitle}>of {totalTodos} tasks</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8F0',
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.5,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9B59FF',
    letterSpacing: 0.5,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 140,
    height: 140,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
    marginLeft: -60,
  },
  dailyTipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  dailyTipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFF',
    textAlign: 'center',
  },
  finishedTaskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  finishedTaskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  finishedTaskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  finishedTaskNumber: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#9B59FF',
    marginVertical: 4,
  },
  finishedTaskSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});