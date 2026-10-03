// src/screens/ChatScreen.js
// Faculty Connect: 1-on-1 WhatsApp-Style Academic Chat with Faculty List & Read/Seen Flags
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FACULTY_LIST } from '../data/mockData';
import EmptyState from '../components/EmptyState';

export default function ChatScreen({
  userRole = 'student',
  student,
  teacher,
  messages,
  onSendMessage,
  onMarkAsRead,
}) {
  // State: Currently selected contact to chat with (null = show contact list)
  const [selectedContact, setSelectedContact] = useState(null);
  const [inputText, setInputText] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  const isTeacher = userRole === 'teacher';

  // Open 1-on-1 chat with a contact and mark messages as read
  const handleOpenChat = (contact) => {
    setSelectedContact(contact);
    if (onMarkAsRead) {
      const facultyId = isTeacher ? teacher.id : contact.id;
      const studentId = isTeacher ? contact.id : student.id;
      onMarkAsRead(facultyId, studentId, userRole);
    }
  };

  // Send message inside 1-on-1 chat
  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setErrorNotice('Please type a message before sending.');
      return;
    }
    setErrorNotice('');

    const facultyId = isTeacher ? teacher.id : selectedContact.id;
    const studentId = isTeacher ? selectedContact.id : student.id;

    const newMsg = {
      id: `msg-${Date.now()}`,
      facultyId,
      studentId,
      senderRole: userRole,
      senderName: isTeacher ? teacher.name : student.name,
      text: trimmed,
      time: 'Just now',
      isRead: false, // Starts as UNREAD for the receiver!
    };

    onSendMessage(newMsg);
    setInputText('');
  };

  // ================= VIEW A: 1-ON-1 CONVERSATION SCREEN =================
  if (selectedContact) {
    // Filter messages belonging only to this faculty-student pair
    const currentFacultyId = isTeacher ? teacher.id : selectedContact.id;
    const currentStudentId = isTeacher ? selectedContact.id : student.id;

    const conversationMessages = messages.filter(
      (m) => m.facultyId === currentFacultyId && m.studentId === currentStudentId
    );

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Chat Header with Back Button */}
        <View style={styles.chatHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedContact(null)}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderTitle}>{selectedContact.name}</Text>
            <Text style={styles.chatHeaderSubtitle}>
              {isTeacher
                ? `Student • Sec ${selectedContact.section}`
                : `${selectedContact.designation} • ${selectedContact.office}`}
            </Text>
          </View>
        </View>

        {/* Message Feed */}
        <ScrollView
          style={styles.chatFeed}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {conversationMessages.length > 0 ? (
            conversationMessages.map((msg) => {
              const isMe = msg.senderRole === userRole;

              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageWrapper,
                    isMe ? styles.messageWrapperRight : styles.messageWrapperLeft,
                  ]}
                >
                  <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                    <Text style={[styles.messageSenderTag, isMe ? styles.textLight : styles.textDark]}>
                      {isMe ? 'You' : msg.senderName}
                    </Text>
                    <Text style={[styles.messageText, isMe ? styles.textLight : styles.textDark]}>
                      {msg.text}
                    </Text>
                    <View style={styles.metaRow}>
                      <Text style={[styles.timestamp, isMe ? styles.timestampMe : styles.timestampOther]}>
                        {msg.time}
                      </Text>
                      {isMe && (
                        <Text style={styles.readStatusText}>
                          {msg.isRead ? ' ✓✓ Seen' : ' ✓ Delivered'}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <EmptyState
              title="No Messages Yet"
              message={`Send your first direct message to ${selectedContact.name}.`}
            />
          )}
        </ScrollView>

        {/* Error Notice */}
        {errorNotice !== '' && (
          <View style={styles.errorNoticeBox}>
            <Text style={styles.errorNoticeText}>⚠️ {errorNotice}</Text>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={
              isTeacher
                ? `Reply to ${selectedContact.name}...`
                : `Message ${selectedContact.name}...`
            }
            placeholderTextColor="#94a3b8"
            value={inputText}
            onChangeText={(txt) => {
              setInputText(txt);
              if (errorNotice) setErrorNotice('');
            }}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.8}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ================= VIEW B: CONTACT LIST SCREEN =================
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* Privacy Notice Banner */}
      <View style={styles.privacyBanner}>
        <Text style={styles.privacyIcon}>🔒</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.privacyTitle}>Direct Academic Faculty Messaging</Text>
          <Text style={styles.privacySub}>
            {isTeacher
              ? 'Incoming student academic questions. Personal phone numbers remain protected.'
              : 'Message your professors directly without sharing personal phone numbers or slow emails.'}
          </Text>
        </View>
      </View>

      {/* Section Heading */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>
          {isTeacher ? 'Incoming Student Chats' : 'Faculty Contacts Directory'}
        </Text>
        <Text style={styles.countText}>
          {isTeacher ? '1 Active Student' : `${FACULTY_LIST.length} Instructors`}
        </Text>
      </View>

      {/* TEACHER MODE: Shows students who texted the teacher */}
      {isTeacher ? (
        (() => {
          // Find messages sent to Dr. Farhan Ali by Hamza Tariq
          const studentMessages = messages.filter(
            (m) => m.facultyId === teacher.id && m.studentId === student.id
          );
          const hasUnread = studentMessages.some(
            (m) => m.senderRole === 'student' && !m.isRead
          );
          const lastMsg = studentMessages[studentMessages.length - 1];

          const studentContact = {
            id: student.id,
            name: student.name,
            section: student.section,
            department: student.department,
          };

          return (
            <TouchableOpacity
              style={[styles.contactCard, hasUnread && styles.contactCardUnread]}
              onPress={() => handleOpenChat(studentContact)}
              activeOpacity={0.7}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>🎓</Text>
              </View>

              <View style={styles.contactDetails}>
                <View style={styles.contactHeaderRow}>
                  <Text style={styles.contactName}>{student.name}</Text>
                  {hasUnread ? (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>🔵 NEW</Text>
                    </View>
                  ) : (
                    <View style={styles.seenBadge}>
                      <Text style={styles.seenBadgeText}>✓ SEEN</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.contactMeta}>
                  Roll No: {student.id} • Sec: {student.section}
                </Text>
                <Text style={styles.lastMessageSnippet} numberOfLines={1}>
                  {lastMsg ? `${lastMsg.senderName}: "${lastMsg.text}"` : 'No messages yet.'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })()
      ) : (
        /* STUDENT MODE: Shows the list of all Faculty Members */
        FACULTY_LIST.map((fac) => {
          // Check last message with this faculty
          const facMessages = messages.filter(
            (m) => m.facultyId === fac.id && m.studentId === student.id
          );
          const lastMsg = facMessages[facMessages.length - 1];
          const hasUnreadFromFaculty = facMessages.some(
            (m) => m.senderRole === 'teacher' && !m.isRead
          );

          return (
            <TouchableOpacity
              key={fac.id}
              style={[styles.contactCard, hasUnreadFromFaculty && styles.contactCardUnread]}
              onPress={() => handleOpenChat(fac)}
              activeOpacity={0.7}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{fac.avatar}</Text>
              </View>

              <View style={styles.contactDetails}>
                <View style={styles.contactHeaderRow}>
                  <Text style={styles.contactName}>{fac.name}</Text>
                  {hasUnreadFromFaculty ? (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>🔵 NEW</Text>
                    </View>
                  ) : (
                    <Text style={styles.statusPill}>{fac.office}</Text>
                  )}
                </View>
                <Text style={styles.contactSubject}>{fac.subject}</Text>
                <Text style={styles.contactMeta}>
                  {fac.designation} • <Text style={styles.statusLive}>{fac.status}</Text>
                </Text>
                {lastMsg && (
                  <Text style={styles.lastMessageSnippet} numberOfLines={1}>
                    💬 {lastMsg.senderName}: {lastMsg.text}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })
      )}

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
  privacyBanner: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  privacyIcon: {
    fontSize: 18,
  },
  privacyTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  privacySub: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: 1,
    lineHeight: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  countText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  contactCardUnread: {
    borderColor: '#3b82f6',
    backgroundColor: '#f0f7ff',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  avatarText: {
    fontSize: 20,
  },
  contactDetails: {
    flex: 1,
  },
  contactHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  newBadge: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newBadgeText: {
    color: '#1d4ed8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  seenBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  seenBadgeText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  statusPill: {
    fontSize: 10,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  contactSubject: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
    marginTop: 1,
  },
  contactMeta: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  statusLive: {
    color: '#16a34a',
    fontWeight: '600',
  },
  lastMessageSnippet: {
    fontSize: 11,
    color: '#475569',
    fontStyle: 'italic',
    marginTop: 4,
    backgroundColor: '#f8fafc',
    padding: 4,
    borderRadius: 4,
  },
  // 1-on-1 Chat Styles
  chatHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  chatHeaderSubtitle: {
    fontSize: 11,
    color: '#64748b',
  },
  chatFeed: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  chatContent: {
    padding: 14,
    paddingBottom: 20,
  },
  messageWrapper: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  messageWrapperLeft: {
    justifyContent: 'flex-start',
  },
  messageWrapperRight: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 14,
    padding: 10,
  },
  bubbleOther: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderBottomLeftRadius: 4,
  },
  bubbleMe: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  messageSenderTag: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  textLight: {
    color: '#ffffff',
  },
  textDark: {
    color: '#1e293b',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 9,
  },
  timestampOther: {
    color: '#94a3b8',
  },
  timestampMe: {
    color: '#bfdbfe',
  },
  readStatusText: {
    fontSize: 9,
    color: '#bfdbfe',
    fontWeight: 'bold',
  },
  errorNoticeBox: {
    backgroundColor: '#fef2f2',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#fca5a5',
  },
  errorNoticeText: {
    fontSize: 11,
    color: '#b91c1c',
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0f172a',
  },
  sendButton: {
    backgroundColor: '#2563eb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
