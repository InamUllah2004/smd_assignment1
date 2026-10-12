// src/screens/AcademicPolicyScreen.js
// Drawer Screen: FAST-NUCES Attendance Policy, Debarment Rules, and Academic Regulations
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

export default function AcademicPolicyScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'FAST Attendance Policy',
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => {
            Alert.alert(
              'Academic Regulations',
              'Section 4.2 of FAST Academic Handbook:\n\nFailure to maintain 80% attendance in any theory or lab course results in an automatic "F" grade (Debarred status). No exceptions without Medical Board approval.',
              [{ text: 'Acknowledged' }]
            );
          }}
        >
          <Ionicons name="document-text-outline" size={22} color="#ffffff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Alert Header */}
      <View style={styles.alertHeader}>
        <Ionicons name="warning-outline" size={28} color="#dc2626" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.alertTitle}>Mandatory 80% Threshold</Text>
          <Text style={styles.alertSubtitle}>
            FAST-NUCES strictly enforces the 80% attendance rule per course.
          </Text>
        </View>
      </View>

      {/* Policy Card 1 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.badgeNum}>Rule 1</Text>
          <Text style={styles.cardTitle}>Minimum Attendance Threshold</Text>
        </View>
        <Text style={styles.cardBody}>
          Every student must attend at least 80% of all lectures, practical classes, and tutorials conducted in each course for which they are registered.
        </Text>
        <View style={styles.formulaBox}>
          <Text style={styles.formulaText}>
            Attendance % = (Attended Lectures / Total Held Lectures) × 100
          </Text>
        </View>
      </View>

      {/* Policy Card 2 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.badgeNum}>Rule 2</Text>
          <Text style={styles.cardTitle}>Debarment from Final Examination</Text>
        </View>
        <Text style={styles.cardBody}>
          A student with attendance below 80% in any course shall be debarred from taking the final examination and shall be awarded an automatic "F" grade in that course.
        </Text>
      </View>

      {/* Policy Card 3 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.badgeNum}>Rule 3</Text>
          <Text style={styles.cardTitle}>Makeup & Rescheduled Lectures</Text>
        </View>
        <Text style={styles.cardBody}>
          Faculty may schedule makeup lectures to compensate for missed holidays or curricular requirements. Makeup lectures carry equal attendance weight.
        </Text>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            navigation.navigate('MainTabs', {
              screen: 'ScheduleTab',
              params: { screen: 'AddSlot' },
            });
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={18} color="#ffffff" />
          <Text style={styles.actionBtnText}>Go to Add Slot Screen (Stack Navigation)</Text>
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
  headerBtn: {
    padding: 6,
    marginRight: 6,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  alertSubtitle: {
    fontSize: 12,
    color: '#b91c1c',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeNum: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cardBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  formulaBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  formulaText: {
    fontSize: 12,
    color: '#1e293b',
    fontFamily: 'monospace',
    fontWeight: '600',
    textAlign: 'center',
  },
  actionBtn: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
