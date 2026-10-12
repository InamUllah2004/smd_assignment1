// src/screens/MyScheduleScreen.js
// Displays the student's personal timetable OR faculty teaching schedule based on active persona
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ClassCard from '../components/ClassCard';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';

const DAYS = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function MyScheduleScreen({ navigation }) {
  const {
    userRole,
    student,
    teacher,
    timetable,
    attendanceRecord,
    handleSetAttendance,
  } = useApp();

  const [selectedDay, setSelectedDay] = useState('All');
  const isTeacher = userRole === 'teacher';

  // Customize header title and add meaningful header buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isTeacher ? 'Faculty Schedule' : 'My Schedule (BCS-5B)',
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
          style={styles.headerAddBtn}
          onPress={() => navigation.navigate('AddSlot')}
          accessibilityLabel="Add New Slot"
        >
          <Ionicons name="add" size={18} color="#ffffff" />
          <Text style={styles.headerAddBtnText}>Add Slot</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isTeacher]);

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

      {/* Route Navigation Hint */}
      <View style={styles.routeTip}>
        <Ionicons name="information-circle" size={16} color="#2563eb" />
        <Text style={styles.routeTipText}>
          Tap any card below to navigate to <Text style={{ fontWeight: 'bold' }}>ClassDetailScreen</Text> via route parameters!
        </Text>
      </View>

      {/* Classes List */}
      {myClasses.length > 0 ? (
        myClasses.map((cls) => (
          <ClassCard
            key={cls.id}
            item={cls}
            showDay={selectedDay === 'All'}
            onSetAttendance={!isTeacher ? handleSetAttendance : null}
            attendanceStatus={attendanceRecord[cls.id] || 'pending'}
            onPress={(item) => {
              // Requirement 1: Pass data using route parameters!
              navigation.navigate('ClassDetail', { classItem: item });
            }}
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
  headerDrawerBtn: {
    padding: 6,
    marginLeft: 6,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 6,
    gap: 4,
  },
  headerAddBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  routeTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  routeTipText: {
    fontSize: 12,
    color: '#1e40af',
    flex: 1,
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
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryBannerFaculty: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#2563eb',
  },
  boldTextFaculty: {
    fontWeight: 'bold',
    color: '#059669',
  },
  countBadge: {
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  countBadgeFaculty: {
    backgroundColor: '#ecfdf5',
  },
  countNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  countNumberFaculty: {
    color: '#059669',
  },
  countLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  countLabelFaculty: {
    color: '#059669',
  },
  facultyNotice: {
    backgroundColor: '#ecfdf5',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  facultyNoticeText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '500',
    lineHeight: 18,
  },
});
