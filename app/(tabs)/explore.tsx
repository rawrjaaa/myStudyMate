import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  screen: string;
}

const FeatureCard = ({ title, description, icon, color, screen }: FeatureCardProps) => (
  <View style={styles.card}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon as any} size={32} color="#FFFFFF" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  </View>
);

export default function ExploreScreen() {
  const features = [
    {
      title: 'To-Do List',
      description: 'Easily manage daily tasks',
      icon: 'format-list-checks',
      color: '#A78BFA',
      screen: '/screens/todo',
    },
    {
      title: 'Pomodoro Timer',
      description: 'Focus studying with 25 minutes technique',
      icon: 'timer-outline',
      color: '#FB923C',
      screen: '/screens/timer',
    },
    {
      title: 'Notes',
      description: 'Writes all your amazing ideas',
      icon: 'note-text-outline',
      color: '#34D399',
      screen: '/screens/notes',
    },
    {
      title: 'Calendar',
      description: 'All your schedules are neatly arranged',
      icon: 'calendar-month',
      color: '#60A5FA',
      screen: '/screens/CalendarScreen',
    },
    {
      title: 'Dream Lists',
      description: 'Write down and achieve long-term dreams',
      icon: 'star',
      color: '#FBBF24',
      screen: '/screens/DreamScreen',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>StudyMate</Text>
        <Text style={styles.headerSubtitle}>Features</Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Link key={index} href={feature.screen as any} asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <FeatureCard {...feature} />
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  contentContainer: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: '#F5F5F7',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  featuresContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    letterSpacing: -0.1,
  },
});
