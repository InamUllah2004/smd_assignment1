// src/components/CustomDrawerContent.js
// Custom drawer header with active user profile, dual persona switch, and system info
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function CustomDrawerContent(props) {
  const { userRole, togglePersona, student, teacher } = useApp();
  const isTeacher = userRole === 'teacher';
  const profile = isTeacher ? teacher : student;

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        
        {/* User Card in Drawer Header */}
        <View style={[styles.headerBox, isTeacher && styles.headerBoxFaculty]}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>{isTeacher ? '👨‍🏫' : '🎓'}</Text>
            </View>
            <View style={styles.personaBadge}>
              <Text style={styles.personaBadgeText}>
                {isTeacher ? 'FACULTY' : 'STUDENT'}
              </Text>
            </View>
          </View>

          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userSubtitle}>
            {isTeacher ? `${profile.designation}` : `Section: ${student.section} • 5th Sem`}
          </Text>
          <Text style={styles.campusText}>FAST-NUCES • {profile.department}</Text>

          {/* Quick Dual Persona Switcher */}
          <TouchableOpacity
            style={styles.switchRoleBtn}
            onPress={() => {
              togglePersona();
              Alert.alert(
                'Switched Persona',
                `Now viewing app as ${!isTeacher ? '👨‍🏫 Dr. Farhan Ali (Faculty)' : '🎓 Hamza Tariq (Student)'}`
              );
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-horizontal" size={16} color="#ffffff" />
            <Text style={styles.switchRoleText}>
              Switch to {isTeacher ? 'Student Mode' : 'Faculty Mode'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Drawer Navigation Links */}
        <View style={styles.drawerItemsContainer}>
          <Text style={styles.sectionLabel}>NAVIGATION DIRECTORY</Text>
          <DrawerItemList {...props} />
        </View>

      </DrawerContentScrollView>

      {/* Drawer Bottom Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Ionicons name="hardware-chip-outline" size={14} color="#64748b" />
          <Text style={styles.footerText}>SMD Assignment 2 • React Navigation</Text>
        </View>
        <Text style={styles.versionText}>Stack + Drawer + Bottom Tabs Architecture</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingTop: 0,
  },
  headerBox: {
    backgroundColor: '#0f172a',
    padding: 20,
    paddingTop: 48,
    borderBottomRightRadius: 24,
    marginBottom: 10,
  },
  headerBoxFaculty: {
    backgroundColor: '#064e3b',
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 26,
  },
  personaBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  personaBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  userName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userSubtitle: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 2,
  },
  campusText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 14,
    gap: 6,
  },
  switchRoleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  drawerItemsContainer: {
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
  },
  versionText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
});
