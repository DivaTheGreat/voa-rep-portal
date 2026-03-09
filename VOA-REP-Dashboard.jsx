import { useState } from "react";

const MEMBERS = [
  { id: 1, name: "Amara Osei", avatar: "AO", streak: 14, goalsComplete: 3, goalsTotal: 5, hours: 12, book: 68 },
  { id: 2, name: "Chisom Eze", avatar: "CE", streak: 7, goalsComplete: 4, goalsTotal: 5, hours: 8, book: 45 },
  { id: 3, name: "Kofi Mensah", avatar: "KM", streak: 21, goalsComplete: 5, goalsTotal: 5, hours: 20, book: 100 },
  { id: 4, name: "Fatima Bello", avatar: "FB", streak: 3, goalsComplete: 1, goalsTotal: 4, hours: 4, book: 22 },
  { id: 5, name: "Emeka Nwosu", avatar: "EN", streak: 9, goalsComplete: 2, goalsTotal: 4, hours: 6, book: 55 },
];

const GOALS = [
  { id: 1, member: "Amara Osei", goal: "Read 2 chapters/week", category: "Book Club", status: "on-track", due: "Mar 14" },
  { id: 2, member: "Amara Osei", goal: "Volunteer at Lagos Food Bank", category: "Volunteer", status: "completed", due: "Mar 10" },
  { id: 3, member: "Chisom Eze", goal: "Exercise 4x per week", category: "Personal", status: "at-risk", due: "Mar 14" },
  { id: 4, member: "Kofi Mensah", goal: "Mentor 1 junior member", category: "Community", status: "completed", due: "Mar 7" },
  { id: 5, member: "Fatima Bello", goal: "Complete online course module", category: "Learning", status: "at-risk", due: "Mar 12" },
  { id: 6, member: "Emeka Nwosu", goal: "Attend outreach planning meeting", category: "Volunteer", status: "on-track", due: "Mar 15" },
];

const BOOK = {
  title: "Atomic Habits",
  author: "James Clear",
  chapter: "Chapter 9 of 20",
  discussion: "March 15, 2025",
  prompt: "What habit have you started or broken this month based on the book?",
};

const ACTIVITIES = [
  { icon: "🌿", member: "Kofi Mensah", action: "completed their book reading goal", time: "2h ago" },
  { icon: "🤝", member: "Amara Osei", action: "logged 4 volunteer hours", time: "5h ago" },
  { icon: "🎯", member: "Chisom Eze", action: "updated their weekly goal", time: "Yesterday" },
  { icon: "📖", member: "Emeka Nwosu", action: "reached 55% of book", time: "Yesterday" },
  { icon: "⚡", member: "Fatima Bello", action: "joined the accountability circle", time: "2 days ago" },
];

const categoryColors = {
  "Book Club": "#4ade80",
  "Volunteer": "#60a5fa",
  "Personal": "#f472b6",
  "Community": "#fb923c",
  "Learning": "#a78bfa",
};

const statusStyles = {
  "completed": { bg: "rgba(74,222,128,0.15)", color: "#4ade80", label: "✓ Done" },
  "on-track": { bg: "rgba(96,165,250,0.15)", color: "#60a5fa", label: "● On Track" },
  "at-risk": { bg: "rgba(251,146,60,0.15)", color: "#fb923c", label: "⚠ At Risk" },
};

