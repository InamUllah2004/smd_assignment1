# AI Usage & Critical Thinking Report
**Software for Mobile Devices (Assignment 1) — Open-Ended AI-Assisted Project**
**FAST-NUCES Karachi Campus**

---

## 1. Project Title & Student Information
- **Project Title:** FLEX-Sync: Student & Faculty Timetable & Academic Companion
- **Student Name:** Muhammad Hamza Tariq
- **Roll Number:** 22K-3104
- **Section / Department:** BCS-5B / Computer Science

---

## 2. Tools & AI Systems Used
- **Antigravity (Gemini 3.8 Flash)**: Used for architecture ideation, problem-solving, UI structuring, and drafting initial component templates.
- **Node / Expo Toolchain (`v22.17.0` / Expo SDK `57.0.26`)**: Used for local bundling, testing, linting (`npx expo-doctor`), and browser/mobile preview verification.

---

## 3. Areas of AI Assistance & Critical Student Interventions

The assignment brief encourages AI-assisted development provided that all AI suggestions are critically reviewed, tested, validated, and adapted to meet course constraints and real-world accuracy. Below is a detailed breakdown of critical interventions where the student intervened, modified, or completely overrode AI proposals:

| Development Phase | What AI Assisted With | Critical Student Review, Interventions & Overrides |
| :--- | :--- | :--- |
| **Ideation & Problem Scoping** | Brainstorming generic student portal utility ideas (e.g., GPA calculator, fee challan tracker). | **Overrode generic ideas:** Focused directly on the single most frustrating daily campus problem: navigating unwieldy 50-column timetable spreadsheets on mobile phones, and the student-teacher communication gap. |
| **Navigation & Architecture** | AI initially recommended React Navigation bottom tabs (`@react-navigation/bottom-tabs`) and drawer navigation. | **Strictly Rejected AI Proposal:** Caught the explicit assignment prohibition against external navigation libraries and side/bottom navigation. Enforced pure React `useState` view switching and declarative conditional rendering in `App.js` to avoid negative marking. |
| **Attendance Tracking Math** | AI initially implemented a naive `+2% / -2%` percentage increment upon class toggle, regardless of actual class count. | **Replaced Naive Hack with Mathematical Model:** Recognized that toggling classes back and forth inflated attendance artificially. Replaced it with a sound academic calculation: $$\text{Attendance \%} = \text{round}\left(\frac{\text{attendedLectures}}{\text{heldLectures}} \times 100\right)$$ Marking a pending class absent increments `heldLectures` without increasing `attendedLectures`, accurately dropping the percentage. |
| **Room Clash Detection** | AI initially blocked an entire room for the whole day if any slot existed, regardless of timing. | **Implemented Interval Overlap Math:** Upgraded detection to compare exact start and end times converted to minutes from midnight using: $$\text{Overlap} \iff \text{Start}_A < \text{End}_B \land \text{Start}_B < \text{End}_A$$ Now, booking Room 204 at 2:00 PM is correctly allowed when the existing class in Room 204 ends at 11:30 AM. |
| **Workload Duration Math** | AI assigned arbitrary constant weights (1.5h for theory, 3.0h for lab) in analytics. | **Implemented Exact Time Difference Parser:** Tuesday's schedule (08:30–09:50, 10:00–11:20, 11:30–02:20) was showing 6.0h instead of its real 5.5h. Implemented `calculateClassDurationHours` to calculate exact duration $\frac{\text{endMin} - \text{startMin}}{60}$, giving mathematically exact totals. |
| **Faculty Connect Messaging** | AI suggested a simple message view with no distinction between student and teacher perspectives. | **Architected 1-on-1 Academic Directory with Unread Flags:** Structured a multi-faculty directory (`FACULTY_LIST`) and individual 1-on-1 chat rooms. Added stateful delivery flags (`[🔵 NEW]` and `[✓ SEEN]`) that update when faculty opens the student's conversation. |
| **Faculty Analytics Persona Isolation** | AI displayed student course attendance rings even when the app was toggled to Faculty mode. | **Isolated Persona Analytics:** Rewrote the analytics data feeder so faculty sees Section Attendance Health (`BCS-5A: 85%`, `BCS-5B: 88%`, `Lab: 92%`), titled appropriately, while students see their individual enrolled courses. |

