// src/components/ClassCard.js
// Reusable card for presenting class details cleanly with high contrast
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ClassCard({ item, showDay = true, onSetAttendance, attendanceStatus = 'pending', onPress }) {
  const isLab = item.type === 'Lab';
  const isPresent = attendanceStatus === 'present';
  const isAbsent = attendanceStatus === 'absent';
  const isPending = attendanceStatus === 'pending';

  return (
    <View style={[styles.card, isLab && styles.labCard]}>
      <TouchableOpacity
        activeOpacity={onPress ? 0.7 : 1}
        onPress={() => onPress && onPress(item)}
      >
      {/* Top Row: Time & Type Badge */}
      <View style={styles.topRow}>
        <View style={styles.timeTag}>
          {showDay && <Text style={styles.dayText}>{item.day}</Text>}
          <Text style={styles.timeText}>{item.timeLabel}</Text>
        </View>
        <View style={[styles.typeBadge, isLab ? styles.labBadge : styles.theoryBadge]}>
          <Text style={[styles.typeText, isLab ? styles.labText : styles.theoryText]}>
            {item.type}
          </Text>
        </View>
      </View>

      {/* Middle Row: Course Title & Code */}
      <View style={styles.middleRow}>
        <Text style={styles.courseName}>{item.course}</Text>
        <Text style={styles.courseCode}>{item.code} • Sec: {item.section}</Text>
      </View>

      {/* Bottom Row: Instructor & Room */}
      <View style={styles.bottomRow}>
        <Text style={styles.instructorText}>
          👤 <Text style={styles.instructorBold}>{item.instructor}</Text>
        </Text>
        <View style={styles.roomBadge}>
          <Text style={styles.roomText}>📍 Room {item.room}</Text>
        </View>
      </View>

      {onPress && (
        <View style={styles.detailsPrompt}>
          <Text style={styles.detailsPromptText}>View Full Details & Screen Route →</Text>
        </View>
      )}
      </TouchableOpacity>

      {/* Interactive 3-State Attendance Marker */}
      {onSetAttendance && (
        <View style={styles.actionRow}>
          <View style={styles.statusLabelContainer}>
            <Text style={styles.actionLabel}>Status: </Text>
            {isPresent && <Text style={styles.attendedStatus}>Attended ✓</Text>}
            {isAbsent && <Text style={styles.missedStatus}>Missed ✕</Text>}
            {isPending && <Text style={styles.pendingStatus}>Scheduled (Pending)</Text>}
          </View>
          <View style={styles.btnGroup}>
            <TouchableOpacity
              style={[styles.statusBtn, isPresent ? styles.btnActivePresent : styles.btnInactive]}
              onPress={() => onSetAttendance(item.id, isPresent ? 'pending' : 'present')}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, isPresent && styles.btnTextActive]}>
                ✓ Present
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusBtn, isAbsent ? styles.btnActiveAbsent : styles.btnInactive]}
              onPress={() => onSetAttendance(item.id, isAbsent ? 'pending' : 'absent')}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, isAbsent && styles.btnTextActive]}>
                ✕ Absent
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  labCard: {
    borderColor: '#cbd5e1',
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6', // Violet accent for labs
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayText: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    fontFamily: 'monospace',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  theoryBadge: {
    backgroundColor: '#f1f5f9',
  },
  labBadge: {
    backgroundColor: '#f5f3ff',
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  theoryText: {
    color: '#475569',
  },
  labText: {
    color: '#7c3aed',
  },
  middleRow: {
    marginVertical: 4,
  },
  courseName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    lineHeight: 20,
  },
  courseCode: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  instructorText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
  },
  instructorBold: {
    fontWeight: '700',
    color: '#1e293b',
  },
  roomBadge: {
    backgroundColor: '#fef3c7', // Warm amber
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roomText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400e',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statusLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  attendedStatus: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 12,
  },
  missedStatus: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 12,
  },
  pendingStatus: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 11,
    fontStyle: 'italic',
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  btnActivePresent: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  btnActiveAbsent: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  btnInactive: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  btnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  btnTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  detailsPrompt: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'flex-end',
  },
  detailsPromptText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563eb',
  },
});
