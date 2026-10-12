// src/context/AppContext.js
// Global state management for FLEX-Sync across all React Navigation screens
import React, { createContext, useContext, useState } from 'react';
import {
  CURRENT_STUDENT,
  CURRENT_TEACHER,
  INITIAL_TIMETABLE,
  INITIAL_MESSAGES,
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. Dual Persona: 'student' | 'teacher'
  const [userRole, setUserRole] = useState('student');

  // 2. Core Entities
  const [student, setStudent] = useState(CURRENT_STUDENT);
  const [teacher, setTeacher] = useState(CURRENT_TEACHER);
  const [timetable, setTimetable] = useState(INITIAL_TIMETABLE);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  // 3. Attendance Record (classId -> 'present' | 'absent' | 'pending')
  const [attendanceRecord, setAttendanceRecord] = useState({
    'CS-101': 'present',
    'CS-102': 'present',
    'CS-104': 'absent',
  });

  // Toggle user persona between Student (Hamza Tariq) and Faculty (Dr. Farhan Ali)
  const togglePersona = () => {
    setUserRole((prev) => (prev === 'student' ? 'teacher' : 'student'));
  };

  // Set attendance for a class and recalculate course attendance percentage
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
              heldDelta = 1;
              if (newStatus === 'present') attendedDelta = 1;
            } else if (oldStatus === 'present') {
              if (newStatus === 'absent') {
                heldDelta = 0;
                attendedDelta = -1;
              } else if (newStatus === 'pending') {
                heldDelta = -1;
                attendedDelta = -1;
              }
            } else if (oldStatus === 'absent') {
              if (newStatus === 'present') {
                heldDelta = 0;
                attendedDelta = 1;
              } else if (newStatus === 'pending') {
                heldDelta = -1;
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

  // Add newly created class to timetable
  const handleAddClass = (newClass) => {
    setTimetable((prev) => [newClass, ...prev]);
  };

  // Send message in academic chat
  const handleSendMessage = (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  };

  // Mark conversation messages as read
  const handleMarkAsRead = (facultyId, studentId, viewerRole) => {
    setMessages((prev) =>
      prev.map((msg) => {
        const isTarget = msg.facultyId === facultyId && msg.studentId === studentId;
        const isIncoming =
          viewerRole === 'teacher'
            ? msg.senderRole === 'student'
            : msg.senderRole === 'teacher';

        if (isTarget && isIncoming) {
          return { ...msg, isRead: true };
        }
        return msg;
      })
    );
  };

  // Calculate unread count for chat badge
  const unreadCount = messages.filter((m) => {
    if (userRole === 'student') {
      return m.senderRole === 'teacher' && !m.isRead;
    } else {
      return m.senderRole === 'student' && !m.isRead;
    }
  }).length;

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        togglePersona,
        student,
        setStudent,
        teacher,
        setTeacher,
        timetable,
        setTimetable,
        messages,
        attendanceRecord,
        handleSetAttendance,
        handleAddClass,
        handleSendMessage,
        handleMarkAsRead,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
