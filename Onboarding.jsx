import { useState, useEffect } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const G = {
  bg: "#06080a", surface: "#0c1117", surface2: "#111820",
  border: "rgba(96,165,250,0.12)", borderBright: "rgba(96,165,250,0.28)",
  accent: "#60a5fa", accentGreen: "#4ade80", accentGlow: "rgba(96,165,250,0.15)",
  text: "#dce8f5", muted: "#5a7a99", faint: "#0f1822",
  warn: "#fb923c", warnBg: "rgba(251,146,60,0.1)",
};

// ─── Seed: pending applications ──────────────────────────────────────────────
const APPS_SEED = [
  {
    id: "a1", name: "Tolu Adeyemi", email: "tolu@example.com", whatsapp: "+234 801 234 5678",
    age: 24, city: "Lagos", occupation: "Graduate Student",
    why: "I've been following VOA for a year and the REP concept really resonates with me. I want to be held accountable to my personal goals while also giving back through volunteering.",
    goals: "1. Read 1 book per month\n2. Volunteer at least 8 hours/month\n3. Build a consistent morning routine",
    commitment: "yes", referral: "Amara Osei", status: "pending", appliedAt: "2025-03-05",
  },
  {
    id: "a2", name: "Dami Okonkwo", email: "dami@example.com", whatsapp: "+234 802 345 6789",
    age: 28, city: "Abuja", occupation: "Software Developer",
    why: "I want to combine my professional growth with community impact. REP feels like the perfect structure for that — accountability + purpose.",
    goals: "1. Complete an online certification\n2. Mentor a younger developer\n3. Attend 2 outreaches per month",
    commitment: "yes", referral: "Kofi Mensah", status: "pending", appliedAt: "2025-03-06",
  },
  {
    id: "a3", name: "Ngozi Eze", email: "ngozi@example.com", whatsapp: "+234 803 456 7890",
    age: 31, city: "Port Harcourt", occupation: "Nurse",
    why: "As a healthcare worker I see the need for community health initiatives. REP gives me a platform to act on that while also growing personally.",
    goals: "1. Start a community health awareness drive\n2. Read books on leadership\n3. Improve work-life balance",
    commitment: "yes", referral: "Direct (saw WhatsApp status)", status: "approved", appliedAt: "2025-03-03",
  },
];

// ─── Avatar color pool ────────────────────────────────────────────────────────
const COLORS = ["#60a5fa","#4ade80","#f472b6","#fb923c","#a78bfa","#34d399","#fbbf24","#f87171"];
const initials = name => name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

// ─── Shared micro-components ──────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
      background: G.accentGreen, color:"#06080a", padding:"11px 24px", borderRadius:16,
      fontWeight:800, fontSize:13, zIndex:9999, boxShadow:"0 8px 32px rgba(74,222,128,0.4)",
      whiteSpace:"nowrap", fontFamily:"'Cabinet Grotesk',sans-serif" }}>
      {msg}
    </div>
  );
}

