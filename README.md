# FLEX-Sync: Student & Faculty Academic Companion
**Software for Mobile Devices — Assignment 2: React Navigation Architecture**  
*FAST-NUCES (Department of Computer Science)*

---

## 1. Project Overview & Application Idea
**FLEX-Sync Companion** is a mobile academic management application for FAST-NUCES students and faculty. It replaces unwieldy timetable spreadsheets with a personalized, intuitive mobile experience.

For **Assignment 2**, the application transitions from basic state-based view rendering into a full-scale **React Navigation** architecture integrating:
1. **Drawer Navigator** (`@react-navigation/drawer`)
2. **Bottom Tab Navigator** (`@react-navigation/bottom-tabs`)
3. **Native Stack Navigators** (`@react-navigation/native-stack`)

---

## 2. Assignment 2 Requirements & Implementation Mapping

All four requirements and the combination of navigators are implemented:

| # | Requirement | Implementation Details | Source Files |
|---|-------------|------------------------|--------------|
| **1** | **Pass data from one screen to another using route parameters** | • Passing `classItem` object from `MyScheduleScreen` / `ExplorerScreen` to `ClassDetailScreen`<br>• Passing `faculty` contact from `ChatListScreen` to `ChatConversationScreen`<br>• Passing `course` object from `AnalyticsScreen` to `CourseDetailScreen` | [`MyScheduleScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/MyScheduleScreen.js)<br>[`ExplorerScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/ExplorerScreen.js)<br>[`ChatListScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/ChatListScreen.js)<br>[`AnalyticsScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/AnalyticsScreen.js) |
| **2** | **Display the received parameters on destination screen** | • `ClassDetailScreen` renders `route.params.classItem` (course name, code, venue room, time, day, instructor, section, type)<br>• `ChatConversationScreen` renders `route.params.faculty` (name, designation, department, office, avatar, subject, status)<br>• `CourseDetailScreen` renders `route.params.course` (held vs attended lectures, credit hours, 80% attendance status) | [`ClassDetailScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/ClassDetailScreen.js)<br>[`ChatConversationScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/ChatConversationScreen.js)<br>[`CourseDetailScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/CourseDetailScreen.js) |
| **3** | **Customize header title and/or other header options** | • Dynamic header titles using route params: `title: route.params?.classItem?.code + ' Details'` and `title: route.params?.faculty?.name`<br>• Consistent university theme: `headerStyle: { backgroundColor: '#0f172a' }`, `headerTintColor: '#ffffff'`, `headerTitleStyle: { fontWeight: 'bold' }`<br>• Custom header back buttons and presentation styles | [`RootNavigator.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/navigation/RootNavigator.js)<br>[`ClassDetailScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/ClassDetailScreen.js) |
| **4** | **Add button to navigation header with meaningful action** | Demonstrates **all 3 types of meaningful actions** across different screens:<br>1. **Navigate to screen**: Header button `+ Add Slot` on `MyScheduleScreen` navigates to `AddSlotScreen`<br>2. **Update data**: Header button on `ClassDetailScreen` toggles session attendance (`Present` ⇄ `Absent`) and recalculates stats live<br>3. **Display Alert**: Header buttons on `ClassDetailScreen`, `ChatConversationScreen`, and `AnalyticsScreen` trigger native `Alert.alert` with room policies, faculty office hours, and FAST 80% debar rules | [`MyScheduleScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/MyScheduleScreen.js)<br>[`ClassDetailScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/ClassDetailScreen.js)<br>[`ChatConversationScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/ChatConversationScreen.js)<br>[`AnalyticsScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/AnalyticsScreen.js) |
| **5** | **Combination of Navigators (Stack + Drawer + Tab)** | Uses all three navigators seamlessly nested:<br>• **Drawer Navigator** (Root): Side menu with Custom Header, User Profile, Rules & Guide<br>• **Bottom Tab Navigator**: 4 main tabs (Schedule, Explorer, Faculty Chat, Analytics) with unread message badge<br>• **Native Stack Navigators**: 4 individual stacks handling deep push/pop transitions with route params | [`RootNavigator.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/navigation/RootNavigator.js) |

---

## 3. Navigation Hierarchy & Architecture

