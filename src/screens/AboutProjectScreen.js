// src/screens/AboutProjectScreen.js
// Drawer Screen: Architecture Breakdown & Assignment 2 Concept Verification Checklist for Viva
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

export default function AboutProjectScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'About Assignment 2',
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => {
            Alert.alert(
              'Viva Checklist',
              'All 4 React Navigation core requirements + 3 Navigator combination (Drawer, Tab, Stack) are fully implemented & ready for evaluation! ✓'
            );
          }}
        >
          <Ionicons name="checkmark-done-circle-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Assignment Header Card */}
      <View style={styles.headerCard}>
        <Text style={styles.courseTag}>FAST-NUCES • SMD ASSIGNMENT 2</Text>
        <Text style={styles.appTitle}>FLEX-Sync Companion</Text>
        <Text style={styles.appSubtitle}>React Navigation Architecture & Viva Guide</Text>
      </View>

      {/* Navigators Combination Breakdown */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>1. Navigators Combination (All 3 Used!)</Text>
        <Text style={styles.sectionDesc}>
          This application integrates a 3-tier nested React Navigation architecture:
        </Text>

        <View style={styles.navRow}>
          <View style={[styles.navBadge, { backgroundColor: '#3b82f6' }]}>
            <Text style={styles.navBadgeText}>Drawer</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.navRowTitle}>Root Drawer Navigator</Text>
            <Text style={styles.navRowDesc}>
              Controls side drawer navigation between Campus Hub, Profile, Policies & Architecture.
            </Text>
          </View>
        </View>

        <View style={styles.navRow}>
          <View style={[styles.navBadge, { backgroundColor: '#10b981' }]}>
            <Text style={styles.navBadgeText}>Tabs</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.navRowTitle}>Bottom Tab Navigator</Text>
            <Text style={styles.navRowDesc}>
              Provides 4 tabs: Schedule, Explorer, Faculty Chat, and Analytics with badge indicators.
            </Text>
          </View>
        </View>

        <View style={[styles.navRow, { borderBottomWidth: 0 }]}>
          <View style={[styles.navBadge, { backgroundColor: '#8b5cf6' }]}>
            <Text style={styles.navBadgeText}>Stack</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.navRowTitle}>Native Stack Navigators</Text>
            <Text style={styles.navRowDesc}>
              Manages deep screens (ClassDetail, ChatConversation, CourseDetail, AddSlot) with animated push/pop.
            </Text>
          </View>
        </View>
      </View>

      {/* Requirements Verification Checklist */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>2. Requirements Verification Checklist</Text>

        {/* Req 1 */}
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <View style={styles.checkContent}>
            <Text style={styles.checkTitle}>Pass data using route parameters</Text>
            <Text style={styles.checkDesc}>
              Passed via navigation.navigate('ClassDetail', {'{ classItem }'}) and ('ChatConversation', {'{ faculty }'}).
            </Text>
          </View>
        </View>

        {/* Req 2 */}
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <View style={styles.checkContent}>
            <Text style={styles.checkTitle}>Display received parameters</Text>
            <Text style={styles.checkDesc}>
              ClassDetailScreen & ChatConversationScreen display route.params with dedicated parameter inspector UI.
            </Text>
          </View>
        </View>

        {/* Req 3 */}
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <View style={styles.checkContent}>
            <Text style={styles.checkTitle}>Customize header title & options</Text>
            <Text style={styles.checkDesc}>
              Dynamic titles based on route.params (e.g. course code / instructor name), custom colors, and styled back buttons.
            </Text>
          </View>
        </View>

        {/* Req 4 */}
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <View style={styles.checkContent}>
            <Text style={styles.checkTitle}>Header buttons with meaningful actions</Text>
            <Text style={styles.checkDesc}>
              Demonstrates navigation ('+ Add Slot' button), state updating (toggle attendance in header), and alerts (venue & policy info).
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Interactive Shortcut */}
      <TouchableOpacity
        style={styles.openTabsBtn}
        onPress={() => navigation.navigate('MainTabs')}
        activeOpacity={0.8}
      >
        <Ionicons name="home-outline" size={18} color="#ffffff" />
        <Text style={styles.openTabsBtnText}>Open Main Campus Hub (Tabs)</Text>
      </TouchableOpacity>

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
  headerCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  courseTag: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  appTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  appSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 14,
    lineHeight: 18,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  navBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 2,
  },
  navBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  navRowTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  navRowDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 10,
  },
  checkContent: {
    flex: 1,
  },
  checkTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  checkDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 16,
  },
  openTabsBtn: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  openTabsBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
