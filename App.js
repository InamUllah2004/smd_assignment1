// App.js
// FLEX-Sync: Student & Faculty Academic Companion
// Main entry point with dual persona and state-based view switching (Zero React Navigation)
import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import {
  CURRENT_STUDENT,
  CURRENT_TEACHER,
  INITIAL_TIMETABLE,
  INITIAL_MESSAGES,
} from './src/data/mockData';
import Header from './src/components/Header';
import MyScheduleScreen from './src/screens/MyScheduleScreen';
import ExplorerScreen from './src/screens/ExplorerScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import AddSlotScreen from './src/screens/AddSlotScreen';
import ChatScreen from './src/screens/ChatScreen';

export default function App() {
  // 1. Dual Persona State ('student' | 'teacher')
  // 1-tap toggle between Student (Hamza Tariq) and Faculty (Dr. Farhan Ali)
  const [userRole, setUserRole] = useState('student');

  // 2. View Switching State ('mySchedule' | 'explorer' | 'chat' | 'analytics' | 'addSlot')
  // Strictly complies with the assignment instruction: Switch views using state, NO navigation libraries
  const [activeTab, setActiveTab] = useState('mySchedule');

  // 3. Global State
  const [student, setStudent] = useState(CURRENT_STUDENT);
  const [teacher, setTeacher] = useState(CURRENT_TEACHER);
  const [timetable, setTimetable] = useState(INITIAL_TIMETABLE);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  // 4. Attendance tracking state (maps classId -> 'present' | 'absent' | 'pending')
  const [attendanceRecord, setAttendanceRecord] = useState({
    'CS-101': 'present',
  });

  // Handler: Set exact attendance status ('present', 'absent', or 'pending')
  // Mathematically recalculates: (attendedLectures / heldLectures) * 100
  const handleSetAttendance = (classId, newStatus) => {
    const oldStatus = attendanceRecord[classId] || 'pending';
    if (oldStatus === newStatus) return;

    setAttendanceRecord((prev) => ({
      ...prev,
      [classId]: newStatus,
    }));

    const classObj = timetable.find((c) => c.id === classId);
    if (classObj) {
      setStudent((prevStudent) => {
        const updatedCourses = prevStudent.registeredCourses.map((course) => {
          if (course.code === classObj.code) {
            let heldDelta = 0;
            let attendedDelta = 0;

            if (oldStatus === 'pending') {
              // Newly marked session
              heldDelta = 1;
              if (newStatus === 'present') attendedDelta = 1;
            } else if (oldStatus === 'present') {
              if (newStatus === 'absent') {
                heldDelta = 0; // session was already counted as held
                attendedDelta = -1;
              } else if (newStatus === 'pending') {
                heldDelta = -1; // unmarking session
                attendedDelta = -1;
              }
            } else if (oldStatus === 'absent') {
              if (newStatus === 'present') {
                heldDelta = 0;
                attendedDelta = 1;
              } else if (newStatus === 'pending') {
                heldDelta = -1; // unmarking session
                attendedDelta = 0;
              }
            }

            const newHeld = Math.max(1, course.heldLectures + heldDelta);
            const newAttended = Math.max(0, Math.min(newHeld, course.attendedLectures + attendedDelta));
            const newPercentage = Math.round((newAttended / newHeld) * 100);

            return {
              ...course,
              heldLectures: newHeld,
              attendedLectures: newAttended,
              attendance: newPercentage,
            };
          }
          return course;
        });
        return { ...prevStudent, registeredCourses: updatedCourses };
      });
    }
  };

  // Handler: Add a newly created class to the global timetable
  const handleAddClass = (newClass) => {
    setTimetable((prev) => [newClass, ...prev]);
  };

  // Handler: Add a new message to the academic chat
  const handleSendMessage = (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  };

  // Handler: Mark messages as read / seen when a conversation is opened
  const handleMarkAsRead = (facultyId, studentId, viewerRole) => {
    setMessages((prev) =>
      prev.map((msg) => {
        const isTargetConversation = msg.facultyId === facultyId && msg.studentId === studentId;
        const isIncoming =
          viewerRole === 'teacher'
            ? msg.senderRole === 'student'
            : msg.senderRole === 'teacher';

        if (isTargetConversation && isIncoming) {
          return { ...msg, isRead: true };
        }
        return msg;
      })
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Top Header Banner, Dual Persona Toggle & Tab Switcher */}
      <Header
        userRole={userRole}
        onToggleRole={setUserRole}
        student={student}
        teacher={teacher}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Conditional View Rendering */}
      <View style={styles.body}>
        {activeTab === 'mySchedule' && (
          <MyScheduleScreen
            userRole={userRole}
            student={student}
            teacher={teacher}
            timetable={timetable}
            attendanceRecord={attendanceRecord}
            onSetAttendance={handleSetAttendance}
          />
        )}

        {activeTab === 'explorer' && (
          <ExplorerScreen
            timetable={timetable}
          />
        )}

        {activeTab === 'chat' && (
          <ChatScreen
            userRole={userRole}
            student={student}
            teacher={teacher}
            messages={messages}
            onSendMessage={handleSendMessage}
            onMarkAsRead={handleMarkAsRead}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsScreen
            userRole={userRole}
            student={student}
            teacher={teacher}
            timetable={timetable}
          />
        )}

        {activeTab === 'addSlot' && (
          <AddSlotScreen
            timetable={timetable}
            onAddClass={handleAddClass}
            onNavigate={setActiveTab}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  body: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
