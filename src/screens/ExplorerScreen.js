// src/screens/ExplorerScreen.js
// Allows students to explore timetables across all 5 university departments (CS, SE, AI, DS, CYS)
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { DEPARTMENTS } from '../data/mockData';
import ClassCard from '../components/ClassCard';
import EmptyState from '../components/EmptyState';

const DAYS = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function ExplorerScreen({ timetable }) {
  const [selectedDept, setSelectedDept] = useState('CS');
  const [selectedDay, setSelectedDay] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
      <View style={styles.filterSection}>
        <Text style={styles.sectionHeading}>3. Search Classes, Rooms or Teachers</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by instructor, course, or room (e.g. Lab 2)..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          Showing {filteredClasses.length} {filteredClasses.length === 1 ? 'Class' : 'Classes'}
        </Text>
        <Text style={styles.deptIndicator}>
          Dept: <Text style={styles.deptHighlight}>{selectedDept}</Text>
        </Text>
      </View>

      {/* List of Filtered Classes */}
      {filteredClasses.length > 0 ? (
        filteredClasses.map((cls) => (
          <ClassCard
            key={cls.id}
            item={cls}
            showDay={selectedDay === 'All'}
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  deptPillActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  deptPillText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  deptPillTextActive: {
    color: '#38bdf8',
  },
  deptSubText: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 1,
  },
  deptSubTextActive: {
    color: '#94a3b8',
  },
  dayPills: {
    flexDirection: 'row',
    gap: 6,
  },
  dayPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  dayPillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  dayPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  dayPillTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 13,
    color: '#0f172a',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 2,
  },
  resultsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  deptIndicator: {
    fontSize: 12,
    color: '#64748b',
  },
  deptHighlight: {
    fontWeight: 'bold',
    color: '#2563eb',
  },
});