function StepDot({ n, active, done }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div style={{
        width: 36, height: 36, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
        fontWeight:800, fontSize:13, fontFamily:"'Cabinet Grotesk',sans-serif",
        background: done ? G.accentGreen : active ? G.accent : "transparent",
        border: `2px solid ${done ? G.accentGreen : active ? G.accent : "rgba(96,165,250,0.2)"}`,
        color: done||active ? "#06080a" : G.muted, transition:"all 0.3s",
      }}>
        {done ? "✓" : n}
      </div>
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <label style={{ fontSize:12, fontWeight:700, color: G.accent, letterSpacing:"1.5px", textTransform:"uppercase" }}>
          {label}{required && <span style={{ color: G.warn }}> *</span>}
        </label>
        {hint && <span style={{ fontSize:11, color: G.muted }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  width:"100%", background:"rgba(255,255,255,0.04)", border:`1px solid ${G.border}`,
  borderRadius:10, color: G.text, padding:"11px 14px", fontSize:14,
  fontFamily:"'Cabinet Grotesk',sans-serif", boxSizing:"border-box", outline:"none",
  transition:"border-color 0.2s",
};
const taStyle = { ...inputStyle, resize:"vertical" };
const selectStyle = { ...inputStyle, background: G.faint };

// ─── STEP COMPONENTS ──────────────────────────────────────────────────────────

function StepWelcome({ onNext }) {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:52, marginBottom:16 }}>🌊</div>
      <div style={{ fontSize:28, fontWeight:900, letterSpacing:"-0.5px", marginBottom:10 }}>
        Join the Ripple Effect Program
      </div>
      <div style={{ fontSize:15, color: G.muted, lineHeight:1.7, maxWidth:460, margin:"0 auto 32px" }}>
        REP is a small accountability group inside Volunteers Organization Africa. Members commit to personal goals, read books together, and show up for the community.
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:36, textAlign:"left" }}>
        {[
          { icon:"🎯", title:"Set Real Goals", desc:"Commit to goals that matter to you — personal, career, or community." },
          { icon:"📖", title:"Read Together", desc:"One book per cohort, discussed as a group every few weeks." },
          { icon:"🤝", title:"Volunteer Monthly", desc:"Show up for at least one outreach or community initiative per month." },
        ].map((c,i) => (
          <div key={i} style={{ background: G.surface2, border:`1px solid ${G.border}`, borderRadius:16, padding:"18px 16px" }}>
            <div style={{ fontSize:26, marginBottom:8 }}>{c.icon}</div>
            <div style={{ fontWeight:800, fontSize:14, marginBottom:4 }}>{c.title}</div>
            <div style={{ fontSize:12, color: G.muted, lineHeight:1.5 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ background: G.accentGlow, border:`1px solid ${G.borderBright}`, borderRadius:14,
        padding:"14px 18px", fontSize:13, color: G.text, marginBottom:28, textAlign:"left" }}>
        <strong style={{ color: G.accent }}>📋 What to expect:</strong> Fill in a short application (5 mins). The VOA admin reviews it within 48 hours. If approved, you'll receive your login PIN and be added to the WhatsApp group.
      </div>

      <button onClick={onNext} style={{
        background: G.accent, color:"#06080a", border:"none", padding:"14px 40px",
        borderRadius:14, fontWeight:900, fontSize:16, cursor:"pointer",
        fontFamily:"'Cabinet Grotesk',sans-serif", letterSpacing:"-0.3px",
      }}>
        Apply Now →
      </button>
    </div>
  );
}

function StepPersonal({ data, onChange, onNext, onBack }) {
  const ok = data.name && data.email && data.whatsapp && data.city && data.age;
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:20, fontWeight:900 }}>About You</div>
        <div style={{ fontSize:13, color: G.muted, marginTop:4 }}>Basic info so we know who's joining.</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
        <div style={{ gridColumn:"1/-1" }}>
          <Field label="Full Name" required>
            <input style={inputStyle} placeholder="e.g. Amara Osei" value={data.name} onChange={e=>onChange("name",e.target.value)}/>
          </Field>
        </div>
        <Field label="Email Address" required>
          <input style={{...inputStyle, marginRight:0}} placeholder="you@email.com" value={data.email} onChange={e=>onChange("email",e.target.value)}/>
        </Field>
        <div style={{ paddingLeft:12 }}>
          <Field label="WhatsApp Number" required>
            <input style={inputStyle} placeholder="+234 801 234 5678" value={data.whatsapp} onChange={e=>onChange("whatsapp",e.target.value)}/>
          </Field>
        </div>
        <Field label="City / State" required>
          <input style={inputStyle} placeholder="e.g. Lagos" value={data.city} onChange={e=>onChange("city",e.target.value)}/>
        </Field>
        <div style={{ paddingLeft:12 }}>
          <Field label="Age" required>
            <input style={inputStyle} type="number" min={16} max={60} placeholder="e.g. 25" value={data.age} onChange={e=>onChange("age",e.target.value)}/>
          </Field>
        </div>
        <div style={{ gridColumn:"1/-1" }}>
          <Field label="Occupation / What You Do">
            <input style={inputStyle} placeholder="e.g. Student, Developer, Nurse…" value={data.occupation} onChange={e=>onChange("occupation",e.target.value)}/>
          </Field>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} disabled={!ok}/>
    </div>
  );
}

