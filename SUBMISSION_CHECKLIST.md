# Student Pre-Flight Submission Checklist
**Software for Mobile Devices (Assignment 1)**

This checklist outlines the final submission steps for the student to execute personally on their system before submitting to Google Classroom (GCR):

> [!NOTE]
> **Repository vs. External Submission Workflow:** The codebase, documentation, test matrix, and Expo health checks are complete within this repository. The unchecked action items below (capturing app screenshots from device/browser, pushing to private GitHub, and turning in on GCR) are external steps for the student to complete during final submission.

---

## 1. Deliverables Required by Section 12 of PDF

- [x] **Source Code**: Fully implemented in `flex-sync/`.
- [x] **README Documentation**: Up-to-date with Node 22 prerequisite, architecture, and feature descriptions.
- [x] **AI Usage Report**: Completed in [`AI_USAGE_REPORT.md`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/AI_USAGE_REPORT.md).
- [ ] **Screenshots / Short Video**: Take 4 screenshots of the app in action:
  1. **Screenshot 1**: *My Classes* tab showing Section BCS-5B schedule with the 3-state attendance buttons.
  2. **Screenshot 2**: *Faculty Connect* tab showing the Faculty directory and a 1-on-1 chat with the `[🔵 NEW]` flag.
  3. **Screenshot 3**: *Analytics* tab showing the Bar Chart (Workload) and Progress Rings (Attendance).
  4. **Screenshot 4**: *Add Slot* tab showing the form with preset timing pills and interval clash detection.
- [ ] **Push to Private GitHub Repository**:
  ```bash
  cd "c:\Users\MP\Downloads\smd Assignment\flex-sync"
  git init
  git add .
  git commit -m "Complete FLEX-Sync assignment submission"
  # Push to your private GitHub repo
  ```
  *(Remember: Keep the repo **Private** as instructed in the PDF until the deadline passes!)*
- [ ] **Google Classroom (GCR)**: Submit your GitHub repository link and upload your screenshots.

---

## 2. 5-Minute Viva Defense Reminders
Keep [`VIVA_GUIDE.md`](file:///c:/Users/MP/Downloads/smd%20Assignment/flex-sync/VIVA_GUIDE.md) open during your preparation. It contains line-by-line cheat sheets for:
- Explaining how view switching works via React `useState` without navigation libraries.
- Explaining the mathematical attendance formula: $\frac{\text{attendedLectures}}{\text{totalLectures}} \times 100$.
- Explaining the interval overlap condition: $\text{start}_A < \text{end}_B \land \text{start}_B < \text{end}_A$.
- Live modifications (e.g. changing threshold from 80% to 75% in `src/data/mockData.js`).
