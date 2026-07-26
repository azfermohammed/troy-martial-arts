# Portal roadmap

100 candidate features, grouped by who they serve. Nothing here is committed —
it is a menu to pick from.

Marked items:

- **[built]** — shipped
- **[next]** — recommended next, high value for the effort
- **[needs data]** — blocked until the school supplies real information
- **[needs backend]** — cannot work while the portal is localStorage-only

---

## Front desk / admin

1. **[built]** Trial leads inbox — read the signups the public form captures
2. **[next]** Mark a lead contacted / booked / lost
3. **[next]** Lead notes and follow-up date
4. Convert a lead straight into a student record
5. Lead source tracking (walk-in, web, referral, the $19 card)
6. Duplicate-lead detection on phone or email
7. **[built]** CSV export of students, payments, attendance
8. Bulk import students from CSV
9. Global search across students, payments and leads
10. Saved filters ("overdue adults", "testing this month")
11. Bulk actions — mark paid, deactivate, message
12. Undo for destructive actions
13. Soft delete with a restore window
14. Audit log of who changed what
15. **[needs backend]** Staff accounts with real passwords
16. **[needs backend]** Role editing without a code change
17. Sibling / family grouping on accounts
18. Household billing — one invoice, several students
19. Birthday list for the month
20. Anniversary list (years training)
21. Waiver signed / not signed flag
22. Medical notes and allergies on the student record
23. Emergency contacts
24. Photo-release permission flag
25. Student photos on the roster
26. Inactive-student win-back list
27. Attendance-drop alert (was regular, now absent)
28. Capacity warnings per class
29. Printable class rosters
30. Printable promotion slips
31. Front-desk day view — who is expected today
32. Walk-in check-in for a student who forgot their phone

## Money

33. Recurring tuition schedules
34. **[needs backend]** Card payments / autopay
35. Payment plans and instalments
36. Partial payments against an invoice
37. Late fees
38. Family and sibling discounts
39. The $19 referral card as a redeemable code
40. Trial-to-membership conversion tracking
41. Refunds and credits
42. Receipt PDFs
43. Revenue by month chart
44. Revenue by category — tuition, gear, testing, tournaments
45. Outstanding-balance ageing (30/60/90 days)
46. Failed-payment retry list
47. Gear sales — sparring kit is $189/$199
48. Testing fees tied to promotions
49. Tournament fees — $75 with family discounts
50. Annual revenue forecast from active memberships

## Instructors

51. **[next]** Class roster from a phone, attendance in one tap
52. Mark yourself as covering a class
53. Substitute requests and swaps
54. My teaching schedule for the week
55. Hours taught, for payroll
56. Private notes on a student
57. Flag a student as ready to test
58. **[built]** Issue a promotion slip
59. Curriculum checklist per belt
60. Record a form or technique as passed
61. Sparring pairings for a class
62. Injury / incident log
63. Class plan notes shared between instructors
64. Assistant assignments per class
65. Instructor announcements to their own classes

## Students and parents

66. **[built]** Attendance streak and history heatmap
67. **[built]** Classes attended toward the next belt
68. **[next]** Self check-in on arrival
69. **[next]** Announcements from the school
70. Which classes suit my belt this week
71. Add a class to my phone calendar
72. Reminders before class
73. Parent view covering several children
74. Belt certificate downloads
75. Curriculum for my current belt — what I must know
76. Video library of forms for my rank
77. Testing dates and what to bring
78. Tournament sign-up — March and September
79. Event calendar including the annual picnic
80. Gear ordering
81. Update my own contact details
82. Pause or freeze membership
83. Refer a friend
84. **[needs data]** Progress against the school's real class requirement
85. Personal bests and milestones
86. Attendance goals

## Communication

87. School-wide announcements
88. Announcements targeted by belt, class or role
89. **[needs backend]** Email and SMS rather than in-portal only
90. Absence notifications to parents
91. Class cancellation alerts
92. Automated payment reminders
93. Birthday messages
94. Post-trial follow-up sequence
95. Read receipts on announcements

## Reporting

96. Attendance rate by class — which times actually fill
97. Retention curve by belt — where students drop out
98. Average time at each belt, measured from real data
99. Trial conversion rate
100. Enrolment trend over time

---

## What is actually blocking

**localStorage is the ceiling.** Data lives in one browser. Two people cannot
share a roster, and clearing site data wipes the school's records. Anything
marked **[needs backend]** — realistically most of the money and communication
sections — needs a real database first. That is the highest-value work on this
list, and none of the 100 items above substitute for it.

**The class requirement is still unknown.** Promotion projections run on
placeholder numbers until the school supplies its per-belt class counts. See
`src/lib/portal/promotion.ts`.
