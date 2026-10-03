// src/screens/MyScheduleScreen.js
// Displays the student's personal timetable OR faculty teaching schedule based on active persona
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ClassCard from '../components/ClassCard';
import EmptyState from '../components/EmptyState';

const DAYS = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function MyScheduleScreen({
  userRole = 'student',
  student,
  teacher,
  timetable,
  attendanceRecord,
  onSetAttendance,
}) {
  const [selectedDay, setSelectedDay] = useState('All');
  const isTeacher = userRole === 'teacher';

  // Filter classes:
  // If Teacher -> classes taught by Dr. Farhan Ali
  // If Student -> classes registered for Section BCS-5B
  const myClasses = timetable.filter((item) => {
    const isTarget = isTeacher
      ? item.instructor === teacher.name
      : item.section === student.section;
    const matchesDay = selectedDay === 'All' || item.day === selectedDay;
    return isTarget && matchesDay;
  });

  const totalClasses = myClasses.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* Day Selector Buttons */}
      <View style={styles.daySelectorContainer}>
        <Text style={styles.sectionHeading}>Filter by Day</Text>
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

      {/* Overview Banner for Selected Day */}
      <View style={[styles.summaryBanner, isTeacher && styles.summaryBannerFaculty]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>
            {isTeacher ? "Teaching Schedule" : (selectedDay === 'All' ? 'Full Week Schedule' : `${selectedDay}'s Classes`)}
          </Text>
          <Text style={styles.bannerSubtitle}>
            {isTeacher ? (
              <>Instructor: <Text style={styles.boldTextFaculty}>{teacher.name}</Text></>
            ) : (
              <>Registered Section: <Text style={styles.boldText}>{student.section}</Text></>
            )}
          </Text>
        </View>
        <View style={[styles.countBadge, isTeacher && styles.countBadgeFaculty]}>
          <Text style={[styles.countNumber, isTeacher && styles.countNumberFaculty]}>{totalClasses}</Text>
          <Text style={[styles.countLabel, isTeacher && styles.countLabelFaculty]}>
            {isTeacher ? 'Lectures' : 'Sessions'}
          </Text>
        </View>
      </View>

      {/* Notice for Faculty */}
      {isTeacher && (
        <View style={styles.facultyNotice}>
          <Text style={styles.facultyNoticeText}>
            👨‍🏫 Displaying all lectures & labs assigned to you across multiple sections (BCS-5A, BCS-5B).
          </Text>
        </View>
      )}

      {/* Classes List */}
      {myClasses.length > 0 ? (
        myClasses.map((cls) => (
          <ClassCard
            key={cls.id}
            item={cls}
            showDay={selectedDay === 'All'}
            onSetAttendance={!isTeacher ? onSetAttendance : null}
            attendanceStatus={attendanceRecord[cls.id] || 'pending'}
          />
        ))
      ) : (
        <EmptyState
          title={`No classes on ${selectedDay}`}
          message={
            isTeacher
              ? `You have no lectures or lab sessions scheduled to teach on ${selectedDay}.`
              : `You have no registered lectures or lab sessions scheduled for this day.`
          }
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
  daySelectorContainer: {
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  dayPills: {
    flexDirection: 'row',
    gap: 8,
  },
  dayPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
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
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  dayPillTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  summaryBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryBannerFaculty: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#2563eb',
  },
  boldTextFaculty: {
    fontWeight: 'bold',
    color: '#d97706',
  },
  countBadge: {
    backgroundColor: '#eff6ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  countBadgeFaculty: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  countNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  countNumberFaculty: {
    color: '#b45309',
  },
  countLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#3b82f6',
    textTransform: 'uppercase',
  },
  countLabelFaculty: {
    color: '#d97706',
  },
  facultyNotice: {
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  facultyNoticeText: {
    fontSize: 11,
    color: '#92400e',
    fontWeight: '500',
  },
});
