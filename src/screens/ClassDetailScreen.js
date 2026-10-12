// src/screens/ClassDetailScreen.js
// Demonstrates:
// 1. Receiving route parameters (route.params.classItem)
// 2. Displaying received parameters on destination screen
// 3. Custom header title & header styling
// 4. Header buttons performing meaningful actions (Toggle attendance data & Alert dialog)
import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { FACULTY_LIST } from '../data/mockData';

export default function ClassDetailScreen({ route, navigation }) {
  const { classItem } = route.params || {};
  const {
    attendanceRecord,
    handleSetAttendance,
    userRole,
  } = useApp();

  if (!classItem) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>No class parameter data received.</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStatus = attendanceRecord[classItem.id] || 'pending';
  const isPresent = currentStatus === 'present';
  const isAbsent = currentStatus === 'absent';
  const isLab = classItem.type === 'Lab';

  // Customize header title and add meaningful header action buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${classItem.code} Details`,
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          {/* Header Action 1: Toggle Attendance Data directly from Header */}
          <TouchableOpacity
            style={[
              styles.headerIconButton,
              isPresent && styles.headerIconActivePresent,
              isAbsent && styles.headerIconActiveAbsent,
            ]}
            onPress={() => {
              const nextStatus = isPresent ? 'absent' : 'present';
              handleSetAttendance(classItem.id, nextStatus);
              Alert.alert(
                'Attendance Updated',
                `Status for ${classItem.course} set to ${nextStatus.toUpperCase()} ✓`,
                [{ text: 'OK' }]
              );
            }}
            accessibilityLabel="Toggle Attendance"
          >
            <Ionicons
              name={isPresent ? 'checkmark-circle' : isAbsent ? 'close-circle' : 'checkmark-circle-outline'}
              size={22}
              color={isPresent ? '#16a34a' : isAbsent ? '#dc2626' : '#ffffff'}
            />
          </TouchableOpacity>

          {/* Header Action 2: Meaningful Alert regarding FAST venue policy */}
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => {
              Alert.alert(
                'Classroom Venue Info',
                `📍 Room: ${classItem.room}\n📅 Day: ${classItem.day}\n⏰ Time: ${classItem.timeLabel}\n\nVenue Policy: Students must enter Room ${classItem.room} within 5 minutes of lecture commencement.`,
                [
                  { text: 'Got It', style: 'default' },
                ]
              );
            }}
            accessibilityLabel="Room Info Alert"
          >
            <Ionicons name="information-circle-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, classItem, currentStatus, isPresent, isAbsent]);

  // Find faculty contact if available for direct cross-navigation
  const matchingFaculty = FACULTY_LIST.find(
    (f) => f.name.toLowerCase() === classItem.instructor.toLowerCase()
  );

  const handleMessageTeacher = () => {
    if (matchingFaculty) {
      // Navigate to Chat Stack conversation with route parameters!
      navigation.navigate('ChatTab', {
        screen: 'ChatConversation',
        params: { faculty: matchingFaculty },
      });
    } else {
      Alert.alert(
        'Faculty Contact',
        `${classItem.instructor} can be reached at CS Faculty Office during designated office hours.`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Route Parameters Banner */}
      <View style={styles.paramBanner}>
        <View style={styles.paramTag}>
          <Text style={styles.paramTagText}>RECEIVING ROUTE PARAMETERS</Text>
        </View>
        <Text style={styles.paramSubtitle}>
          Data successfully transferred from source screen via <Text style={styles.codeText}>route.params.classItem</Text>
        </Text>
      </View>

      {/* Main Course Hero Card */}
      <View style={[styles.heroCard, isLab && styles.heroCardLab]}>
        <View style={styles.heroTopRow}>
          <View style={styles.badgeRow}>
            <View style={[styles.typeBadge, isLab ? styles.typeLab : styles.typeTheory]}>
              <Text style={styles.typeText}>{classItem.type || 'Theory'}</Text>
            </View>
            <View style={styles.deptBadge}>
              <Text style={styles.deptText}>{classItem.dept || 'CS'} Department</Text>
            </View>
          </View>
          <View style={styles.codePill}>
            <Text style={styles.codePillText}>{classItem.code}</Text>
          </View>
        </View>

        <Text style={styles.courseTitle}>{classItem.course}</Text>
        <Text style={styles.sectionText}>Section: {classItem.section} • FAST-NUCES</Text>

        <View style={styles.divider} />

        {/* Schedule & Room Highlight */}
        <View style={styles.highlightRow}>
          <View style={styles.highlightItem}>
            <Ionicons name="calendar-outline" size={18} color="#2563eb" />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.highlightLabel}>Day</Text>
              <Text style={styles.highlightValue}>{classItem.day}</Text>
            </View>
          </View>

          <View style={styles.highlightItem}>
            <Ionicons name="time-outline" size={18} color="#2563eb" />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.highlightLabel}>Timing</Text>
              <Text style={styles.highlightValue}>{classItem.timeLabel}</Text>
            </View>
          </View>

          <View style={styles.highlightItem}>
            <Ionicons name="location-outline" size={18} color="#2563eb" />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.highlightLabel}>Room</Text>
              <Text style={styles.highlightValue}>{classItem.room}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Received Parameter Data Inspection Grid */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionHeader}>Received Route Parameter Details</Text>
        
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Course Identifier:</Text>
          <Text style={styles.dataValue}>{classItem.id}</Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Course Name:</Text>
          <Text style={styles.dataValue}>{classItem.course}</Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Course Code:</Text>
          <Text style={styles.dataValue}>{classItem.code}</Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Assigned Section:</Text>
          <Text style={styles.dataValue}>{classItem.section}</Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Classroom Venue:</Text>
          <Text style={styles.dataValue}>Room {classItem.room}</Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Assigned Slot:</Text>
          <Text style={styles.dataValue}>{classItem.day}, {classItem.timeLabel}</Text>
        </View>

        <View style={[styles.dataRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.dataLabel}>Lead Instructor:</Text>
          <Text style={styles.dataValue}>{classItem.instructor}</Text>
        </View>
      </View>

      {/* Interactive Attendance State Card */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionHeader}>Session Attendance State</Text>
        <Text style={styles.statusExplainer}>
          Current Status:{' '}
          <Text style={[styles.boldStatus, isPresent && styles.textPresent, isAbsent && styles.textAbsent]}>
            {isPresent ? 'Attended (Present ✓)' : isAbsent ? 'Missed (Absent ✕)' : 'Scheduled / Pending'}
          </Text>
        </Text>

        <View style={styles.attendanceButtons}>
          <TouchableOpacity
            style={[styles.attBtn, isPresent ? styles.attBtnPresentActive : styles.attBtnInactive]}
            onPress={() => handleSetAttendance(classItem.id, 'present')}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-circle" size={18} color={isPresent ? '#ffffff' : '#16a34a'} />
            <Text style={[styles.attBtnText, isPresent && styles.attBtnTextActive]}>
              Mark Present
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.attBtn, isAbsent ? styles.attBtnAbsentActive : styles.attBtnInactive]}
            onPress={() => handleSetAttendance(classItem.id, 'absent')}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={18} color={isAbsent ? '#ffffff' : '#dc2626'} />
            <Text style={[styles.attBtnText, isAbsent && styles.attBtnTextActive]}>
              Mark Absent
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.attBtn, (!isPresent && !isAbsent) ? styles.attBtnPendingActive : styles.attBtnInactive]}
            onPress={() => handleSetAttendance(classItem.id, 'pending')}
            activeOpacity={0.7}
          >
            <Ionicons name="time" size={18} color={(!isPresent && !isAbsent) ? '#ffffff' : '#64748b'} />
            <Text style={[styles.attBtnText, (!isPresent && !isAbsent) && styles.attBtnTextActive]}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Instructor Contact & Cross-Navigation Action */}
      <View style={styles.instructorCard}>
        <View style={styles.instructorInfo}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👨‍🏫</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.instructorName}>{classItem.instructor}</Text>
            <Text style={styles.instructorDept}>{classItem.dept || 'CS'} Department Faculty</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.messageBtn}
          onPress={handleMessageTeacher}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="#ffffff" />
          <Text style={styles.messageBtnText}>Message Instructor in Faculty Connect</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  backBtn: {
    marginTop: 16,
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 6,
  },
  headerIconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  headerIconActivePresent: {
    backgroundColor: '#ffffff',
  },
  headerIconActiveAbsent: {
    backgroundColor: '#ffffff',
  },
  paramBanner: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  paramTag: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  paramTagText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  paramSubtitle: {
    fontSize: 12,
    color: '#1e40af',
  },
  codeText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  heroCardLab: {
    borderLeftWidth: 5,
    borderLeftColor: '#8b5cf6',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeTheory: {
    backgroundColor: '#e0f2fe',
  },
  typeLab: {
    backgroundColor: '#f3e8ff',
  },
  typeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  deptBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deptText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  codePill: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codePillText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 6,
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 13,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  highlightLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  highlightValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sectionBox: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  dataLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  dataValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  statusExplainer: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 12,
  },
  boldStatus: {
    fontWeight: 'bold',
  },
  textPresent: {
    color: '#16a34a',
  },
  textAbsent: {
    color: '#dc2626',
  },
  attendanceButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  attBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  attBtnPresentActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  attBtnAbsentActive: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  attBtnPendingActive: {
    backgroundColor: '#64748b',
    borderColor: '#64748b',
  },
  attBtnInactive: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  attBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  attBtnTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  instructorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  instructorName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  instructorDept: {
    fontSize: 12,
    color: '#64748b',
  },
  messageBtn: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  messageBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
