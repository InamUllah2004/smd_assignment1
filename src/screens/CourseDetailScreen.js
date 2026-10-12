// src/screens/CourseDetailScreen.js
// Demonstrates:
// 1. Receiving route parameter (route.params.course)
// 2. Displaying received parameters on destination screen
// 3. Dynamic header title & styling
// 4. Header buttons performing meaningful actions (Attendance Simulation & Debar Policy Alert)
import React, { useState, useLayoutEffect } from 'react';
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

export default function CourseDetailScreen({ route, navigation }) {
  const { course } = route.params || {};
  const { student, setStudent } = useApp();

  const [simAttended, setSimAttended] = useState(course?.attendedLectures || 0);
  const [simHeld, setSimHeld] = useState(course?.heldLectures || 0);

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>No course data received.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const simPercentage = simHeld > 0 ? Math.round((simAttended / simHeld) * 100) : 0;
  const isDebarRisk = simPercentage < 80;

  // Header options & buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${course.code} Analytics`,
      headerRight: () => (
        <View style={styles.headerRightRow}>
          {/* Action: Debar Policy Alert Dialog */}
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => {
              Alert.alert(
                'FAST Attendance Threshold',
                `Official Rule: Attendance < 80% results in being debarred from the final exam.\n\nCurrent: ${simPercentage}% (${simAttended}/${simHeld} lectures).\nStatus: ${simPercentage >= 80 ? 'Safe ✓' : 'Debar Risk ⚠️'}`,
                [{ text: 'Understood' }]
              );
            }}
            accessibilityLabel="Debar Advisory"
          >
            <Ionicons name="shield-checkmark-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, course, simPercentage, simAttended, simHeld]);

  // Simulate attending next lecture
  const handleAttendNext = () => {
    setSimAttended((prev) => prev + 1);
    setSimHeld((prev) => prev + 1);
  };

  // Simulate missing next lecture
  const handleMissNext = () => {
    setSimHeld((prev) => prev + 1);
  };

  // Reset simulation
  const handleResetSim = () => {
    setSimAttended(course.attendedLectures);
    setSimHeld(course.heldLectures);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      
      {/* Route Parameter Badge */}
      <View style={styles.paramBanner}>
        <View style={styles.paramTag}>
          <Text style={styles.paramTagText}>RECEIVING ROUTE PARAMETER</Text>
        </View>
        <Text style={styles.paramSubtitle}>
          Loaded course metrics for <Text style={styles.bold}>{course.code}</Text> ({course.name})
        </Text>
      </View>

      {/* Main Course Hero */}
      <View style={[styles.heroCard, isDebarRisk && styles.heroCardDanger]}>
        <View style={styles.heroHeader}>
          <View>
            <Text style={styles.courseCode}>{course.code}</Text>
            <Text style={styles.courseTitle}>{course.name}</Text>
          </View>
          <View style={[styles.percentageCircle, isDebarRisk ? styles.circleDanger : styles.circleSafe]}>
            <Text style={[styles.percentageText, isDebarRisk ? styles.textDanger : styles.textSafe]}>
              {simPercentage}%
            </Text>
          </View>
        </View>

        <View style={styles.statusBadgeRow}>
          <View style={[styles.statusBadge, isDebarRisk ? styles.statusBadgeDanger : styles.statusBadgeSafe]}>
            <Text style={[styles.statusBadgeText, isDebarRisk ? styles.statusTextDanger : styles.statusTextSafe]}>
              {isDebarRisk ? '⚠️ DEBAR RISK (BELOW 80%)' : '✓ HEALTHY ATTENDANCE'}
            </Text>
          </View>
          <Text style={styles.creditText}>{course.creditHours || 3} Credit Hours</Text>
        </View>
      </View>

      {/* Received Route Parameters Display Grid */}
      <View style={styles.cardBox}>
        <Text style={styles.cardTitle}>Received Parameter Values</Text>

        <View style={styles.paramRow}>
          <Text style={styles.label}>Course Code:</Text>
          <Text style={styles.value}>{course.code}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.label}>Course Full Name:</Text>
          <Text style={styles.value}>{course.name}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.label}>Credit Hours:</Text>
          <Text style={styles.value}>{course.creditHours} Cr</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.label}>Held Lectures:</Text>
          <Text style={styles.value}>{simHeld} Lectures</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.label}>Attended Lectures:</Text>
          <Text style={styles.value}>{simAttended} Lectures</Text>
        </View>

        <View style={[styles.paramRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>FAST Minimum Threshold:</Text>
          <Text style={styles.value}>{course.threshold || 80}%</Text>
        </View>
      </View>

      {/* Interactive What-If Simulator (Updating State Directly) */}
      <View style={styles.cardBox}>
        <Text style={styles.cardTitle}>Interactive "What-If" Simulator</Text>
        <Text style={styles.simDescription}>
          Simulate future lectures to see if you will maintain or recover your 80% attendance standing:
        </Text>

        <View style={styles.simButtonsRow}>
          <TouchableOpacity style={styles.simBtnGreen} onPress={handleAttendNext} activeOpacity={0.7}>
            <Ionicons name="add-circle" size={18} color="#ffffff" />
            <Text style={styles.simBtnText}>Attend +1 Lecture</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.simBtnRed} onPress={handleMissNext} activeOpacity={0.7}>
            <Ionicons name="remove-circle" size={18} color="#ffffff" />
            <Text style={styles.simBtnText}>Miss +1 Lecture</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetBtn} onPress={handleResetSim}>
          <Text style={styles.resetBtnText}>↺ Reset to Actual Record</Text>
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
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ef4444',
  },
  backBtn: {
    marginTop: 16,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerRightRow: {
    marginRight: 6,
  },
  headerBtn: {
    padding: 6,
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
    backgroundColor: '#2563eb',
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
  },
  paramSubtitle: {
    fontSize: 12,
    color: '#1e40af',
  },
  bold: {
    fontWeight: 'bold',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  heroCardDanger: {
    borderColor: '#fca5a5',
    backgroundColor: '#fff5f5',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseCode: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 2,
    maxWidth: 220,
  },
  percentageCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleSafe: {
    backgroundColor: '#dcfce7',
  },
  circleDanger: {
    backgroundColor: '#fee2e2',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textSafe: {
    color: '#15803d',
  },
  textDanger: {
    color: '#b91c1c',
  },
  statusBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeSafe: {
    backgroundColor: '#dcfce7',
  },
  statusBadgeDanger: {
    backgroundColor: '#fee2e2',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusTextSafe: {
    color: '#166534',
  },
  statusTextDanger: {
    color: '#991b1b',
  },
  creditText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  cardBox: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  label: {
    fontSize: 13,
    color: '#64748b',
  },
  value: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  simDescription: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 14,
    lineHeight: 18,
  },
  simButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  simBtnGreen: {
    flex: 1,
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  simBtnRed: {
    flex: 1,
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  simBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resetBtn: {
    alignSelf: 'center',
    paddingVertical: 6,
  },
  resetBtnText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
});
