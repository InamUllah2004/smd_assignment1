// src/screens/ExplorerScreen.js
// Allows students to explore timetables across all 5 university departments (CS, SE, AI, DS, CYS)
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DEPARTMENTS } from '../data/mockData';
import ClassCard from '../components/ClassCard';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';

const DAYS = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function ExplorerScreen({ navigation }) {
  const { timetable } = useApp();
  const [selectedDept, setSelectedDept] = useState('CS');
  const [selectedDay, setSelectedDay] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Customize header title & meaningful header buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Campus Explorer',
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerDrawerBtn}
          onPress={() => navigation.openDrawer && navigation.openDrawer()}
          accessibilityLabel="Open Navigation Drawer"
        >
          <Ionicons name="menu" size={24} color="#ffffff" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerResetBtn}
          onPress={() => {
            setSelectedDept('CS');
            setSelectedDay('All');
            setSearchQuery('');
            Alert.alert('Filters Reset', 'Reset filters to Computer Science (All Days).');
          }}
          accessibilityLabel="Reset Department Filters"
        >
          <Ionicons name="refresh-outline" size={20} color="#ffffff" />
          <Text style={styles.headerResetText}>Reset</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Filter timetable according to selected department, day, and search query
  const filteredClasses = timetable.filter((item) => {
    const matchesDept = item.dept === selectedDept;
    const matchesDay = selectedDay === 'All' || item.day === selectedDay;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      item.course.toLowerCase().includes(query) ||
      item.instructor.toLowerCase().includes(query) ||
      item.room.toLowerCase().includes(query) ||
      item.section.toLowerCase().includes(query) ||
      item.code.toLowerCase().includes(query);

    return matchesDept && matchesDay && matchesSearch;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* 5 Departments Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionHeading}>1. Select Department</Text>
        <View style={styles.deptGrid}>
          {DEPARTMENTS.map((dept) => (
            <TouchableOpacity
              key={dept.code}
              style={[styles.deptPill, selectedDept === dept.code && styles.deptPillActive]}
              onPress={() => setSelectedDept(dept.code)}
              activeOpacity={0.7}
            >
              <Text style={[styles.deptPillText, selectedDept === dept.code && styles.deptPillTextActive]}>
                {dept.code}
              </Text>
              <Text style={[styles.deptSubText, selectedDept === dept.code && styles.deptSubTextActive]} numberOfLines={1}>
                {dept.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Day Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionHeading}>2. Filter by Day</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayPills}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayPill, selectedDay === day && styles.dayPillActive]}
              onPress={() => setSelectedDay(day)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayPillText, selectedDay === day && styles.dayPillTextActive]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionHeading}>3. Real-time Search</Text>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by subject, teacher, room, or code..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          Department {selectedDept} Classes ({filteredClasses.length})
        </Text>
        <Text style={styles.resultsSubtitle}>
          Tap any card to view detailed parameters
        </Text>
      </View>

      {/* List of Filtered Classes */}
      {filteredClasses.length > 0 ? (
        filteredClasses.map((cls) => (
          <ClassCard
            key={cls.id}
            item={cls}
            showDay={selectedDay === 'All'}
            onPress={(item) => {
              // Pass route parameters to ClassDetailScreen!
              navigation.navigate('ClassDetail', { classItem: item });
            }}
          />
        ))
      ) : (
        <EmptyState
          title="No Classes Found"
          message={`No classes found in Department ${selectedDept} matching your criteria.`}
        />
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerDrawerBtn: {
    padding: 6,
    marginLeft: 6,
  },
  headerResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    gap: 4,
  },
  headerResetText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterSection: {
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  deptGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  deptPill: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  deptPillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  deptPillText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  deptPillTextActive: {
    color: '#ffffff',
  },
  deptSubText: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  deptSubTextActive: {
    color: '#bfdbfe',
  },
  dayPills: {
    flexDirection: 'row',
    gap: 8,
  },
  dayPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dayPillActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  dayPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  dayPillTextActive: {
    color: '#ffffff',
  },
  searchSection: {
    marginBottom: 14,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  clearBtn: {
    fontSize: 14,
    color: '#94a3b8',
    paddingHorizontal: 6,
  },
  resultsHeader: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  resultsSubtitle: {
    fontSize: 11,
    color: '#64748b',
  },
});