---

## 4. Manual Test Matrix & Verification Evidence

To ensure submission readiness and verify that all edge cases, validations, and mathematical calculations behave accurately, the following manual test suite was executed:

| Test ID | Feature Tested | Test Input / Action Taken | Expected Result | Actual Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Time Format Validation** | In *Add Slot*, entered `8:30 - 10:00` (missing AM/PM). | Submission rejected; feedback banner: *"Invalid time format. Please use format "HH:MM - HH:MM AM/PM" (e.g. "10:00 - 11:20 AM") and ensure the end time is after the start time."* | Red error banner displayed; submission rejected; slot not added. | **PASS** |
| **TC-02** | **Room Clash Detection (Overlapping)** | Added slot on Tuesday in **Room 204** with time `09:00 AM - 10:30 AM` (existing slot is 08:30–09:50 AM). | Form blocked; feedback banner: *"Room 204 is already booked on Tuesday (08:30 AM - 09:50 AM)"*. | Overlap detected and blocked; slot not added. | **PASS** |
| **TC-03** | **Room Clash Detection (Non-Overlapping)** | Added slot on Tuesday in **Room 204** with time `02:30 PM - 04:00 PM`. | Form accepted; slot added to schedule list; success banner displayed. | Slot successfully added; no false clash triggered. | **PASS** |
| **TC-04** | **Attendance Decrement on Absence** | In *My Classes*, marked pending class as **Absent**. | `heldLectures` increments by 1, `attendedLectures` remains constant, attendance % drops (e.g., from 83% to 80%). | Attendance dropped to 80%; Progress ring dynamically reflected change. | **PASS** |
| **TC-05** | **1-on-1 Faculty Chat Unread Flag** | As Student, sent message to Dr. Farhan Ali. Switched persona to Faculty. | Faculty sees `[🔵 NEW]` badge next to student. Clicking to open updates badge to `[✓ SEEN]`. | `[🔵 NEW]` displayed, changed to `[✓ SEEN]` upon viewing conversation. | **PASS** |
| **TC-06** | **Dual Persona Schedule Isolation** | Switched persona from Student (`BCS-5B`) to Faculty (`Dr. Farhan Ali`). | Student view shows 5 courses for BCS-5B; Faculty view shows only Dr. Farhan's lectures across sections. | Schedules filtered cleanly with no data leakage between roles. | **PASS** |
| **TC-07** | **Dynamic Course Threshold in Ring Chart** | Changed `threshold` for CS-307 from 80% to 75% in `mockData.js`. | Alert banner disappears; progress ring for CS-307 turns from danger red to emerald green based on course threshold. | Banner hidden; ring colored green dynamically. | **PASS** |
| **TC-08** | **Duration Calculation Fallback** | Added slot with unparseable time format string in schedule. | Workload parser returns `0h` instead of silently misrepresenting as 1.5h. | Unparseable duration disregarded (0h); totals remain exact. | **PASS** |

---

## 5. Scope & Prototype Acknowledgment
- **Client-Side Prototype**: All state (timetable modifications, attendance records, messages, delivery flags) is held in React state (`useState`) within `App.js`. As this is a front-end React Native prototype demonstrating core mobile UI/UX and logic, state resets on complete app refresh.
- **Expo SDK 57 Compatibility**: Verified in the local environment using `npx expo-doctor`, passing 21/21 configuration checks with zero warnings or deprecation errors.

---

## 6. Code Understanding & Authorship Statement
I, **Muhammad Hamza Tariq (22K-3104)**, affirm that:
1. Every component, screen, calculation, and state hook in this application has been reviewed line-by-line and tested personally.
2. I fully understand the architecture and can explain or modify any part of the code on-the-spot during the 5-minute viva.
3. The AI was used as a productivity assistant and architectural sounding board, not a substitute for critical thinking, domain requirements, or course policy compliance.
