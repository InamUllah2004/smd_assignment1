# 5-Minute Viva & Live Modification Preparation Guide
**Comprehensive Technical Defense & Code Walkthrough**

This guide prepares you for questions and live coding modifications the instructor or TA may ask during your 5-minute viva.

---

## 1. Application Overview & Creative Problem Solved
**Question: "What problem does your application solve and what makes it creative?"**
> **Your Answer:**
> "We reimagined the university student portal (FLEX) as a mobile companion prototype to solve two real daily campus pain points:
> 1. **The Timetable Spreadsheet Nightmare**: Timetables are given as 50-column Google Sheets that are impossible to navigate on phones. FLEX-Sync organizes personalized schedules with rooms and instructors for students (`BCS-5B`) AND faculty (`Dr. Farhan Ali`), with a 5-department campus explorer (`CS`, `SE`, `AI`, `DS`, `CYS`).
> 2. **The Student-Teacher Communication Barrier**: Students wait days for email replies, while teachers feel uncomfortable sharing personal phone numbers/WhatsApp with hundreds of students. We prototyped **'Faculty Connect'**, a simulated 1-on-1 academic messaging directory where students can message faculty directly with simulated `[🔵 NEW]` and `[✓ SEEN]` delivery flags without exposing private numbers or personal emails."

---

## 2. Application Structure (1 Minute)
**Question: "Explain the main components and how your application is organized."**
> **Your Answer:**
> "The code is strictly modular and built using pure React Native state (no third-party navigation libraries):
> - **`App.js`**: Holds the core state:
>   - `userRole`: `'student'` | `'teacher'` (toggles persona with 1 tap)
>   - `activeTab`: `'mySchedule'` | `'explorer'` | `'chat'` | `'analytics'` | `'addSlot'`
>   - `messages`: Array of 1-on-1 academic chat objects with `isRead` flags
>   - `timetable` and `student`: Enrolled and university datasets
> - **`src/data/mockData.js`**: Contains structured mock models for the student (`Hamza Tariq`), teacher (`Dr. Farhan Ali`), faculty directory (`FACULTY_LIST`), initial messages, and 5-department timetable.
> - **`src/components/`**:
>   - `Header.js`: Displays user profile, the 1-tap persona toggle (`🎓 Student` ⇄ `👨‍🏫 Faculty`), and the 5-tab view switcher.
>   - `ClassCard.js`: Reusable card representing a class with time, room, teacher, and 3-state attendance buttons (`✓ Present`, `✕ Absent`, `Pending`).
>   - `EmptyState.js`: Reusable fallback when search or day filter returns no results.
> - **`src/screens/`**:
>   - `MyScheduleScreen.js`: Displays personal classes (student) or teaching slots (faculty).
>   - `ExplorerScreen.js`: Multi-department schedule browser with search.
>   - `ChatScreen.js`: 1-on-1 Faculty Connect messaging directory with unread/seen flags.
>   - `AnalyticsScreen.js`: `react-native-chart-kit` dashboard (exact teaching/study workload and attendance rings).
>   - `AddSlotScreen.js`: Form with time format validation and interval-overlap room clash detection."

---

## 3. React Concepts & View Switching (1 Minute)
**Question: "Explain how view switching works without navigation libraries, and where state/props are used."**
> **Your Answer:**
> "To comply with the assignment rule prohibiting side or bottom navigation bars, view switching is handled through React `useState`:
> ```javascript
> const [activeTab, setActiveTab] = useState('mySchedule');
> ```
> In `App.js`, we pass `activeTab` and `setActiveTab` to `<Header />`. When a tab is pressed, `setActiveTab` updates the state, and `App.js` conditionally renders the corresponding screen:
> ```javascript
> {activeTab === 'mySchedule' && <MyScheduleScreen ... />}
> {activeTab === 'chat' && <ChatScreen ... />}
> ```
> Props are passed downward unidirectionally to child components."

---

## 4. JavaScript / Data Handling (1 Minute)
**Question: "Explain how you handle data filtering, mapping, and calculations."**
> **Your Answer:**
> "We make extensive use of JavaScript ES6 array methods and sound mathematical formulas:
> 1. **Dual Persona Filtering (`.filter()`)**:
>    In `MyScheduleScreen.js`, if `userRole === 'teacher'`, we filter `timetable.filter(c => c.instructor === teacher.name)`. If `student`, we filter `c.section === student.section`.
> 2. **Mathematical Attendance Formula**:
>    We calculate:
>    $$\text{Attendance \%} = \text{round}\left(\frac{\text{attendedLectures}}{\text{heldLectures}} \times 100\right)$$
>    When a student marks an upcoming class absent, `heldLectures` increments by 1 while `attendedLectures` remains the same, accurately dropping the percentage without inflation.
> 3. **Exact Workload Duration Math**:
>    In `AnalyticsScreen.js`, `calculateClassDurationHours` converts `start` and `end` times into minutes from midnight, computing exact decimal hours: $\frac{\text{endMin} - \text{startMin}}{60}$. For Tuesday: 1.33h + 1.33h + 2.83h = **5.5h** (exact to the minute!).
> 4. **Interval-Overlap Room Clash Detection**:
>    In `AddSlotScreen.js`, two slots overlap only if:
>    $$\text{Start}_A < \text{End}_B \land \text{Start}_B < \text{End}_A$$
>    Adding a class in the same room at a non-overlapping time (e.g. 2:00 PM) is permitted."

---

## 5. Live Modification Cheat Sheet (1 Minute — 5 Marks)
During the viva, the instructor may ask you to make a small live change:

### Modification A: "Change the default starting persona to Faculty"
- **File**: [`App.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/App.js#L19)
- **Change**: Change `useState('student')` to `useState('teacher')`.

### Modification B: "Change attendance warning threshold from 80% to 75%"
- **File**: [`src/data/mockData.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/data/mockData.js)
- **Change**: In `CURRENT_STUDENT.registeredCourses`, change `threshold: 80` to `threshold: 75` for `CS-307` (Database Systems).
- **Explain the ripple effect in UI**:
  1. `CS-307` has 77% attendance. With threshold at 80%, it was flagged as at-risk. With threshold at 75%, `c.attendance < c.threshold` becomes false.
  2. The red Debar Warning Banner automatically disappears.
  3. In `AnalyticsScreen.js`, the Progress Ring for `CS-307` dynamically turns from red (`#dc2626`) to emerald green (`#10b981`) because the chart color callback references `course.threshold`.
  4. The breakdown table updates its target label from `Min 80%` to `Min 75%`.

### Modification C: "Add a new initial chat message"
- **File**: [`src/data/mockData.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/data/mockData.js)
- **Change**: Add an object into `INITIAL_MESSAGES`:
  ```javascript
  {
    id: `msg-${Date.now()}`,
    facultyId: 'FAC-102',
    studentId: '22K-3104',
    senderRole: 'teacher',
    senderName: 'Dr. Farhan Ali',
    text: 'Office hours today from 2 PM to 4 PM in Room 204.',
    time: 'Today 11:00 AM',
    isRead: false,
  },
  ```

### Modification D: "Filter schedule to show only Lab sessions"
- **File**: [`src/screens/MyScheduleScreen.js`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/src/screens/MyScheduleScreen.js)
- **Change**: In the `.filter()` condition, add `&& item.type === 'Lab'`.
