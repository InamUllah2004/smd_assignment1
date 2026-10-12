// src/screens/AddSlotScreen.js
// Interactive form with validation and room/time clash detection
// Fulfills Core Requirement G: Form/Input with validation and meaningful feedback
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DEPARTMENTS } from '../data/mockData';
import { useApp } from '../context/AppContext';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TYPES = ['Theory', 'Lab'];
const TIME_PRESETS = [
  '08:30 - 09:50 AM',
  '10:00 - 11:20 AM',
  '11:30 - 12:50 PM',
  '01:30 - 04:20 PM',
];

// Helper: Convert time string (e.g. "10:00 AM", "01:30 PM") into minutes from midnight
function parseTimeToMinutes(str) {
  if (!str) return null;
  const match = str.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3].toUpperCase();

  if (hours < 1 || hours > 12 || minutes < 0 || minutes >= 60) return null;

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

// Helper: Parse time slot interval (e.g. "10:00 - 11:20 AM")
function parseSlotInterval(slotStr) {
  if (!slotStr || !slotStr.includes('-')) return null;
  const parts = slotStr.split('-');
  if (parts.length !== 2) return null;

  const startPart = parts[0].trim();
  const endPart = parts[1].trim();

  // End part MUST strictly specify AM or PM
  const endModifierMatch = endPart.match(/(AM|PM)$/i);
  if (!endModifierMatch) return null; // Reject if missing AM/PM

  const endModifier = endModifierMatch[1].toUpperCase();

  let startFull = startPart;
  if (!startPart.match(/(AM|PM)$/i)) {
    const startHourMatch = startPart.match(/^(\d{1,2}):\d{2}$/);
    if (!startHourMatch) return null;
    const startHour = parseInt(startHourMatch[1], 10);
    // If end is PM and start hour is 8-11, start was AM (e.g. 11:30 - 02:20 PM)
    const inferred = (endModifier === 'PM' && startHour >= 8 && startHour <= 11) ? 'AM' : endModifier;
    startFull = `${startPart} ${inferred}`;
  }

  const startMin = parseTimeToMinutes(startFull);
  const endMin = parseTimeToMinutes(endPart);

  if (startMin === null || endMin === null) return null;
  if (endMin <= startMin) return null; // End time must strictly follow start time

  return { startMin, endMin };
}

