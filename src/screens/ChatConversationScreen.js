// src/screens/ChatConversationScreen.js
// Demonstrates:
// 1. Receiving route parameter (route.params.faculty)
// 2. Displaying received parameters on destination screen
// 3. Custom dynamic header title & header styling
// 4. Header buttons performing meaningful actions (Alert with office hours & contact info)
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ChatConversationScreen({ route, navigation }) {
  const { faculty } = route.params || {};
  const {
    messages,
    handleSendMessage,
    handleMarkAsRead,
    userRole,
    student,
    teacher,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const scrollRef = useRef(null);

  if (!faculty) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>No faculty parameter data received.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Return to Directory</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Customize Header Title dynamically & add Action Button to navigation header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: faculty.name,
      headerRight: () => (
        <View style={styles.headerRightRow}>
          {/* Header Action: Alert displaying Faculty Office Consultation info */}
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => {
              Alert.alert(
                `${faculty.name}`,
                `🏛️ Office: ${faculty.office}\n📚 Subject: ${faculty.subject}\n🏷️ Status: ${faculty.status}\n\nOffice consultation is permitted during free slots or by prior appointment.`,
                [
                  {
                    text: 'Copy Email',
                    onPress: () => Alert.alert('Notice', `Email address: ${faculty.name.toLowerCase().replace(/[^a-z]/g, '')}@nu.edu.pk`),
                  },
                  { text: 'Close', style: 'cancel' },
                ]
              );
            }}
            accessibilityLabel="Faculty Office Hours"
          >
            <Ionicons name="information-circle-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, faculty]);

  // Mark messages from this faculty as read upon viewing
  useEffect(() => {
    handleMarkAsRead(faculty.id, student.id, userRole);
  }, [faculty.id, userRole]);

  // Scroll to bottom on load
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 150);
  }, [messages.length]);

  const conversationMsgs = messages.filter((m) => m.facultyId === faculty.id);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      facultyId: faculty.id,
      studentId: student.id,
      senderRole: userRole === 'student' ? 'student' : 'teacher',
      senderName: userRole === 'student' ? student.name : teacher.name,
      text: inputVal.trim(),
      timestamp: 'Just now',
      isRead: false,
    };

    handleSendMessage(newMsg);
    setInputVal('');

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Route Parameter Banner */}
        <View style={styles.paramBanner}>
          <View style={styles.paramTag}>
            <Text style={styles.paramTagText}>ROUTE PARAMETER RECEIVED</Text>
          </View>
          <Text style={styles.paramDetails}>
            Viewing 1-on-1 channel for <Text style={styles.bold}>{faculty.name}</Text> ({faculty.designation})
          </Text>
        </View>

        {/* Faculty Profile Card (Displaying Received Route Params) */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarEmoji}>{faculty.avatar}</Text>
          </View>
          <Text style={styles.facultyTitle}>{faculty.name}</Text>
          <Text style={styles.facultyDesignation}>{faculty.designation} • {faculty.department}</Text>
          
          <View style={styles.paramPillsRow}>
            <View style={styles.paramPill}>
              <Text style={styles.pillLabel}>Subject: </Text>
              <Text style={styles.pillVal}>{faculty.subject}</Text>
            </View>
            <View style={styles.paramPill}>
              <Text style={styles.pillLabel}>Office: </Text>
              <Text style={styles.pillVal}>{faculty.office}</Text>
            </View>
          </View>

          <View style={styles.statusBox}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{faculty.status}</Text>
          </View>
        </View>

        {/* Message Thread */}
        <View style={styles.messageThread}>
          <Text style={styles.threadDateBadge}>Official FAST Consultation Thread</Text>

          {conversationMsgs.map((msg) => {
            const isMe = msg.senderRole === (userRole === 'student' ? 'student' : 'teacher');

            return (
              <View
                key={msg.id}
                style={[
                  styles.msgRow,
                  isMe ? styles.msgRowRight : styles.msgRowLeft,
                ]}
              >
                <View
                  style={[
                    styles.msgBubble,
                    isMe ? styles.msgBubbleMe : styles.msgBubbleOther,
                  ]}
                >
                  <Text style={[styles.senderName, isMe ? styles.senderNameMe : styles.senderNameOther]}>
                    {msg.senderName}
                  </Text>
                  <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>
                    {msg.text}
                  </Text>
                  <View style={styles.msgFooter}>
                    <Text style={[styles.timeText, isMe ? styles.timeTextMe : styles.timeTextOther]}>
                      {msg.timestamp || 'Today'}
                    </Text>
                    {isMe && (
                      <Ionicons
                        name={msg.isRead ? 'checkmark-done' : 'checkmark'}
                        size={14}
                        color={msg.isRead ? '#38bdf8' : '#94a3b8'}
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder={`Message ${faculty.name.split(' ')[0]}...`}
          placeholderTextColor="#94a3b8"
          value={inputVal}
          onChangeText={setInputVal}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputVal.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!inputVal.trim()}
          activeOpacity={0.8}
        >
          <Ionicons name="send" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  headerActionBtn: {
    padding: 6,
  },
  paramBanner: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
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
  paramDetails: {
    fontSize: 12,
    color: '#1e40af',
  },
  bold: {
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarBig: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  facultyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  facultyDesignation: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  paramPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  paramPill: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
  },
  pillLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  pillVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
  },
  messageThread: {
    marginTop: 8,
  },
  threadDateBadge: {
    alignSelf: 'center',
    backgroundColor: '#e2e8f0',
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 16,
  },
  msgRow: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  msgRowLeft: {
    justifyContent: 'flex-start',
  },
  msgRowRight: {
    justifyContent: 'flex-end',
  },
  msgBubble: {
    maxWidth: '82%',
    borderRadius: 16,
    padding: 12,
  },
  msgBubbleMe: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  msgBubbleOther: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  senderName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  senderNameMe: {
    color: '#bfdbfe',
  },
  senderNameOther: {
    color: '#64748b',
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  msgTextMe: {
    color: '#ffffff',
  },
  msgTextOther: {
    color: '#0f172a',
  },
  msgFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
  },
  timeTextMe: {
    color: '#bfdbfe',
  },
  timeTextOther: {
    color: '#94a3b8',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 90,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    color: '#0f172a',
  },
  sendBtn: {
    backgroundColor: '#2563eb',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
});
