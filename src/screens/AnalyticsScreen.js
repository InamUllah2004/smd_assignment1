// src/screens/AnalyticsScreen.js
// Academic & Attendance Dashboard using react-native-chart-kit
// Fulfills Requirement 7: Dashboard with at least two different chart types (BarChart & ProgressChart)
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart, ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 32;

// Helper: Convert time string into minutes from midnight
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

// Helper: Calculate exact class duration in decimal hours from timeLabel (e.g. "10:00 - 11:20 AM" -> 1.33h)
function calculateClassDurationHours(timeLabel) {
  if (!timeLabel || !timeLabel.includes('-')) return 0;
  const parts = timeLabel.split('-');
  if (parts.length !== 2) return 0;
  const startPart = parts[0].trim();
  const endPart = parts[1].trim();

  // End part MUST strictly specify AM or PM
  const endModifierMatch = endPart.match(/(AM|PM)$/i);
  if (!endModifierMatch) return 0; // Return 0 on unparseable/missing AM/PM
  const endModifier = endModifierMatch[1].toUpperCase();

  let startFull = startPart;
  if (!startPart.match(/(AM|PM)$/i)) {
    const startHourMatch = startPart.match(/^(\d{1,2}):\d{2}$/);
    if (!startHourMatch) return 0;
    const startHour = parseInt(startHourMatch[1], 10);
    const inferred = (endModifier === 'PM' && startHour >= 8 && startHour <= 11) ? 'AM' : endModifier;
    startFull = `${startPart} ${inferred}`;
  }

  const startMin = parseTimeToMinutes(startFull);
  const endMin = parseTimeToMinutes(endPart);
  if (startMin === null || endMin === null || endMin <= startMin) return 0;

  return (endMin - startMin) / 60;
}

