// src/navigation/RootNavigator.js
// Complete React Navigation Architecture combining:
// 1. Root Drawer Navigator (@react-navigation/drawer)
// 2. Bottom Tab Navigator (@react-navigation/bottom-tabs)
// 3. Native Stack Navigators (@react-navigation/native-stack)
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../context/AppContext';
import CustomDrawerContent from '../components/CustomDrawerContent';

// Screen imports
import MyScheduleScreen from '../screens/MyScheduleScreen';
import ClassDetailScreen from '../screens/ClassDetailScreen';
import AddSlotScreen from '../screens/AddSlotScreen';
import ExplorerScreen from '../screens/ExplorerScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatConversationScreen from '../screens/ChatConversationScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import AcademicPolicyScreen from '../screens/AcademicPolicyScreen';
import AboutProjectScreen from '../screens/AboutProjectScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const ScheduleStack = createNativeStackNavigator();
const ExplorerStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
const AnalyticsStack = createNativeStackNavigator();

// Common Stack Header Styling
const commonHeaderOptions = {
  headerStyle: {
    backgroundColor: '#0f172a',
  },
  headerTintColor: '#ffffff',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  headerBackTitleVisible: false,
};

// 1. Schedule Stack Navigator
function ScheduleStackNavigator() {
  return (
    <ScheduleStack.Navigator screenOptions={commonHeaderOptions}>
      <ScheduleStack.Screen
        name="ScheduleList"
        component={MyScheduleScreen}
        options={{ title: 'My Schedule' }}
      />
      <ScheduleStack.Screen
        name="ClassDetail"
        component={ClassDetailScreen}
        options={({ route }) => ({
          title: route.params?.classItem ? `${route.params.classItem.code} Details` : 'Class Details',
        })}
      />
      <ScheduleStack.Screen
        name="AddSlot"
        component={AddSlotScreen}
        options={{
          title: 'Add Lecture Slot',
          presentation: 'card',
        }}
      />
    </ScheduleStack.Navigator>
  );
}

// 2. Explorer Stack Navigator
function ExplorerStackNavigator() {
  return (
    <ExplorerStack.Navigator screenOptions={commonHeaderOptions}>
      <ExplorerStack.Screen
        name="ExplorerList"
        component={ExplorerScreen}
        options={{ title: 'Campus Explorer' }}
      />
      <ExplorerStack.Screen
        name="ClassDetail"
        component={ClassDetailScreen}
        options={({ route }) => ({
          title: route.params?.classItem ? `${route.params.classItem.code} Details` : 'Class Details',
        })}
      />
    </ExplorerStack.Navigator>
  );
}

// 3. Chat Stack Navigator
function ChatStackNavigator() {
  return (
    <ChatStack.Navigator screenOptions={commonHeaderOptions}>
      <ChatStack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ title: 'Faculty Connect' }}
      />
      <ChatStack.Screen
        name="ChatConversation"
        component={ChatConversationScreen}
        options={({ route }) => ({
          title: route.params?.faculty ? route.params.faculty.name : 'Conversation',
        })}
      />
    </ChatStack.Navigator>
  );
}

// 4. Analytics Stack Navigator
function AnalyticsStackNavigator() {
  return (
    <AnalyticsStack.Navigator screenOptions={commonHeaderOptions}>
      <AnalyticsStack.Screen
        name="AnalyticsDashboard"
        component={AnalyticsScreen}
        options={{ title: 'Academic Analytics' }}
      />
      <AnalyticsStack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={({ route }) => ({
          title: route.params?.course ? `${route.params.course.code} Metrics` : 'Course Details',
        })}
      />
    </AnalyticsStack.Navigator>
  );
}

// 5. Main Bottom Tab Navigator (combining 4 stacks with badges and icons)
function MainTabNavigator() {
  const { unreadCount } = useApp();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ScheduleTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'ExplorerTab') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'ChatTab') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'AnalyticsTab') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="ScheduleTab"
        component={ScheduleStackNavigator}
        options={{ tabBarLabel: 'Schedule' }}
      />
      <Tab.Screen
        name="ExplorerTab"
        component={ExplorerStackNavigator}
        options={{ tabBarLabel: 'Explorer' }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatStackNavigator}
        options={{
          tabBarLabel: 'Faculty Chat',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <Tab.Screen
        name="AnalyticsTab"
        component={AnalyticsStackNavigator}
        options={{ tabBarLabel: 'Analytics' }}
      />
    </Tab.Navigator>
  );
}

// Helper to add drawer toggle button to drawer screen headers
function drawerHeaderOptions(title) {
  return ({ navigation }) => ({
    ...commonHeaderOptions,
    title,
    headerLeft: () => (
      <TouchableOpacity
        style={{ padding: 6, marginLeft: 12 }}
        onPress={() => navigation.openDrawer()}
        accessibilityLabel="Open Navigation Drawer"
      >
        <Ionicons name="menu" size={24} color="#ffffff" />
      </TouchableOpacity>
    ),
  });
}

// 6. Master Root Drawer Navigator
export default function RootNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#eff6ff',
        drawerActiveTintColor: '#2563eb',
        drawerInactiveTintColor: '#475569',
        drawerLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          marginLeft: -8,
        },
        drawerItemStyle: {
          borderRadius: 10,
          marginVertical: 3,
        },
      }}
    >
      {/* 1. Campus Hub (Contains Bottom Tabs + All 4 Stacks) */}
      <Drawer.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{
          drawerLabel: 'Campus Hub (Tabs)',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={20} color={color} />
          ),
        }}
      />

      {/* 2. Academic Profile */}
      <Drawer.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={({ navigation }) => ({
          ...drawerHeaderOptions('Academic Profile')({ navigation }),
          headerShown: true,
          drawerLabel: 'Academic Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={20} color={color} />
          ),
        })}
      />

      {/* 3. FAST Attendance Policy */}
      <Drawer.Screen
        name="AcademicPolicy"
        component={AcademicPolicyScreen}
        options={({ navigation }) => ({
          ...drawerHeaderOptions('Attendance Regulations')({ navigation }),
          headerShown: true,
          drawerLabel: 'Attendance Policy (80%)',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark-outline" size={20} color={color} />
          ),
        })}
      />

      {/* 4. Assignment 2 Architecture Guide & Checklist */}
      <Drawer.Screen
        name="AboutProject"
        component={AboutProjectScreen}
        options={({ navigation }) => ({
          ...drawerHeaderOptions('Assignment 2 Architecture')({ navigation }),
          headerShown: true,
          drawerLabel: 'Assignment 2 Guide',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="code-slash-outline" size={20} color={color} />
          ),
        })}
      />
    </Drawer.Navigator>
  );
}
