// src/screens/UserProfileScreen.js
// Drawer Screen: User profile & 1-tap persona switcher (Student ⇄ Faculty)
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

export default function UserProfileScreen({ navigation }) {
  const { userRole, setUserRole, togglePersona, student, teacher } = useApp();
  const isTeacher = userRole === 'teacher';
  const profile = isTeacher ? teacher : student;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Academic Profile',
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => {
            togglePersona();
            Alert.alert(
              'Persona Switched',
              `Active role changed to ${!isTeacher ? '👨‍🏫 Faculty (Dr. Farhan Ali)' : '🎓 Student (Hamza Tariq)'}`
            );
          }}
          accessibilityLabel="Switch Persona"
        >
          <Ionicons name="swap-horizontal" size={24} color="#ffffff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isTeacher, togglePersona]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Profile Header Card */}
      <View style={[styles.profileCard, isTeacher && styles.profileCardFaculty]}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>{isTeacher ? '👨‍🏫' : '🎓'}</Text>
        </View>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileRole}>
          {isTeacher ? `${profile.designation} • Faculty` : `${profile.semester} • Student`}
        </Text>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>ID: {profile.id}</Text>
        </View>
      </View>

      {/* 1-Tap Dual Persona Switcher */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Dual Persona Mode</Text>
        <Text style={styles.sectionSubtitle}>
          Toggle between Student and Faculty perspectives to test role-based navigation and timetable routing.
        </Text>

        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, !isTeacher && styles.toggleBtnActiveStudent]}
            onPress={() => setUserRole('student')}
            activeOpacity={0.7}
          >
            <Text style={styles.btnEmoji}>🎓</Text>
            <Text style={[styles.toggleBtnText, !isTeacher && styles.toggleBtnTextActive]}>
              Student Mode
            </Text>
            <Text style={styles.toggleSub}>Hamza Tariq (BCS-5B)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, isTeacher && styles.toggleBtnActiveFaculty]}
            onPress={() => setUserRole('teacher')}
            activeOpacity={0.7}
          >
            <Text style={styles.btnEmoji}>👨‍🏫</Text>
            <Text style={[styles.toggleBtnText, isTeacher && styles.toggleBtnTextActive]}>
              Faculty Mode
            </Text>
            <Text style={styles.toggleSub}>Dr. Farhan Ali (CS Dept)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Academic Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Institutional Affiliation</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Campus:</Text>
          <Text style={styles.detailValue}>FAST-NUCES Main Campus</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Department:</Text>
          <Text style={styles.detailValue}>{profile.department}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Department Code:</Text>
          <Text style={styles.detailValue}>{profile.deptCode}</Text>
        </View>

        {isTeacher ? (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Office Location:</Text>
              <Text style={styles.detailValue}>{teacher.office}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Teaching Courses:</Text>
              <Text style={styles.detailValue}>{teacher.coursesTaught?.join(', ')}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Current Section:</Text>
              <Text style={styles.detailValue}>{student.section}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Enrolled Subjects:</Text>
              <Text style={styles.detailValue}>{student.registeredCourses?.length} Courses</Text>
            </View>
          </>
        )}
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
  headerBtn: {
    padding: 6,
    marginRight: 6,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  profileCardFaculty: {
    borderTopWidth: 4,
    borderTopColor: '#059669',
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  profileRole: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  idBadge: {
    marginTop: 8,
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  idText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  toggleBtnActiveStudent: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  toggleBtnActiveFaculty: {
    borderColor: '#059669',
    backgroundColor: '#ecfdf5',
  },
  btnEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  toggleBtnTextActive: {
    color: '#0f172a',
  },
  toggleSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    maxWidth: '60%',
    textAlign: 'right',
  },
});