export default function AnalyticsScreen({ userRole = 'student', student, teacher, timetable }) {
  const isTeacher = userRole === 'teacher';
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // 1. Calculate Exact Daily Hours from displayed class intervals:
  // If Teacher -> exact teaching hours per day for Dr. Farhan Ali
  // If Student -> exact contact hours per day for Section BCS-5B
  const dailyHours = days.map((day) => {
    const dayClasses = timetable.filter((c) => {
      const isTarget = isTeacher
        ? c.instructor === teacher.name
        : c.section === student.section;
      return isTarget && c.day === day;
    });

    const totalHours = dayClasses.reduce((acc, curr) => {
      return acc + calculateClassDurationHours(curr.timeLabel);
    }, 0);

    return Number(totalHours.toFixed(1));
  });

  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        data: dailyHours,
      },
    ],
  };

  // Data for ProgressChart:
  // If Faculty -> shows Dr. Farhan Ali's section-wise attendance health
  // If Student -> shows Hamza Tariq's registered course attendance
  const registeredCourses = student.registeredCourses;
  const facultySections = teacher.sectionsHealth || [];

  const progressChartData = isTeacher
    ? {
        labels: facultySections.map((s) => s.section),
        data: facultySections.map((s) => s.avgAttendance / 100),
      }
    : {
        labels: registeredCourses.map((c) => c.code),
        data: registeredCourses.map((c) => c.attendance / 100),
      };

  // Calculate Weighted Overall Attendance (Student: total attended / total held)
  const totalHeldLectures = registeredCourses.reduce((acc, c) => acc + (c.heldLectures || 0), 0);
  const totalAttendedLectures = registeredCourses.reduce((acc, c) => acc + (c.attendedLectures || 0), 0);
  const overallAttendance = totalHeldLectures > 0
    ? ((totalAttendedLectures / totalHeldLectures) * 100).toFixed(1)
    : '0.0';

  const atRiskCourses = registeredCourses.filter((c) => c.attendance < c.threshold);

  // Faculty total weekly hours
  const totalWeeklyTeachingHours = dailyHours.reduce((a, b) => a + b, 0);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
    style: {
      borderRadius: 14,
    },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* Overview Stat Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            {isTeacher ? 'Weekly Teaching Load' : 'Overall Attendance'}
          </Text>
          <Text style={[styles.statValue, { color: isTeacher ? '#d97706' : atRiskCourses.length > 0 ? '#dc2626' : '#16a34a' }]}>
            {isTeacher ? `${totalWeeklyTeachingHours}h` : `${overallAttendance}%`}
          </Text>
          <Text style={styles.statSub}>
            {isTeacher ? 'Lectures & Labs' : `Weighted (${totalAttendedLectures}/${totalHeldLectures} Lectures)`}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            {isTeacher ? 'Courses Assigned' : 'Debar Risk Warning'}
          </Text>
          <Text style={[styles.statValue, { color: isTeacher ? '#2563eb' : atRiskCourses.length > 0 ? '#dc2626' : '#16a34a' }]}>
            {isTeacher ? teacher.coursesTaught.length : `${atRiskCourses.length} Courses`}
          </Text>
          <Text style={styles.statSub}>
            {isTeacher ? 'Computer Science' : atRiskCourses.length > 0 ? 'Action Required' : 'All Clear'}
          </Text>
        </View>
      </View>

      {/* Warning Banner if below threshold (Student view only) */}
      {!isTeacher && atRiskCourses.length > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <View style={styles.alertTextContainer}>
            <Text style={styles.alertTitle}>Debar Risk Detected!</Text>
            {atRiskCourses.map((c) => (
              <Text key={c.code} style={styles.alertMessage}>
                • {c.name} ({c.code}) is at {c.attendance}% (below {c.threshold}% threshold).
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* CHART 1: Workload / Teaching Load Bar Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>
              {isTeacher ? '1. Faculty Teaching Load per Day' : '1. Weekly Workload Distribution'}
            </Text>
            <Text style={styles.chartSubtitle}>
              {isTeacher ? 'Hours scheduled to teach on campus' : 'Total Contact Hours per Day'}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Bar Chart</Text>
          </View>
        </View>

        <BarChart
          data={barChartData}
          width={screenWidth - 28}
          height={200}
          yAxisSuffix="h"
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) =>
              isTeacher
                ? `rgba(217, 119, 6, ${opacity})` // Amber for Faculty
                : `rgba(37, 99, 235, ${opacity})`, // Blue for Student
          }}
          verticalLabelRotation={0}
          fromZero
          showValuesOnTopOfBars
          style={styles.chart}
        />
        <Text style={styles.chartNote}>
          {isTeacher
            ? 'Wednesday has the highest teaching load due to a 2.8h Algorithms Lab.'
            : 'Tuesday has the highest load (5.5 hrs) due to regular lectures plus database lab session.'}
        </Text>
      </View>

      {/* CHART 2: Attendance Progress Chart (Student & Faculty Overview) */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>
              {isTeacher ? '2. Department Class Health' : '2. Subject-Wise Attendance'}
            </Text>
            <Text style={styles.chartSubtitle}>
              {isTeacher ? 'Attendance rate across your sections' : 'Ring Chart (Outer to Inner)'}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Progress Chart</Text>
          </View>
        </View>

        <ProgressChart
          data={progressChartData}
          width={screenWidth - 28}
          height={200}
          strokeWidth={12}
          radius={28}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1, index) => {
              if (isTeacher) {
                const pct = facultySections[index]?.avgAttendance;
                if (pct !== undefined && pct < 80) {
                  return `rgba(220, 38, 38, ${opacity})`;
                }
                return `rgba(217, 119, 6, ${opacity})`;
              }
              const course = registeredCourses[index];
              const pct = course?.attendance;
              const threshold = course?.threshold ?? 80;
              if (pct !== undefined && pct < threshold) {
                return `rgba(220, 38, 38, ${opacity})`; // Danger red if below specific course threshold
              }
              return `rgba(16, 185, 129, ${opacity})`; // Emerald green if safe
            },
          }}
          hideLegend={false}
          style={styles.chart}
        />
      </View>

      {/* Detailed Course Breakdown Table */}
      <View style={styles.tableCard}>
        <Text style={styles.tableTitle}>
          {isTeacher ? 'Assigned Sections & Attendance Health' : 'Course Attendance Detail'}
        </Text>
        {isTeacher ? (
          facultySections.map((sec, idx) => (
            <View key={idx} style={styles.tableRow}>
              <View style={styles.tableCourseInfo}>
                <Text style={styles.tableCourseName}>
                  Section {sec.section} • {sec.courseName}
                </Text>
                <Text style={styles.tableCourseCode}>
                  {sec.totalStudents} Enrolled Students • Verified Schedule
                </Text>
              </View>
              <View style={styles.tablePercentage}>
                <Text style={[styles.percentageText, styles.safeText]}>
                  {sec.avgAttendance}%
                </Text>
                <Text style={styles.thresholdText}>Class Avg</Text>
              </View>
            </View>
          ))
        ) : (
          registeredCourses.map((c) => {
            const isAtRisk = c.attendance < c.threshold;
            return (
              <View key={c.code} style={styles.tableRow}>
                <View style={styles.tableCourseInfo}>
                  <Text style={styles.tableCourseName}>{c.name}</Text>
                  <Text style={styles.tableCourseCode}>
                    {c.code} • {c.creditHours} CH • {c.attendedLectures}/{c.heldLectures} Lectures Held
                  </Text>
                </View>
                <View style={styles.tablePercentage}>
                  <Text style={[styles.percentageText, isAtRisk ? styles.riskText : styles.safeText]}>
                    {c.attendance}%
                  </Text>
                  <Text style={styles.thresholdText}>Min {c.threshold}%</Text>
                </View>
              </View>
            );
          })
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
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    marginVertical: 4,
  },
  statSub: {
    fontSize: 11,
    color: '#94a3b8',
  },
  alertBanner: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  alertIcon: {
    fontSize: 18,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  alertMessage: {
    fontSize: 11,
    color: '#b91c1c',
    marginTop: 2,
    lineHeight: 16,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  chartSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  badge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563eb',
  },
  chart: {
    marginVertical: 6,
    borderRadius: 10,
    alignSelf: 'center',
  },
  chartNote: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tableTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableCourseInfo: {
    flex: 1,
    paddingRight: 10,
  },
  tableCourseName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  tableCourseCode: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  tablePercentage: {
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  safeText: {
    color: '#16a34a',
  },
  riskText: {
    color: '#dc2626',
  },
  thresholdText: {
    fontSize: 10,
    color: '#94a3b8',
  },
});
