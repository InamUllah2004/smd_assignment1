// src/components/Header.js
// Header component showing logged-in user info, dual persona toggle (Student/Faculty), and view switcher
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Header({
  userRole,
  onToggleRole,
  student,
  teacher,
  activeTab,
  onTabChange,
}) {
  const isTeacher = userRole === 'teacher';
  const currentUser = isTeacher ? teacher : student;

  return (
    <View style={styles.headerContainer}>
      {/* Persona Switcher Pill (1-Tap Toggle between Student and Faculty) */}
      <View style={styles.roleSwitcherRow}>
        <Text style={styles.portalTag}>FAST-NUCES PORTAL • FALL 2026</Text>
        <View style={styles.roleToggleGroup}>
          <TouchableOpacity
            style={[styles.roleBtn, !isTeacher && styles.roleBtnActive]}
            onPress={() => onToggleRole('student')}
            activeOpacity={0.7}
          >
            <Text style={[styles.roleBtnText, !isTeacher && styles.roleBtnTextActive]}>
              🎓 Student
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, isTeacher && styles.roleBtnActiveFaculty]}
            onPress={() => onToggleRole('teacher')}
            activeOpacity={0.7}
          >
            <Text style={[styles.roleBtnText, isTeacher && styles.roleBtnTextActiveFaculty]}>
              👨‍🏫 Faculty
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Details Banner */}
      <View style={styles.studentBanner}>
        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>{currentUser.name}</Text>
          <Text style={styles.studentMeta}>
            {isTeacher
              ? `${teacher.designation} • Dept: ${teacher.department}`
              : `Roll No: ${student.id} • Sec: ${student.section}`}
          </Text>
        </View>
        <View style={[styles.deptBadge, isTeacher && styles.deptBadgeFaculty]}>
          <Text style={[styles.deptBadgeText, isTeacher && styles.deptBadgeTextFaculty]}>
            {isTeacher ? 'FACULTY' : student.deptCode}
          </Text>
          <Text style={styles.deptBadgeSub}>
            {isTeacher ? 'PORTAL' : 'DEPT'}
          </Text>
        </View>
      </View>

      {/* State-Based Top View Switcher (NO React Navigation, pure useState) */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'mySchedule' && styles.tabButtonActive]}
          onPress={() => onTabChange('mySchedule')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'mySchedule' && styles.tabTextActive]}>
            {isTeacher ? 'My Lectures' : 'My Classes'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'explorer' && styles.tabButtonActive]}
          onPress={() => onTabChange('explorer')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'explorer' && styles.tabTextActive]}>
            All Depts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'chat' && styles.tabButtonActive]}
          onPress={() => onTabChange('chat')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>
            💬 Chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'analytics' && styles.tabButtonActive]}
          onPress={() => onTabChange('analytics')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.tabTextActive]}>
            Analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'addSlot' && styles.tabButtonActive]}
          onPress={() => onTabChange('addSlot')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'addSlot' && styles.tabTextActive]}>
            + Slot
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#0f172a', // Deep slate navy
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  roleSwitcherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  portalTag: {
    fontSize: 9,
    fontWeight: '700',
    color: '#38bdf8',
    letterSpacing: 0.8,
  },
  roleToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#334155',
  },
  roleBtn: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  roleBtnActive: {
    backgroundColor: '#2563eb',
  },
  roleBtnActiveFaculty: {
    backgroundColor: '#d97706', // Warm amber for Faculty
  },
  roleBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },
  roleBtnTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  roleBtnTextActiveFaculty: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  studentBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  studentMeta: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  deptBadge: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#38bdf8',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  deptBadgeFaculty: {
    borderColor: '#f59e0b',
  },
  deptBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  deptBadgeTextFaculty: {
    color: '#fbbf24',
  },
  deptBadgeSub: {
    fontSize: 7,
    color: '#94a3b8',
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#2563eb', // Rich Blue
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