```
NavigationContainer
  └── RootDrawerNavigator (createDrawerNavigator)
        ├── "MainTabs" -> MainBottomTabNavigator (createBottomTabNavigator)
        │     ├── "ScheduleTab"  -> ScheduleStackNavigator (createNativeStackNavigator)
        │     │     ├── "ScheduleList" (My Classes / BCS-5B Timetable)
        │     │     │     [Header Left: Drawer Toggle | Header Right: "+ Add Slot" -> navigates to AddSlot]
        │     │     ├── "ClassDetail" (Receives & displays route.params.classItem)
        │     │     │     [Dynamic Title: Code | Header Right: Toggle Attendance data & Venue Alert]
        │     │     └── "AddSlot" (Form with validation, Header Right: Reset Form)
        │     │
        │     ├── "ExplorerTab"  -> ExplorerStackNavigator (createNativeStackNavigator)
        │     │     ├── "ExplorerList" (5-Dept Directory: CS, SE, AI, DS, CYS)
        │     │     │     [Header Left: Drawer Toggle | Header Right: "Reset" filters]
        │     │     └── "ClassDetail" (Receives route.params.classItem)
        │     │
        │     ├── "ChatTab"      -> ChatStackNavigator (createNativeStackNavigator)
        │     │     ├── "ChatList" (Faculty Connect list with live unread badge)
        │     │     │     [Header Left: Drawer Toggle | Header Right: Advisory Alert]
        │     │     └── "ChatConversation" (Receives & displays route.params.faculty)
        │     │           [Dynamic Title: Name | Header Right: Office Hours Alert dialog]
        │     │
        │     └── "AnalyticsTab" -> AnalyticsStackNavigator (createNativeStackNavigator)
        │           ├── "AnalyticsDashboard" (Attendance & Contact Hours Charts)
        │           │     [Header Left: Drawer Toggle | Header Right: Debar Policy Alert]
        │           └── "CourseDetail" (Receives & displays route.params.course)
        │                 [Dynamic Title: Code | Header Right: Debar Policy Alert]
        │
        ├── "UserProfile" Screen (Drawer Screen with Dual Persona Switcher: Student ⇄ Faculty)
        ├── "AcademicPolicy" Screen (Drawer Screen with FAST 80% Attendance & Debarment Handbook)
        └── "AboutProject" Screen (Drawer Screen with Architecture & Concept Checklist)
```

---

## 4. Viva Evaluation Guide (Q&A for Class Presentation)

Be prepared to answer these questions during the class evaluation:

### Q1: How did you pass data between screens?
> **Answer**:  
> In React Navigation, we pass data using the second argument of `navigation.navigate()`.  
> For example, in [`MyScheduleScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/MyScheduleScreen.js):
> ```javascript
> navigation.navigate('ClassDetail', { classItem: item });
> ```
> And on [`ClassDetailScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/ClassDetailScreen.js), we extract it using `route.params`:
> ```javascript
> const { classItem } = route.params || {};
> ```

### Q2: How did you dynamically customize the header title and options?
> **Answer**:  
> We use both `options={({ route }) => ({ title: ... })}` in navigator configuration and `navigation.setOptions()` inside screen components using `useLayoutEffect`.  
> In [`RootNavigator.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/navigation/RootNavigator.js):
> ```javascript
> options={({ route }) => ({
>   title: route.params?.classItem ? `${route.params.classItem.code} Details` : 'Class Details',
> })}
> ```
> And in [`ChatConversationScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/ChatConversationScreen.js):
> ```javascript
> useLayoutEffect(() => {
>   navigation.setOptions({
>     title: faculty.name,
>   });
> }, [navigation, faculty]);
> ```

### Q3: What meaningful actions do your navigation header buttons perform?
> **Answer**:  
> We implemented all three requested types:
> 1. **Navigating to another screen**: In `MyScheduleScreen`, the header button `+ Add Slot` runs `navigation.navigate('AddSlot')`.
> 2. **Updating data**: In `ClassDetailScreen`, the checkmark header button updates the class attendance status (`present` or `absent`) in global state and triggers instant feedback.
> 3. **Displaying an alert**: In `ClassDetailScreen`, `ChatConversationScreen`, and `AnalyticsScreen`, header buttons trigger native `Alert.alert()` modal dialogs containing venue instructions, teacher office consultation hours, and university attendance rules.

### Q4: How are your navigators combined?
> **Answer**:  
> We combined all three:
> • At the top level, we have a **Drawer Navigator** with custom drawer content (persona switcher and user info).
> • The primary drawer route is `MainTabs`, which is a **Bottom Tab Navigator** with 4 tabs (Schedule, Explorer, Chat, Analytics).
> • Each tab is its own **Native Stack Navigator**, allowing screens to push detail views (`ClassDetail`, `ChatConversation`, `CourseDetail`, `AddSlot`) onto the stack with animated back navigation.

---

## 5. How to Run the Application

```bash
# Navigate to the project directory
cd flex-sync

# Start Expo development server
npx expo start
```

Press:
- `a` to run on Android emulator or connected device via Expo Go.
- `i` to run on iOS simulator.
- `w` to run in web browser.
- Scan QR code using the Expo Go mobile app.