function StepMotivation({ data, onChange, onNext, onBack }) {
  const ok = data.why && data.why.length >= 40;
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:20, fontWeight:900 }}>Your Why</div>
        <div style={{ fontSize:13, color: G.muted, marginTop:4 }}>Help us understand what brought you here.</div>
      </div>

      <Field label="Why do you want to join REP?" required hint="Min. 40 characters">
        <textarea style={taStyle} rows={5}
          placeholder="What drew you to the Ripple Effect Program? What do you hope to gain or give?"
          value={data.why} onChange={e=>onChange("why",e.target.value)}/>
        <div style={{ fontSize:11, color: data.why.length>=40 ? G.accentGreen : G.muted, marginTop:4, textAlign:"right" }}>
          {data.why.length} chars {data.why.length>=40?"✓":"(need 40+)"}
        </div>
      </Field>

      <Field label="How did you hear about VOA / REP?">
        <input style={inputStyle} placeholder="e.g. Friend referral, WhatsApp, Instagram…" value={data.referral} onChange={e=>onChange("referral",e.target.value)}/>
      </Field>

      <NavButtons onBack={onBack} onNext={onNext} disabled={!ok}/>
    </div>
  );
}

function StepGoals({ data, onChange, onNext, onBack }) {
  const ok = data.goals && data.goals.length >= 20 && data.commitment === "yes";
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:20, fontWeight:900 }}>Your Goals</div>
        <div style={{ fontSize:13, color: G.muted, marginTop:4 }}>What do you want to accomplish this cohort?</div>
      </div>

      <div style={{ background: G.accentGlow, border:`1px solid ${G.borderBright}`, borderRadius:12,
        padding:"12px 16px", fontSize:13, color: G.text, marginBottom:20 }}>
        💡 <strong style={{ color: G.accent }}>Tip:</strong> Be specific. Instead of "exercise more", try "work out 3x per week". Specific goals are easier to track and verify.
      </div>

      <Field label="List 2–4 goals for this cohort" required hint="One per line">
        <textarea style={taStyle} rows={6}
          placeholder={"1. Read 1 book per month\n2. Volunteer 8 hours/month\n3. Wake up at 6am daily\n4. Complete my online course"}
          value={data.goals} onChange={e=>onChange("goals",e.target.value)}/>
      </Field>

      <Field label="Which goal category matters most to you?" required>
        <select style={selectStyle} value={data.topCategory||""} onChange={e=>onChange("topCategory",e.target.value)}>
          <option value="">Select a category…</option>
          {["Book Club","Volunteer","Personal Growth","Career / Learning","Community Impact"].map(c=>(
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>

      <Field label="I commit to showing up weekly and supporting my accountability group" required>
        <div style={{ display:"flex", gap:12 }}>
          {[{val:"yes",label:"✅ Yes, I fully commit"},{ val:"no", label:"❌ Not sure yet"}].map(opt=>(
            <button key={opt.val} onClick={()=>onChange("commitment",opt.val)} style={{
              flex:1, padding:"12px", borderRadius:12, cursor:"pointer", fontWeight:700,
              fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:13, transition:"all 0.2s",
              border:`1.5px solid ${data.commitment===opt.val ? G.accent : G.border}`,
              background: data.commitment===opt.val ? G.accentGlow : "transparent",
              color: data.commitment===opt.val ? G.accent : G.muted,
            }}>{opt.label}</button>
          ))}
        </div>
      </Field>

      {data.commitment==="no" && (
        <div style={{ background: G.warnBg, border:`1px solid rgba(251,146,60,0.3)`, borderRadius:12,
          padding:"12px 16px", fontSize:13, color: G.warn, marginBottom:16 }}>
          ⚠ REP requires full commitment. We encourage you to apply when you're ready.
        </div>
      )}

      <NavButtons onBack={onBack} onNext={onNext} disabled={!ok}/>
    </div>
  );
}

function StepReview({ data, onSubmit, onBack, submitting }) {
  const rows = [
    { label:"Name",       val: data.name },
    { label:"Email",      val: data.email },
    { label:"WhatsApp",   val: data.whatsapp },
    { label:"City",       val: data.city },
    { label:"Age",        val: data.age },
    { label:"Occupation", val: data.occupation || "—" },
    { label:"Referral",   val: data.referral || "—" },
  ];
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:20, fontWeight:900 }}>Review & Submit</div>
        <div style={{ fontSize:13, color: G.muted, marginTop:4 }}>Check everything before sending your application.</div>
      </div>

      <div style={{ background: G.surface2, border:`1px solid ${G.border}`, borderRadius:16, padding:"18px 20px", marginBottom:18 }}>
        <div style={{ fontSize:11, color: G.accent, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:14 }}>Personal Info</div>
        {rows.map((r,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0",
            borderBottom: i<rows.length-1?`1px solid rgba(255,255,255,0.04)`:"none" }}>
            <span style={{ fontSize:12, color: G.muted, fontWeight:600 }}>{r.label}</span>
            <span style={{ fontSize:13, fontWeight:700, maxWidth:"60%", textAlign:"right" }}>{r.val}</span>
          </div>
        ))}
      </div>

      <div style={{ background: G.surface2, border:`1px solid ${G.border}`, borderRadius:16, padding:"18px 20px", marginBottom:18 }}>
        <div style={{ fontSize:11, color: G.accent, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Why I'm Joining</div>
        <div style={{ fontSize:13, color:"#b0c8e0", lineHeight:1.7 }}>{data.why}</div>
      </div>

      <div style={{ background: G.surface2, border:`1px solid ${G.border}`, borderRadius:16, padding:"18px 20px", marginBottom:24 }}>
        <div style={{ fontSize:11, color: G.accent, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>My Goals</div>
        <div style={{ fontSize:13, color:"#b0c8e0", lineHeight:1.9, whiteSpace:"pre-wrap" }}>{data.goals}</div>
      </div>

      <div style={{ background:"rgba(74,222,128,0.06)", border:`1px solid rgba(74,222,128,0.2)`, borderRadius:12,
        padding:"12px 16px", fontSize:13, color: G.muted, marginBottom:24 }}>
        By submitting, you agree to show up, support your group, and honour your commitments. The VOA admin will review your application within 48 hours. 💚
      </div>

      <div style={{ display:"flex", gap:12 }}>
        <button onClick={onBack} style={{ ...btnStyle("ghost"), flex:1 }}>← Back</button>
        <button onClick={onSubmit} disabled={submitting} style={{ ...btnStyle("primary"), flex:2, opacity:submitting?0.6:1 }}>
          {submitting ? "Submitting…" : "Submit Application 🌊"}
        </button>
      </div>
    </div>
  );
}

function StepSuccess({ data }) {
  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      <div style={{ fontSize:64, marginBottom:16, animation:"bounce 0.6s ease" }}>🎉</div>
      <div style={{ fontSize:26, fontWeight:900, marginBottom:10 }}>Application Submitted!</div>
      <div style={{ fontSize:15, color: G.muted, lineHeight:1.7, maxWidth:420, margin:"0 auto 28px" }}>
        Thanks <strong style={{ color: G.accent }}>{data.name.split(" ")[0]}</strong>! Your application to join REP is now under review.
        The VOA admin will reach out via WhatsApp within 48 hours.
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, maxWidth:380, margin:"0 auto 28px" }}>
        {[
          { icon:"⏱", title:"48 hours", desc:"Review time" },
          { icon:"📲", title:"WhatsApp", desc:"You'll hear from us here" },
          { icon:"🔑", title:"PIN", desc:"Sent on approval" },
          { icon:"🌊", title:"Cohort 1", desc:"You'll be added here" },
        ].map((s,i)=>(
          <div key={i} style={{ background: G.surface2, border:`1px solid ${G.border}`, borderRadius:14, padding:"14px 12px", textAlign:"center" }}>
            <div style={{ fontSize:22 }}>{s.icon}</div>
            <div style={{ fontWeight:800, fontSize:15, color: G.accent }}>{s.title}</div>
            <div style={{ fontSize:11, color: G.muted }}>{s.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:13, color: G.muted }}>While you wait, follow <strong style={{ color: G.text }}>VOA</strong> on social for updates 💚</div>
    </div>
  );
}

// ─── Nav Buttons ──────────────────────────────────────────────────────────────
const btnStyle = (v="primary") => ({
  padding:"12px 24px", borderRadius:12, border:"none", cursor:"pointer", fontWeight:800,
  fontSize:14, fontFamily:"'Cabinet Grotesk',sans-serif", transition:"all 0.2s",
  background: v==="primary"?G.accent:v==="ghost"?"transparent":"rgba(255,255,255,0.06)",
  color: v==="primary"?"#06080a":v==="ghost"?G.muted:G.text,
});

function NavButtons({ onBack, onNext, disabled, nextLabel="Continue →" }) {
  return (
    <div style={{ display:"flex", gap:12, marginTop:8 }}>
      {onBack && <button onClick={onBack} style={{ ...btnStyle("ghost"), flex:1 }}>← Back</button>}
      <button onClick={onNext} disabled={disabled} style={{ ...btnStyle("primary"), flex:2, opacity:disabled?0.35:1, cursor:disabled?"not-allowed":"pointer" }}>
        {nextLabel}
      </button>
    </div>
  );
}

// ─── APPLICATION FORM ─────────────────────────────────────────────────────────
function ApplicationForm({ onSubmitApp }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", whatsapp:"", city:"", age:"", occupation:"", why:"", referral:"", goals:"", topCategory:"", commitment:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const STEPS = ["Welcome","About You","Your Why","Your Goals","Review"];

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      onSubmitApp({ ...form, id:`a${Date.now()}`, status:"pending", appliedAt: new Date().toISOString().split("T")[0] });
      setSubmitting(false);
      setStep(5);
    }, 1400);
  };

  return (
    <div style={{ minHeight:"100vh", background: G.bg, fontFamily:"'Cabinet Grotesk',sans-serif", color: G.text,
      display:"flex", flexDirection:"column", alignItems:"center", padding:"32px 16px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&display=swap');
        * { box-sizing:border-box; } input,textarea,select { color-scheme:dark; }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }`}
      </style>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ fontSize:11, letterSpacing:"3px", color: G.accent, textTransform:"uppercase", marginBottom:6 }}>Volunteers Organization Africa</div>
        <div style={{ fontSize:13, color: G.muted }}>Ripple Effect Program · Application</div>
      </div>

      {/* Step indicators (not on welcome or success) */}
      {step > 0 && step < 5 && (
        <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:36 }}>
          {STEPS.slice(1).map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <StepDot n={i+1} active={step===i+1} done={step>i+1}/>
                <span style={{ fontSize:10, color: step===i+1?G.accent:G.muted, fontWeight:700, whiteSpace:"nowrap" }}>{s}</span>
              </div>
              {i < STEPS.length-2 && (
                <div style={{ width:36, height:2, background: step>i+1?G.accent:"rgba(96,165,250,0.15)", margin:"0 4px", marginBottom:20 }}/>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Card */}
      <div style={{ background: G.surface, border:`1px solid ${G.border}`, borderRadius:24, padding:"32px 28px",
        width:"100%", maxWidth:580, boxShadow:"0 40px 80px rgba(0,0,0,0.7)" }}>
        {step===0 && <StepWelcome onNext={()=>setStep(1)}/>}
        {step===1 && <StepPersonal data={form} onChange={set} onBack={()=>setStep(0)} onNext={()=>setStep(2)}/>}
        {step===2 && <StepMotivation data={form} onChange={set} onBack={()=>setStep(1)} onNext={()=>setStep(3)}/>}
        {step===3 && <StepGoals data={form} onChange={set} onBack={()=>setStep(2)} onNext={()=>setStep(4)}/>}
        {step===4 && <StepReview data={form} onBack={()=>setStep(3)} onSubmit={handleSubmit} submitting={submitting}/>}
        {step===5 && <StepSuccess data={form}/>}
      </div>
    </div>
  );
}

// ─── ADMIN REVIEW PANEL ───────────────────────────────────────────────────────
function AdminReview({ apps, onDecide }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [toast, setToast] = useState(null);
  const [pin, setPin] = useState("");

  const displayed = apps.filter(a => filter==="all" ? true : a.status===filter);
  const pending = apps.filter(a=>a.status==="pending").length;

  const decide = (app, decision) => {
    onDecide(app.id, decision, pin||"0000");
    setSelected(null);
    setPin("");
    setToast(decision==="approved" ? `✅ ${app.name} approved & added to REP!` : `❌ ${app.name} declined.`);
  };

  const statusColor = { pending:"#fb923c", approved:G.accentGreen, declined:"#f87171" };
  const statusBg    = { pending:"rgba(251,146,60,0.1)", approved:"rgba(74,222,128,0.1)", declined:"rgba(248,113,113,0.1)" };

  return (
    <div style={{ minHeight:"100vh", background: G.bg, fontFamily:"'Cabinet Grotesk',sans-serif", color: G.text }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&display=swap'); *{box-sizing:border-box;}`}</style>
      {toast && <Toast msg={toast} onDone={()=>setToast(null)}/>}

      {/* Detail modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:500,
          display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background: G.surface, border:`1px solid ${G.border}`, borderRadius:24, padding:28,
            width:"100%", maxWidth:560, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 40px 80px rgba(0,0,0,0.9)" }}>

            {/* Applicant header */}
            <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:22 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background: COLORS[selected.id.length%COLORS.length],
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:"#06080a" }}>
                {initials(selected.name)}
              </div>
              <div>
                <div style={{ fontSize:20, fontWeight:900 }}>{selected.name}</div>
                <div style={{ fontSize:13, color: G.muted }}>{selected.occupation||"—"} · {selected.city} · Age {selected.age}</div>
              </div>
              <div style={{ marginLeft:"auto" }}>
                <span style={{ fontSize:11, padding:"4px 12px", borderRadius:20, fontWeight:700,
                  background: statusBg[selected.status], color: statusColor[selected.status] }}>
                  {selected.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Contact */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
              {[{l:"Email",v:selected.email},{l:"WhatsApp",v:selected.whatsapp},{l:"Applied",v:selected.appliedAt},{l:"Referred by",v:selected.referral||"—"}].map((r,i)=>(
                <div key={i} style={{ background: G.faint, borderRadius:10, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, color: G.muted, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>{r.l}</div>
                  <div style={{ fontSize:13, fontWeight:700, marginTop:3 }}>{r.v}</div>
                </div>
              ))}
            </div>

            {/* Why */}
            <div style={{ background: G.surface2, border:`1px solid ${G.border}`, borderRadius:14, padding:"16px 18px", marginBottom:14 }}>
              <div style={{ fontSize:10, color: G.accent, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:10 }}>Why They Want to Join</div>
              <div style={{ fontSize:13, color:"#b0c8e0", lineHeight:1.75 }}>{selected.why}</div>
            </div>

            {/* Goals */}
            <div style={{ background: G.surface2, border:`1px solid ${G.border}`, borderRadius:14, padding:"16px 18px", marginBottom:22 }}>
              <div style={{ fontSize:10, color: G.accent, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:10 }}>Their Goals</div>
              <div style={{ fontSize:13, color:"#b0c8e0", lineHeight:1.9, whiteSpace:"pre-wrap" }}>{selected.goals}</div>
            </div>

            {/* PIN for approval */}
            {selected.status==="pending" && (
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:11, color: G.muted, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:8 }}>Assign Login PIN (4 digits)</div>
                <input style={{ ...inputStyle, maxWidth:160 }} maxLength={4} placeholder="e.g. 5678" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,""))}/>
                <div style={{ fontSize:11, color: G.muted, marginTop:4 }}>Send this PIN to the member via WhatsApp on approval.</div>
              </div>
            )}

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setSelected(null)} style={{ ...btnStyle("ghost"), flex:1 }}>Close</button>
              {selected.status==="pending" && <>
                <button onClick={()=>decide(selected,"declined")} style={{ ...btnStyle("secondary"), flex:1, background:"rgba(248,113,113,0.1)", color:"#f87171" }}>✗ Decline</button>
                <button onClick={()=>decide(selected,"approved")} style={{ ...btnStyle("primary"), flex:2 }} disabled={pin.length!==4}>
                  {pin.length===4?"✓ Approve & Add →":"Enter PIN first"}
                </button>
              </>}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: G.surface, borderBottom:`1px solid ${G.border}`, padding:"0 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between", height:58 }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:"2px", color: G.accent, textTransform:"uppercase" }}>VOA · REP Admin</div>
          <div style={{ fontSize:16, fontWeight:900 }}>Applications</div>
        </div>
        {pending>0 && (
          <div style={{ background:"rgba(251,146,60,0.12)", border:"1px solid rgba(251,146,60,0.3)",
            color:"#fb923c", fontSize:12, fontWeight:800, padding:"5px 14px", borderRadius:20 }}>
            {pending} pending review
          </div>
        )}
      </div>

      <div style={{ maxWidth:860, margin:"0 auto", padding:"24px 16px" }}>
        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
          {[
            { label:"Total Applied", val:apps.length, icon:"📋" },
            { label:"Approved",      val:apps.filter(a=>a.status==="approved").length, icon:"✅" },
            { label:"Pending",       val:pending, icon:"⏳" },
          ].map((s,i)=>(
            <div key={i} style={{ background: G.surface, border:`1px solid ${G.border}`, borderRadius:18, padding:"18px 16px", textAlign:"center" }}>
              <div style={{ fontSize:24 }}>{s.icon}</div>
              <div style={{ fontSize:28, fontWeight:900, color: G.accent }}>{s.val}</div>
              <div style={{ fontSize:11, color: G.muted }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:18, background:"rgba(255,255,255,0.03)", borderRadius:12, padding:4 }}>
          {["all","pending","approved","declined"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ flex:1, padding:"8px", borderRadius:9, border:"none", cursor:"pointer",
              fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:12, fontWeight:800,
              background:filter===f?G.accent:"transparent", color:filter===f?"#06080a":G.muted }}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
              {f!=="all"&&<span style={{ marginLeft:6, fontSize:11, opacity:0.7 }}>({apps.filter(a=>a.status===f).length})</span>}
            </button>
          ))}
        </div>

        {/* Application cards */}
        {displayed.length===0 && (
          <div style={{ ...{background:G.surface,border:`1px solid ${G.border}`,borderRadius:20,padding:24}, textAlign:"center", color: G.muted, padding:40 }}>
            No applications here yet.
          </div>
        )}
        {displayed.map(app=>(
          <div key={app.id} onClick={()=>setSelected(app)}
            style={{ background: G.surface, border:`1px solid ${G.border}`, borderRadius:18, padding:"18px 20px",
              marginBottom:12, cursor:"pointer", display:"flex", gap:14, alignItems:"center", transition:"border-color 0.2s" }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background: COLORS[app.id.length%COLORS.length],
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:900, color:"#06080a", flexShrink:0 }}>
              {initials(app.name)}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:15 }}>{app.name}</div>
              <div style={{ fontSize:12, color: G.muted, marginTop:2 }}>
                {app.city} · {app.occupation||"—"} · Applied {app.appliedAt}
                {app.referral&&<span style={{ color: G.accent }}> · via {app.referral}</span>}
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
              <span style={{ fontSize:11, padding:"3px 12px", borderRadius:20, fontWeight:800,
                background: statusBg[app.status], color: statusColor[app.status] }}>
                {app.status.toUpperCase()}
              </span>
              <span style={{ fontSize:11, color: G.muted }}>Review →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function Onboarding() {
  const [view, setView] = useState("home");
  const [apps, setApps] = useState(APPS_SEED);
  const [toast, setToast] = useState(null);

  const submitApp = app => setApps(a => [...a, app]);
  const decide = (id, status, pin) => setApps(a => a.map(x => x.id===id ? {...x, status, assignedPin:pin} : x));
  const pending = apps.filter(a=>a.status==="pending").length;

  // Landing / nav
  if (view==="apply")  return <ApplicationForm onSubmitApp={app=>{submitApp(app);}} />;
  if (view==="admin")  return (
    <div>
      <div style={{ position:"fixed", top:0, left:0, zIndex:200, padding:"10px 16px" }}>
        <button onClick={()=>setView("home")} style={{ ...btnStyle("ghost"), fontSize:12 }}>← Back to home</button>
      </div>
      <AdminReview apps={apps} onDecide={decide}/>
    </div>
  );

  // Home / demo selector
  return (
    <div style={{ minHeight:"100vh", background: G.bg, fontFamily:"'Cabinet Grotesk',sans-serif", color: G.text,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&display=swap'); *{box-sizing:border-box;}`}</style>
      {toast && <Toast msg={toast} onDone={()=>setToast(null)}/>}

      <div style={{ fontSize:44, marginBottom:16 }}>🌊</div>
      <div style={{ fontSize:11, letterSpacing:"3px", color: G.accent, textTransform:"uppercase", marginBottom:8 }}>Volunteers Organization Africa</div>
      <div style={{ fontSize:32, fontWeight:900, letterSpacing:"-0.5px", marginBottom:8 }}>REP Onboarding</div>
      <div style={{ fontSize:14, color: G.muted, marginBottom:40, textAlign:"center", maxWidth:380 }}>
        Two views below — the public application form members fill out, and the admin panel where you review and approve them.
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, maxWidth:500, width:"100%" }}>
        <button onClick={()=>setView("apply")} style={{ background: G.surface, border:`1px solid ${G.borderBright}`,
          borderRadius:20, padding:"28px 20px", cursor:"pointer", textAlign:"left", color: G.text, fontFamily:"'Cabinet Grotesk',sans-serif" }}>
          <div style={{ fontSize:30, marginBottom:10 }}>📝</div>
          <div style={{ fontWeight:900, fontSize:16, marginBottom:4 }}>Member Application</div>
          <div style={{ fontSize:12, color: G.muted }}>The form new members fill out to apply for REP</div>
          <div style={{ marginTop:14, fontSize:12, color: G.accent, fontWeight:700 }}>Open form →</div>
        </button>

        <button onClick={()=>setView("admin")} style={{ background: G.surface, border:`1px solid ${G.borderBright}`,
          borderRadius:20, padding:"28px 20px", cursor:"pointer", textAlign:"left", color: G.text, fontFamily:"'Cabinet Grotesk',sans-serif" }}>
          <div style={{ fontSize:30, marginBottom:10 }}>🛡</div>
          <div style={{ fontWeight:900, fontSize:16, marginBottom:4 }}>Admin Review</div>
          <div style={{ fontSize:12, color: G.muted }}>Review, approve or decline applications</div>
          {pending>0&&<div style={{ marginTop:8, display:"inline-block", background:"rgba(251,146,60,0.12)", color:"#fb923c", fontSize:11, fontWeight:800, padding:"3px 10px", borderRadius:10 }}>{pending} pending</div>}
          <div style={{ marginTop:14, fontSize:12, color: G.accent, fontWeight:700 }}>Open panel →</div>
        </button>
      </div>
    </div>
  );
}