export default function REPDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMember, setSelectedMember] = useState(null);

  const totalHours = MEMBERS.reduce((s, m) => s + m.hours, 0);
  const avgBook = Math.round(MEMBERS.reduce((s, m) => s + m.book, 0) / MEMBERS.length);
  const completedGoals = GOALS.filter(g => g.status === "completed").length;

  const styles = {
    root: {
      fontFamily: "'DM Sans', sans-serif",
      background: "#0a0f0d",
      minHeight: "100vh",
      color: "#e8f0eb",
      padding: "0",
    },
    header: {
      background: "linear-gradient(135deg, #0d1f14 0%, #0a1a10 100%)",
      borderBottom: "1px solid rgba(74,222,128,0.12)",
      padding: "20px 28px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: {
      display: "flex",
      flexDirection: "column",
    },
    logoTop: {
      fontSize: "11px",
      letterSpacing: "3px",
      color: "#4ade80",
      textTransform: "uppercase",
      fontWeight: 600,
    },
    logoMain: {
      fontSize: "22px",
      fontWeight: 800,
      color: "#fff",
      letterSpacing: "-0.5px",
      lineHeight: 1.2,
    },
    badge: {
      background: "rgba(74,222,128,0.1)",
      border: "1px solid rgba(74,222,128,0.3)",
      color: "#4ade80",
      fontSize: "12px",
      padding: "4px 12px",
      borderRadius: "20px",
      fontWeight: 600,
    },
    body: {
      padding: "24px 28px",
      maxWidth: "1100px",
      margin: "0 auto",
    },
    tabs: {
      display: "flex",
      gap: "4px",
      marginBottom: "28px",
      background: "rgba(255,255,255,0.04)",
      borderRadius: "12px",
      padding: "4px",
    },
    tab: (active) => ({
      padding: "8px 18px",
      borderRadius: "9px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: active ? 700 : 500,
      background: active ? "#4ade80" : "transparent",
      color: active ? "#0a0f0d" : "#8aab90",
      transition: "all 0.2s",
      fontFamily: "'DM Sans', sans-serif",
    }),
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    statCard: {
      background: "linear-gradient(135deg, #0d1f14, #0f2218)",
      border: "1px solid rgba(74,222,128,0.12)",
      borderRadius: "16px",
      padding: "20px",
    },
    statLabel: { fontSize: "12px", color: "#5a7a60", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" },
    statValue: { fontSize: "32px", fontWeight: 800, color: "#fff", lineHeight: 1 },
    statSub: { fontSize: "12px", color: "#4ade80", marginTop: "4px" },
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "20px",
    },
    card: {
      background: "linear-gradient(135deg, #0d1f14, #0f2218)",
      border: "1px solid rgba(74,222,128,0.1)",
      borderRadius: "16px",
      padding: "20px",
    },
    cardTitle: {
      fontSize: "13px",
      fontWeight: 700,
      color: "#4ade80",
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      marginBottom: "16px",
    },
    memberRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "14px",
      cursor: "pointer",
      borderRadius: "10px",
      padding: "8px",
      transition: "background 0.2s",
    },
    avatar: (color) => ({
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      background: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13px",
      fontWeight: 700,
      color: "#0a0f0d",
      flexShrink: 0,
    }),
    progressBar: (pct, color) => ({
      height: "4px",
      borderRadius: "2px",
      background: "rgba(255,255,255,0.08)",
      overflow: "hidden",
      position: "relative",
      marginTop: "4px",
    }),
    progressFill: (pct, color) => ({
      height: "100%",
      width: `${pct}%`,
      background: color,
      borderRadius: "2px",
      transition: "width 0.8s ease",
    }),
    goalRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    },
    goalBadge: (status) => ({
      background: statusStyles[status].bg,
      color: statusStyles[status].color,
      fontSize: "11px",
      padding: "3px 10px",
      borderRadius: "20px",
      fontWeight: 600,
      whiteSpace: "nowrap",
    }),
    activityRow: {
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
      marginBottom: "14px",
    },
    activityIcon: {
      fontSize: "20px",
      width: "36px",
      height: "36px",
      background: "rgba(74,222,128,0.08)",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    bookCard: {
      background: "linear-gradient(135deg, #0d2218 0%, #0a1a12 100%)",
      border: "1px solid rgba(74,222,128,0.2)",
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "20px",
      display: "flex",
      gap: "24px",
      alignItems: "center",
    },
    bookCover: {
      width: "70px",
      height: "95px",
      background: "linear-gradient(135deg, #4ade80, #22c55e)",
      borderRadius: "8px",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "28px",
    },
    whatsappPanel: {
      background: "linear-gradient(135deg, #0d2218, #0a1a12)",
      border: "1px solid rgba(74,222,128,0.2)",
      borderRadius: "16px",
      padding: "24px",
    },
    sendBtn: {
      background: "linear-gradient(135deg, #4ade80, #22c55e)",
      color: "#0a0f0d",
      border: "none",
      padding: "12px 24px",
      borderRadius: "10px",
      fontWeight: 700,
      fontSize: "14px",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      marginTop: "12px",
    },
    textarea: {
      width: "100%",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(74,222,128,0.15)",
      borderRadius: "10px",
      color: "#e8f0eb",
      padding: "12px",
      fontSize: "14px",
      fontFamily: "'DM Sans', sans-serif",
      resize: "vertical",
      marginTop: "8px",
      boxSizing: "border-box",
    },
  };

  const avatarColors = ["#4ade80", "#60a5fa", "#f472b6", "#fb923c", "#a78bfa"];

  return (
    <div style={styles.root}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoTop}>Volunteers Organization Africa</span>
          <span style={styles.logoMain}>REP Dashboard</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={styles.badge}>● Cohort 1 Active</span>
          <div style={{ ...styles.avatar(avatarColors[0]), width: 36, height: 36, fontSize: "12px" }}>AD</div>
        </div>
      </div>

      <div style={styles.body}>
        {/* Tabs */}
        <div style={styles.tabs}>
          {["overview", "goals", "book club", "nudges"].map(tab => (
            <button key={tab} style={styles.tab(activeTab === tab)} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Active Members</div>
                <div style={styles.statValue}>{MEMBERS.length}</div>
                <div style={styles.statSub}>↑ REP Cohort 1</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Volunteer Hours</div>
                <div style={styles.statValue}>{totalHours}</div>
                <div style={styles.statSub}>↑ This month</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Goals Completed</div>
                <div style={styles.statValue}>{completedGoals}</div>
                <div style={styles.statSub}>of {GOALS.length} total goals</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Avg. Book Progress</div>
                <div style={styles.statValue}>{avgBook}%</div>
                <div style={styles.statSub}>Atomic Habits</div>
              </div>
            </div>

            <div style={styles.grid2}>
              {/* Members */}
              <div style={styles.card}>
                <div style={styles.cardTitle}>Member Leaderboard</div>
                {MEMBERS.sort((a, b) => b.streak - a.streak).map((m, i) => (
                  <div key={m.id} style={styles.memberRow} onClick={() => setSelectedMember(m)}>
                    <div style={{ color: "#4ade80", fontWeight: 800, fontSize: "14px", width: "20px" }}>#{i + 1}</div>
                    <div style={styles.avatar(avatarColors[i])}>{m.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: "12px", color: "#5a7a60" }}>🔥 {m.streak} day streak · {m.hours}h volunteered</div>
                      <div style={styles.progressBar(m.goalsComplete / m.goalsTotal * 100)}>
                        <div style={styles.progressFill(m.goalsComplete / m.goalsTotal * 100, avatarColors[i])} />
                      </div>
                    </div>
                    <div style={{ fontSize: "12px", color: "#5a7a60" }}>{m.goalsComplete}/{m.goalsTotal}</div>
                  </div>
                ))}
              </div>

              {/* Activity Feed */}
              <div style={styles.card}>
                <div style={styles.cardTitle}>Live Activity</div>
                {ACTIVITIES.map((a, i) => (
                  <div key={i} style={styles.activityRow}>
                    <div style={styles.activityIcon}>{a.icon}</div>
                    <div>
                      <div style={{ fontSize: "13px" }}>
                        <span style={{ fontWeight: 700, color: "#4ade80" }}>{a.member}</span>{" "}
                        <span style={{ color: "#8aab90" }}>{a.action}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#4a6a50", marginTop: "2px" }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* GOALS TAB */}
        {activeTab === "goals" && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>All Member Goals</div>
            {GOALS.map((g, i) => (
              <div key={i} style={styles.goalRow}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>{g.goal}</div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "4px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#5a7a60" }}>{g.member}</span>
                    <span style={{ fontSize: "11px", background: `${categoryColors[g.category]}20`, color: categoryColors[g.category], padding: "1px 8px", borderRadius: "10px" }}>{g.category}</span>
                    <span style={{ fontSize: "11px", color: "#4a6a50" }}>Due {g.due}</span>
                  </div>
                </div>
                <div style={styles.goalBadge(g.status)}>{statusStyles[g.status].label}</div>
              </div>
            ))}
          </div>
        )}

        {/* BOOK CLUB TAB */}
        {activeTab === "book club" && (
          <>
            <div style={styles.bookCard}>
              <div style={styles.bookCover}>📗</div>
              <div>
                <div style={{ fontSize: "11px", color: "#4ade80", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>Current Read</div>
                <div style={{ fontSize: "24px", fontWeight: 800 }}>{BOOK.title}</div>
                <div style={{ color: "#8aab90", marginBottom: "8px" }}>by {BOOK.author}</div>
                <div style={{ fontSize: "13px", color: "#5a7a60" }}>📍 {BOOK.chapter} · Discussion: {BOOK.discussion}</div>
              </div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Member Reading Progress</div>
              {MEMBERS.map((m, i) => (
                <div key={m.id} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ ...styles.avatar(avatarColors[i]), width: 28, height: 28, fontSize: "11px" }}>{m.avatar}</div>
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>{m.name}</span>
                    </div>
                    <span style={{ fontSize: "13px", color: m.book === 100 ? "#4ade80" : "#8aab90", fontWeight: 700 }}>{m.book}%</span>
                  </div>
                  <div style={styles.progressBar(m.book)}>
                    <div style={styles.progressFill(m.book, m.book === 100 ? "#4ade80" : avatarColors[i])} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "20px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "12px", color: "#4ade80", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}>💬 DISCUSSION PROMPT</div>
                <div style={{ fontSize: "15px", color: "#c8e0cc", fontStyle: "italic" }}>"{BOOK.prompt}"</div>
              </div>
            </div>
          </>
        )}

        {/* NUDGES TAB */}
        {activeTab === "nudges" && (
          <div>
            <div style={styles.whatsappPanel}>
              <div style={styles.cardTitle}>📲 WhatsApp Accountability Nudge</div>
              <div style={{ fontSize: "13px", color: "#8aab90", marginBottom: "16px" }}>Send weekly check-in messages to your REP group. Personalize below before sending.</div>

              {[
                { label: "🔥 Weekly Momentum Nudge", msg: `Hey REP fam! 👋\n\nWe're halfway through the week — here's a quick check-in:\n\n📖 Book: "${BOOK.title}" – drop a 🔥 if you've read your chapters this week!\n\n🎯 Goals: Share ONE thing you're committing to finishing before Sunday.\n\n💪 Volunteer hours: Log your hours this week — every minute counts!\n\nLet's keep the ripple going. 🌊\n— VOA REP Team` },
                { label: "📊 Monthly Progress Shoutout", msg: `🌟 REP Monthly Update!\n\nThis month we collectively:\n✅ ${completedGoals} goals completed\n⏱ ${totalHours} volunteer hours logged\n📗 Avg ${avgBook}% through Atomic Habits\n\nTop streak this month: Kofi Mensah at 21 days! 🏆\n\nYou're all making waves. Keep going. 🌊\n— VOA REP Team` },
              ].map((nudge, i) => (
                <div key={i} style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#c8e0cc", marginBottom: "6px" }}>{nudge.label}</div>
                  <textarea style={styles.textarea} rows={8} defaultValue={nudge.msg} />
                  <button style={styles.sendBtn}>Copy & Send via WhatsApp ↗</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
