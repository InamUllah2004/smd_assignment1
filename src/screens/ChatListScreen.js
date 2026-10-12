// src/screens/ChatListScreen.js
// Faculty Connect Directory: lists faculty contacts with search and unread badges
import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FACULTY_LIST } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function ChatListScreen({ navigation }) {
  const { messages, userRole, student, teacher } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Customize header with meaningful right button (Advisory Alert)
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Faculty Connect',
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            Alert.alert(
              'FAST Communication Protocol',
              'Official Faculty Consultation Guidelines:\n\n1. Use academic email or Faculty Connect for official queries.\n2. Respect office hours (Mon-Thu).\n3. Expect replies within 24-48 working hours.',
              [{ text: 'Understood', style: 'default' }]
            );
          }}
          accessibilityLabel="Academic Advisory"
        >
          <Ionicons name="information-circle-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Filter contacts by search query
  const filteredFaculty = FACULTY_LIST.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      q === '' ||
      f.name.toLowerCase().includes(q) ||
      f.subject.toLowerCase().includes(q) ||
      f.department.toLowerCase().includes(q) ||
      f.office.toLowerCase().includes(q)
    );
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      
      {/* Intro Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerIconBox}>
          <Ionicons name="chatbubbles" size={24} color="#2563eb" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.bannerTitle}>1-on-1 Academic Messaging</Text>
          <Text style={styles.bannerSubtitle}>
            Direct chat with FAST-NUCES faculty. Tap any instructor to open conversation screen.
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#64748b" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by faculty, subject, or office..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Contacts List Header */}
      <View style={styles.listHeaderRow}>
        <Text style={styles.listHeading}>Directory ({filteredFaculty.length})</Text>
        <Text style={styles.listSubheading}>Select contact to pass route parameters</Text>
      </View>

      {/* Faculty Cards */}
      {filteredFaculty.map((faculty) => {
        // Find latest message with this faculty
        const contactMsgs = messages.filter((m) => m.facultyId === faculty.id);
        const lastMsg = contactMsgs.length > 0 ? contactMsgs[contactMsgs.length - 1] : null;
        
        // Count unread incoming messages from this faculty
        const unreadCount = contactMsgs.filter((m) => {
          if (userRole === 'student') {
            return m.senderRole === 'teacher' && !m.isRead;
          } else {
            return m.senderRole === 'student' && !m.isRead;
          }
        }).length;

        return (
          <TouchableOpacity
            key={faculty.id}
            style={styles.facultyCard}
            onPress={() => {
              // Pass data to destination screen via route parameters!
              navigation.navigate('ChatConversation', { faculty });
            }}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarEmoji}>{faculty.avatar}</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.facultyName}>{faculty.name}</Text>
                {lastMsg && (
                  <Text style={styles.msgTime}>
                    {lastMsg.timestamp || 'Active'}
                  </Text>
                )}
              </View>

              <Text style={styles.subjectText}>{faculty.subject}</Text>
              
              <View style={styles.footerRow}>
                <View style={styles.officeTag}>
                  <Text style={styles.officeText}>📍 {faculty.office}</Text>
                </View>
                <Text style={styles.statusText} numberOfLines={1}>
                  {faculty.status}
                </Text>
              </View>

              {lastMsg && (
                <Text style={styles.snippetText} numberOfLines={1}>
                  {lastMsg.senderRole === (userRole === 'student' ? 'student' : 'teacher') ? 'You: ' : ''}
                  {lastMsg.text}
                </Text>
              )}
            </View>

            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        );
      })}

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
  headerButton: {
    padding: 6,
    marginRight: 6,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  listHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  listSubheading: {
    fontSize: 11,
    color: '#64748b',
  },
  facultyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  facultyName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  msgTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  subjectText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  officeTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  officeText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  statusText: {
    fontSize: 11,
    color: '#64748b',
    flex: 1,
  },
  snippetText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