export default function AddSlotScreen({ navigation }) {
  const { timetable, handleAddClass } = useApp();
  const onAddClass = handleAddClass;
  // Form State
  const [course, setCourse] = useState('');
  const [code, setCode] = useState('');
  const [dept, setDept] = useState('CS');
  const [day, setDay] = useState('Thu');
  const [timeLabel, setTimeLabel] = useState('10:00 - 11:20 AM');
  const [room, setRoom] = useState('');
  const [instructor, setInstructor] = useState('');
  const [type, setType] = useState('Theory');

  // Feedback State
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollRef = useRef(null);

  // Exact keyboard height listener for mobile devices
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Header options & Reset action button
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add Class Slot',
      headerRight: () => (
        <TouchableOpacity
          style={{ padding: 6, marginRight: 4 }}
          onPress={() => {
            setCourse('');
            setCode('');
            setRoom('');
            setInstructor('');
            setErrorMessage('');
            setSuccessMessage('');
            Alert.alert('Form Reset', 'All input fields cleared.');
          }}
          accessibilityLabel="Reset Form Fields"
        >
          <Ionicons name="refresh-outline" size={22} color="#ffffff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleSave = () => {
    setErrorMessage('');
    setSuccessMessage('');

    // 1. Validation: Required fields
    if (!course.trim()) {
      setErrorMessage('Please enter the Course Name.');
      return;
    }
    if (!code.trim()) {
      setErrorMessage('Please enter the Course Code (e.g. CS-302).');
      return;
    }
    if (!room.trim()) {
      setErrorMessage('Please enter the Room or Lab Number (e.g. CS-04).');
      return;
    }
    if (!timeLabel.trim()) {
      setErrorMessage('Please enter the Class Timing (e.g. 10:00 - 11:20 AM).');
      return;
    }

    // 2. Strict Time Format Validation
    const newInterval = parseSlotInterval(timeLabel);
    if (!newInterval) {
      setErrorMessage(
        'Invalid time format. Please use format "HH:MM - HH:MM AM/PM" (e.g. "10:00 - 11:20 AM") and ensure the end time is after the start time.'
      );
      return;
    }

    if (!instructor.trim()) {
      setErrorMessage('Please enter the Instructor Name.');
      return;
    }

    // 3. Validation: Genuine Room & Time Interval Overlap Detection
    // Checks if the specified room is occupied during an overlapping time window
    const clash = timetable.find((c) => {
      if (c.day !== day) return false;
      if (c.room.trim().toLowerCase() !== room.trim().toLowerCase()) return false;

      const existingInterval = parseSlotInterval(c.timeLabel);
      if (!existingInterval) return true; // Fallback if existing slot has irregular time

      // Two intervals [A_start, A_end] and [B_start, B_end] overlap if and only if:
      // A_start < B_end && B_start < A_end
      const hasOverlap =
        newInterval.startMin < existingInterval.endMin &&
        existingInterval.startMin < newInterval.endMin;

      return hasOverlap;
    });

    if (clash) {
      setErrorMessage(
        `⚠️ Time & Room Clash! Room ${room.toUpperCase()} is already booked on ${day} for "${clash.course}" during ${clash.timeLabel}. The time slots overlap.`
      );
      return;
    }

    // 4. Construct new class object
    const newClass = {
      id: `${dept}-${Date.now()}`,
      dept,
      day,
      timeLabel: timeLabel.trim(),
      course: course.trim(),
      code: code.trim().toUpperCase(),
      room: room.trim().toUpperCase(),
      instructor: instructor.trim(),
      type,
      section: 'BCS-5B', // Add to current student's schedule
    };

    onAddClass(newClass);
    setSuccessMessage(`✓ Successfully added "${course}" to ${day}'s timetable (${timeLabel})!`);

    // Reset Form
    setCourse('');
    setCode('');
    setRoom('');
    setInstructor('');

    // Return to previous screen after brief confirmation
    setTimeout(() => {
      if (navigation && navigation.goBack) {
        navigation.goBack();
      }
    }, 1000);
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        keyboardHeight > 0 && { paddingBottom: keyboardHeight + 120 },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      
      {/* Intro Note */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Add Custom Slot or Makeup Lecture</Text>
        <Text style={styles.infoDesc}>
          Easily register an extra class, elective, or rescheduled lab. Automatic clash detection ensures room availability.
        </Text>
      </View>

      {/* Error Feedback Banner */}
      {errorMessage !== '' && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* Success Feedback Banner */}
      {successMessage !== '' && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      <View style={styles.formCard}>
        
        {/* Course Title */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Course Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Artificial Intelligence"
            placeholderTextColor="#94a3b8"
            value={course}
            onChangeText={setCourse}
          />
        </View>

        {/* Course Code & Room */}
        <View style={styles.row}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Course Code *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. AI-201"
              placeholderTextColor="#94a3b8"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
            />
          </View>

          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Room / Lab *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. CS-04"
              placeholderTextColor="#94a3b8"
              value={room}
              onChangeText={setRoom}
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* Day Selection */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Day of Week *</Text>
          <View style={styles.pillRow}>
            {DAYS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.pill, day === d && styles.pillActive]}
                onPress={() => setDay(d)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, day === d && styles.pillTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Timing */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Class Timing * (Format: HH:MM - HH:MM AM/PM)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 10:00 - 11:20 AM"
            placeholderTextColor="#94a3b8"
            value={timeLabel}
            onChangeText={setTimeLabel}
            onFocus={() => {
              setTimeout(() => {
                scrollRef.current?.scrollTo({ y: 220, animated: true });
              }, 120);
            }}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {TIME_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[styles.presetPill, timeLabel === preset && styles.presetPillActive]}
                  onPress={() => setTimeLabel(preset)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.presetText, timeLabel === preset && styles.presetTextActive]}>
                    {preset}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Instructor */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Instructor Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Dr. Umair"
            placeholderTextColor="#94a3b8"
            value={instructor}
            onChangeText={setInstructor}
            onFocus={() => {
              setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
              }, 120);
            }}
          />
        </View>

        {/* Class Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Session Type</Text>
          <View style={styles.pillRow}>
            {TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.pill, type === t && styles.pillActive, { flex: 1, alignItems: 'center' }]}
                onPress={() => setType(t)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, type === t && styles.pillTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.submitBtnText}>+ Add to Schedule</Text>
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
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  infoDesc: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: 2,
    lineHeight: 16,
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  successBanner: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  successText: {
    color: '#15803d',
    fontSize: 12,
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0f172a',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  pillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  pillTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  presetPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  presetPillActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  presetText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  presetTextActive: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
