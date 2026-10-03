# FLEX-Sync: Student & Faculty Academic Companion
**Software for Mobile Devices (Assignment 1) — FAST-NUCES**

---

## 1. Problem Statement & Proposed Solution
At our university, students and faculty face two significant logistical challenges every semester:
1. **The Timetable Spreadsheet Nightmare**: Timetables are published across massive, complex 50-column spreadsheets (Google Sheets / PDFs) containing hundreds of rows for multiple departments, sections, and room allocations. On mobile, finding your room, section, or lecture timing requires constant zooming and panning.
2. **The Student-Teacher Communication Delay**: Students often wait days for email replies, while teachers feel uncomfortable sharing personal phone numbers or creating unofficial WhatsApp groups with hundreds of students.

**FLEX-Sync** is a mobile companion prototype that reimagines the university student portal (FLEX) to provide:
1. **Personalized Timetable View**: Displays the schedule for Section `BCS-5B` with designated instructors and rooms across all weekdays (Mon–Fri) from structured mock data.
2. **1-Tap Dual Persona Switcher** (`🎓 Student` ⇄ `👨‍🏫 Faculty`): Allows instructors (e.g. Dr. Farhan Ali) to switch perspectives and inspect where they teach across campus.
3. **'Faculty Connect' (1-on-1 Academic Chat Prototype)**: A simulated messaging directory where students can message faculty contacts in local React state with dynamic `[🔵 NEW]` and `[✓ SEEN]` delivery flags.
4. **5-Department Campus Explorer** (`CS`, `SE`, `AI`, `DS`, `CYS`): Real-time search and filter by teacher, course, room, or section.
5. **Academic Analytics Dashboard** using `react-native-chart-kit`:
   - **Weekly Workload Bar Chart**: Daily contact hours for students, daily teaching hours for faculty (calculated from exact start/end time intervals).
   - **Progress Rings**: Course attendance for students with dynamic threshold coloring, section-wise class health for faculty.
6. **Mathematical Attendance Tracking**: A sound formula:
   $$\text{Attendance \%} = \text{round}\left(\frac{\text{Attended Lectures}}{\text{Total Held Lectures}} \times 100\right)$$
   Supports 3-state tracking (`Attended ✓`, `Missed ✕`, and `Scheduled / Pending`).
7. **Add/Makeup Slot Form**: Form inputs with time-format validation (`HH:MM - HH:MM AM/PM`) and **mathematical interval-overlap clash detection**:
   $$\text{Overlap} \iff \text{Start}_A < \text{End}_B \land \text{Start}_B < \text{End}_A$$
8. **Pure React State Navigation:** Strictly adheres to the assignment rule prohibiting external navigation libraries — view switching is handled entirely via pure React `useState`.

> [!NOTE]
> **Prototype Scope:** This application is a client-side React Native prototype designed for evaluation against the assignment rubric. Timetable data, attendance states, and chat messages are maintained in local React component state (`useState` in `App.js`) without an external backend or persistent database. Full application reload restores the baseline state.

---

## 2. Key Features & Screens

### 📅 View 1: My Classes / My Lectures (Personalized Timetable)
- **Student Mode**: Enrolled courses, timings, rooms, and instructor names for Section `BCS-5B`.
- **Faculty Mode**: Teaching schedule for Dr. Farhan Ali across sections (`BCS-5A`, `BCS-5B`).
- Day switcher (`All`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`).
- 3-state attendance buttons (`✓ Present`, `✕ Absent`, `Scheduled`).

### 💬 View 2: Faculty Connect (1-on-1 Academic Chat Prototype)
- Faculty contact list array with office numbers, subject names, and campus status.
- Dedicated 1-on-1 chat room with speech bubbles and delivery timestamps.
- **Cross-Persona Simulation**: When a student messages Dr. Farhan Ali, Dr. Farhan sees a **`🔵 NEW`** flag next to the student's name in faculty mode. Opening the chat updates the badge to **`✓ SEEN`** (in-memory state).

### 🏛️ View 3: All Departments (Campus Explorer)
- Instant filtering across all 5 university departments:
  - **CS**: Computer Science
  - **SE**: Software Engineering
  - **AI**: Artificial Intelligence
  - **DS**: Data Science
  - **CYS**: Cyber Security
- Real-time search bar filtering by Course Name, Code, Instructor, Room, or Section.
- Reusable empty state handling when no classes match.

### 📊 View 4: Academic Analytics (Charts Dashboard)
- **Chart 1 — Bar Chart**: Displays daily lecture contact hours for students, or daily teaching hours for faculty.
- **Chart 2 — Progress Chart**: Multi-ring progress chart displaying attendance percentages per registered subject for students, or section-wise attendance health for faculty.
- **Smart Debar Watchlist**: Dynamically warns students when any subject drops below the mandatory 80% threshold.

### ➕ View 5: Add Custom / Makeup Slot (Form with Validation)
- Built-in React Native inputs (`TextInput`, `TouchableOpacity`).
- Preset timing pills for quick selection.
- Strict time format validation (`HH:MM - HH:MM AM/PM`).
- **Interval-Overlap Room Clash Detector**: Accurately prevents room double-booking only if times actually overlap.

---

## 3. Project Architecture & File Organization

```
flex-sync/
├── App.js                      # Root component: handles role state, view switching, and data updates
├── app.json                    # Expo project configuration
├── package.json                # Project dependencies (Expo SDK 57, React Native 0.86)
├── README.md                   # Complete project documentation
├── VIVA_GUIDE.md               # 5-minute Viva defense notes & live coding cheat sheet
├── AI_USAGE_REPORT.md          # Assignment AI usage report for rubric marks
└── src/
    ├── data/
    │   └── mockData.js         # Student profile (BCS-5B), faculty directory, timetable, messages
    ├── components/
    │   ├── Header.js           # Student/Faculty toggle & state-based tab switcher
    │   ├── ClassCard.js        # Reusable card with 3-state attendance marker
    │   └── EmptyState.js       # Reusable fallback for empty search/day filters
    └── screens/
        ├── MyScheduleScreen.js # Student & faculty timetable view
        ├── ExplorerScreen.js   # 5-department timetable explorer view
        ├── ChatScreen.js       # 1-on-1 Faculty Connect chat with NEW/SEEN flags
        ├── AnalyticsScreen.js  # react-native-chart-kit Workload Bar & Progress charts
        └── AddSlotScreen.js    # Form with interval overlap clash detection & time validation
```

---

## 4. How to Run the Application

### Prerequisites:
- **Node.js 22.13.x or higher** (Required by Expo SDK 57).
- Expo Go app installed on your physical mobile phone (Android / iOS) or modern browser.

### Steps:
1. Open a terminal inside the project directory:
   ```bash
   cd flex-sync
   ```
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
   *(Or run `npm run web` to preview directly in your browser, or `npm run tunnel` for cross-network mobile testing).*
