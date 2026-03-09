import { useState, useRef, useEffect } from "react";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const MEMBERS_DB = [
  { id:1, name:"Amara Osei",   pin:"1234", avatar:"AO", color:"#4ade80", role:"member", streak:14, points:340, bookPct:68  },
  { id:2, name:"Chisom Eze",   pin:"2345", avatar:"CE", color:"#60a5fa", role:"member", streak:7,  points:210, bookPct:45  },
  { id:3, name:"Kofi Mensah",  pin:"3456", avatar:"KM", color:"#f472b6", role:"member", streak:21, points:480, bookPct:100 },
  { id:4, name:"Fatima Bello", pin:"4567", avatar:"FB", color:"#fb923c", role:"member", streak:3,  points:120, bookPct:22  },
  { id:5, name:"Admin",        pin:"0000", avatar:"AD", color:"#a78bfa", role:"admin",  streak:0,  points:0,   bookPct:0   },
];

const GOALS_SEED = [
  { id:1, memberId:1, title:"Read 2 chapters/week",          category:"Book Club", status:"on-track",  due:"2025-03-14", proofs:[], note:"" },
  { id:2, memberId:1, title:"Volunteer at Lagos Food Bank",  category:"Volunteer", status:"completed", due:"2025-03-10", proofs:[], note:"Helped pack 200 food parcels" },
  { id:3, memberId:2, title:"Exercise 4x per week",          category:"Personal",  status:"at-risk",   due:"2025-03-14", proofs:[], note:"" },
  { id:4, memberId:3, title:"Mentor 1 junior member",        category:"Community", status:"completed", due:"2025-03-07", proofs:[], note:"Mentored Fatima on goal setting" },
  { id:5, memberId:4, title:"Complete online course module", category:"Learning",  status:"at-risk",   due:"2025-03-12", proofs:[], note:"" },
];

const BOOK_CLUB = {
  current: { title:"Atomic Habits", author:"James Clear", emoji:"📗", chapter:9, totalChapters:20,
    discussion:"March 15, 2025", prompt:"What ONE habit have you started or dropped this month based on the book?" },
  past: [
    { title:"The Alchemist", author:"Paulo Coelho", emoji:"📙", rating:4.7 },
    { title:"Rich Dad Poor Dad", author:"Robert Kiyosaki", emoji:"📕", rating:4.4 },
  ],
  discussions: [
    { member:"Kofi Mensah",  color:"#f472b6", avatar:"KM", text:"The 1% better every day concept completely changed how I approach volunteering. Small steps really do compound.", ts:"2 days ago" },
    { member:"Amara Osei",   color:"#4ade80", avatar:"AO", text:"I started a morning habit stack — prayer, 10 mins reading, stretching. Now I can't skip any of them, they're chained!", ts:"1 day ago" },
    { member:"Chisom Eze",   color:"#60a5fa", avatar:"CE", text:"The chapter on identity-based habits was 🤯. I stopped saying 'I'm trying to volunteer more' and now say 'I am a volunteer'.", ts:"5 hours ago" },
  ],
};

const CATEGORY_META = {
  "Book Club": { icon:"📖", color:"#4ade80", requiresProof:false },
  "Volunteer": { icon:"🤝", color:"#60a5fa", requiresProof:true  },
  "Personal":  { icon:"💪", color:"#f472b6", requiresProof:false },
  "Community": { icon:"🌍", color:"#fb923c", requiresProof:false },
  "Learning":  { icon:"🎓", color:"#a78bfa", requiresProof:false },
};

const STATUS_META = {
  "completed": { label:"Completed", color:"#4ade80", bg:"rgba(74,222,128,0.12)", icon:"✓" },
  "on-track":  { label:"On Track",  color:"#60a5fa", bg:"rgba(96,165,250,0.12)", icon:"●" },
  "at-risk":   { label:"At Risk",   color:"#fb923c", bg:"rgba(251,146,60,0.12)", icon:"⚠" },
};

// ─── Storage ──────────────────────────────────────────────────────────────────
const useStorage = (key, init) => {
  const [val, setVal] = useState(() => {
    try { const s = sessionStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  const set = v => { const next = typeof v==="function"?v(val):v; setVal(next); try { sessionStorage.setItem(key,JSON.stringify(next)); } catch {} };
  return [val, set];
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const G = {
  bg:"#080e0a", surface:"#0d1a0f", border:"rgba(74,222,128,0.12)",
  accent:"#4ade80", accentDim:"rgba(74,222,128,0.08)", text:"#e2ede5",
  muted:"#6b8f72", faint:"#1a2e1d",
};

const css = {
  root:       { fontFamily:"'Syne',sans-serif", background:G.bg, minHeight:"100vh", color:G.text },
  loginWrap:  { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
                background:`radial-gradient(ellipse 70% 60% at 50% 0%,rgba(74,222,128,0.08) 0%,transparent 70%),${G.bg}` },
  loginCard:  { background:G.surface, border:`1px solid ${G.border}`, borderRadius:24, padding:"40px 36px",
                width:"100%", maxWidth:400, boxShadow:"0 40px 80px rgba(0,0,0,0.6)" },
  header:     { background:G.surface, borderBottom:`1px solid ${G.border}`, padding:"0 20px",
                display:"flex", alignItems:"center", justifyContent:"space-between", height:58,
                position:"sticky", top:0, zIndex:100 },
  body:       { maxWidth:920, margin:"0 auto", padding:"24px 16px" },
  card:       { background:G.surface, border:`1px solid ${G.border}`, borderRadius:20, padding:22 },
  cardTitle:  { fontSize:11, fontWeight:700, letterSpacing:"2px", color:G.accent, textTransform:"uppercase", marginBottom:14 },
  goalCard:   { background:G.faint, border:`1px solid ${G.border}`, borderRadius:14, padding:"14px 18px", marginBottom:10, cursor:"pointer" },
  overlay:    { position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 },
  modal:      { background:G.surface, border:`1px solid ${G.border}`, borderRadius:24, padding:26, width:"100%", maxWidth:540, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 40px 80px rgba(0,0,0,0.9)" },
  toast:      { position:"fixed", bottom:22, left:"50%", transform:"translateX(-50%)", background:G.accent, color:G.bg,
                padding:"11px 22px", borderRadius:16, fontWeight:700, fontSize:13, zIndex:9999, boxShadow:"0 8px 32px rgba(74,222,128,0.4)", whiteSpace:"nowrap" },
  input:      { width:"100%", background:"rgba(255,255,255,0.04)", border:`1px solid rgba(74,222,128,0.2)`, borderRadius:10,
                color:G.text, padding:"10px 14px", fontSize:14, fontFamily:"'Syne',sans-serif", boxSizing:"border-box", outline:"none" },
  select:     { width:"100%", background:G.faint, border:`1px solid rgba(74,222,128,0.2)`, borderRadius:10,
                color:G.text, padding:"10px 14px", fontSize:14, fontFamily:"'Syne',sans-serif", boxSizing:"border-box" },
  textarea:   { width:"100%", background:"rgba(255,255,255,0.04)", border:`1px solid rgba(74,222,128,0.2)`, borderRadius:10,
                color:G.text, padding:"10px 14px", fontSize:13, fontFamily:"'Syne',sans-serif", boxSizing:"border-box", outline:"none", resize:"vertical" },
  pinDot:     f => ({ width:14, height:14, borderRadius:"50%", background:f?G.accent:"transparent", border:`2px solid ${f?G.accent:"rgba(74,222,128,0.3)"}`, transition:"all 0.15s" }),
  numBtn:     { width:62, height:62, borderRadius:14, background:"rgba(74,222,128,0.06)", border:`1px solid ${G.border}`,
                color:G.text, fontSize:20, fontWeight:700, cursor:"pointer", fontFamily:"'Syne',sans-serif" },
  navItem:    a => ({ padding:"6px 13px", borderRadius:20, fontSize:12, fontWeight:a?700:500,
                background:a?G.accent:"transparent", color:a?G.bg:G.muted, cursor:"pointer", border:"none", fontFamily:"'Syne',sans-serif", transition:"all 0.2s", whiteSpace:"nowrap" }),
  btn:        (v="primary") => ({ padding:"10px 20px", borderRadius:12, border:"none", cursor:"pointer", fontWeight:700, fontSize:13,
                fontFamily:"'Syne',sans-serif", transition:"all 0.2s",
                background: v==="primary"?G.accent:v==="danger"?"rgba(239,68,68,0.15)":v==="ghost"?"transparent":"rgba(255,255,255,0.06)",
                color:       v==="primary"?G.bg:v==="danger"?"#f87171":v==="ghost"?G.muted:G.text }),
  avatar:     (color,size=40) => ({ width:size, height:size, borderRadius:"50%", background:color,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.33, fontWeight:800, color:G.bg, flexShrink:0 }),
  statusBadge:s => ({ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700,
                background:STATUS_META[s].bg, color:STATUS_META[s].color, padding:"3px 10px", borderRadius:20 }),
  catBadge:   c => ({ fontSize:11, padding:"2px 8px", borderRadius:10, fontWeight:600,
                background:`${(CATEGORY_META[c]||{color:"#888"}).color}18`, color:(CATEGORY_META[c]||{color:"#888"}).color }),
  dropzone:   { border:"2px dashed rgba(74,222,128,0.25)", borderRadius:14, padding:"22px 16px",
                textAlign:"center", cursor:"pointer", background:"rgba(74,222,128,0.03)" },
};

// ─── Micro Components ─────────────────────────────────────────────────────────
function Toast({msg,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2600);return()=>clearTimeout(t);},[]);
  return <div style={css.toast}>{msg}</div>;
}

function ProgressBar({pct,color=G.accent,height=5}){
  return (
    <div style={{height,borderRadius:4,background:"rgba(255,255,255,0.07)",overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:color,borderRadius:4,transition:"width 0.8s ease"}}/>
    </div>
  );
}

function ProofUpload({proofs,onChange,required}){
  const ref=useRef();
  const handle=files=>Array.from(files).forEach(f=>{
    const r=new FileReader();
    r.onload=e=>onChange([...proofs,{url:e.target.result,name:f.name,type:f.type,ts:Date.now()}]);
    r.readAsDataURL(f);
  });
  return (
    <div>
      <div style={{fontSize:12,color:G.muted,marginBottom:8}}>{required?"📸 Photo proof required for Volunteer goals":"📸 Attach proof (optional)"}</div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10}}>
        {proofs.map((p,i)=>(
          <div key={i} style={{position:"relative"}}>
            {p.type?.startsWith("image")?
              <img src={p.url} alt="" style={{width:76,height:76,objectFit:"cover",borderRadius:10,border:`2px solid ${G.border}`}}/>:
              <div style={{width:76,height:76,background:G.faint,borderRadius:10,border:`2px solid ${G.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:G.muted,textAlign:"center",padding:4}}>📄 {p.name}</div>}
            <button onClick={()=>onChange(proofs.filter((_,j)=>j!==i))}
              style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:"#ef4444",border:"none",color:"#fff",fontSize:12,cursor:"pointer",lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        ))}
        <div style={css.dropzone} onClick={()=>ref.current.click()}
          onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handle(e.dataTransfer.files);}}>
          <div style={{fontSize:20}}>＋</div>
          <div style={{fontSize:11,color:G.muted,marginTop:3}}>Photo / File</div>
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*,application/pdf" multiple hidden onChange={e=>handle(e.target.files)}/>
    </div>
  );
}

// ─── Goal Modal ───────────────────────────────────────────────────────────────
function GoalModal({goal,onSave,onClose}){
  const [status,setStatus]=useState(goal.status);
  const [note,setNote]=useState(goal.note||"");
  const [proofs,setProofs]=useState(goal.proofs||[]);
  const cat=CATEGORY_META[goal.category]||{};
  const blocked=status==="completed"&&goal.category==="Volunteer"&&proofs.length===0;
  return (
    <div style={css.overlay} onClick={onClose}>
      <div style={css.modal} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <div style={{fontSize:10,color:G.accent,letterSpacing:"2px",textTransform:"uppercase",marginBottom:4}}>Update Goal</div>
            <div style={{fontSize:19,fontWeight:800}}>{goal.title}</div>
            <div style={{display:"flex",gap:8,marginTop:6}}>
              <span style={css.catBadge(goal.category)}>{cat.icon} {goal.category}</span>
              <span style={{fontSize:12,color:G.muted}}>Due {goal.due}</span>
            </div>
          </div>
          <button onClick={onClose} style={{...css.btn("ghost"),padding:"2px 8px",fontSize:20}}>×</button>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,color:G.muted,marginBottom:8,fontWeight:600}}>STATUS</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {Object.entries(STATUS_META).map(([k,v])=>(
              <button key={k} onClick={()=>setStatus(k)} style={{padding:"7px 14px",borderRadius:10,border:`1.5px solid ${status===k?v.color:"rgba(255,255,255,0.08)"}`,
                background:status===k?v.bg:"transparent",color:status===k?v.color:G.muted,cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"'Syne',sans-serif"}}>
                {v.icon} {v.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,color:G.muted,marginBottom:6,fontWeight:600}}>YOUR NOTE</div>
          <textarea style={css.textarea} rows={3} placeholder="What did you do? Any wins or blockers?" value={note} onChange={e=>setNote(e.target.value)}/>
        </div>
        <div style={{marginBottom:20}}>
          <ProofUpload proofs={proofs} onChange={setProofs} required={goal.category==="Volunteer"}/>
        </div>
        {blocked&&<div style={{background:"rgba(251,146,60,0.1)",border:"1px solid rgba(251,146,60,0.3)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#fb923c",marginBottom:14}}>⚠ Photo proof required to mark Volunteer goal as completed.</div>}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button style={css.btn("ghost")} onClick={onClose}>Cancel</button>
          <button style={{...css.btn("primary"),opacity:blocked?0.4:1}} onClick={()=>!blocked&&onSave({...goal,status,note,proofs})}>Save ✓</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Goal Modal ───────────────────────────────────────────────────────────
function AddGoalModal({member,onSave,onClose}){
  const [title,setTitle]=useState("");
  const [category,setCategory]=useState("Personal");
  const [due,setDue]=useState("");
  const ok=title.trim()&&due;
  return (
    <div style={css.overlay} onClick={onClose}>
      <div style={css.modal} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:10,color:G.accent,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}>New Goal</div>
        <div style={{fontSize:20,fontWeight:800,marginBottom:22}}>Add a Goal</div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,color:G.muted,marginBottom:6,fontWeight:600}}>GOAL TITLE</div>
          <input style={css.input} placeholder="e.g. Read 2 chapters this week" value={title} onChange={e=>setTitle(e.target.value)}/>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,color:G.muted,marginBottom:6,fontWeight:600}}>CATEGORY</div>
          <select style={css.select} value={category} onChange={e=>setCategory(e.target.value)}>
            {Object.keys(CATEGORY_META).map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:G.muted,marginBottom:6,fontWeight:600}}>DUE DATE</div>
          <input style={css.input} type="date" value={due} onChange={e=>setDue(e.target.value)}/>
        </div>
        <div style={{background:G.accentDim,border:`1px solid rgba(74,222,128,0.15)`,borderRadius:10,padding:"10px 14px",fontSize:12,color:G.muted,marginBottom:18}}>
          {CATEGORY_META[category]?.requiresProof?"🤝 Volunteer goals require photo proof when marking complete.":`${CATEGORY_META[category]?.icon} You can attach optional proof when updating this goal.`}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button style={css.btn("ghost")} onClick={onClose}>Cancel</button>
          <button style={{...css.btn("primary"),opacity:ok?1:0.4}} onClick={()=>ok&&onSave({id:Date.now(),memberId:member.id,title:title.trim(),category,status:"on-track",due,proofs:[],note:""})}>Add Goal →</button>
        </div>
      </div>
    </div>
  );
}

// ─── BOOK CLUB TAB ────────────────────────────────────────────────────────────
function BookClubTab({member,members,bookData,onUpdateProgress}){
  const [myPct,setMyPct]=useState(member.bookPct||0);
  const [comment,setComment]=useState("");
  const [discussions,setDiscussions]=useState(bookData.discussions);
  const [toast,setToast]=useState(null);
  const book=bookData.current;
  const avgPct=Math.round(members.filter(m=>m.role==="member").reduce((s,m)=>s+m.bookPct,0)/members.filter(m=>m.role==="member").length);

  const submitComment=()=>{
    if(!comment.trim())return;
    setDiscussions(d=>[...d,{member:member.name,color:member.color,avatar:member.avatar,text:comment,ts:"Just now"}]);
    setComment("");
    setToast("💬 Comment posted!");
  };
  const saveProgress=()=>{
    onUpdateProgress(myPct);
    setToast("📖 Progress saved!");
  };

  return (
    <div>
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}

      {/* Current Book */}
      <div style={{...css.card,background:"linear-gradient(135deg,#0f2418,#0d1a0f)",marginBottom:18,display:"flex",gap:20,alignItems:"center"}}>
        <div style={{width:68,height:92,background:`linear-gradient(135deg,${G.accent},#22c55e)`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0}}>{book.emoji}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:10,color:G.accent,letterSpacing:"2px",textTransform:"uppercase",marginBottom:3}}>Current Read · Cohort 1</div>
          <div style={{fontSize:22,fontWeight:800}}>{book.title}</div>
          <div style={{color:G.muted,fontSize:13,marginBottom:10}}>by {book.author}</div>
          <div style={{display:"flex",gap:16,fontSize:12,color:G.muted}}>
            <span>📍 Chapter {book.chapter} of {book.totalChapters}</span>
            <span>💬 Discussion: {book.discussion}</span>
          </div>
        </div>
        <div style={{textAlign:"center",flexShrink:0}}>
          <div style={{fontSize:28,fontWeight:800,color:G.accent}}>{avgPct}%</div>
          <div style={{fontSize:11,color:G.muted}}>group avg</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
        {/* My progress */}
        <div style={css.card}>
          <div style={css.cardTitle}>My Reading Progress</div>
          <div style={{fontSize:40,fontWeight:800,color:G.accent,marginBottom:4}}>{myPct}%</div>
          <ProgressBar pct={myPct} color={G.accent} height={8}/>
          <div style={{marginTop:18}}>
            <div style={{fontSize:11,color:G.muted,marginBottom:8,fontWeight:600}}>UPDATE MY PROGRESS</div>
            <input type="range" min={0} max={100} value={myPct} onChange={e=>setMyPct(Number(e.target.value))}
              style={{width:"100%",accentColor:G.accent,cursor:"pointer"}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:G.muted,marginTop:2}}>
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
            <button style={{...css.btn("primary"),width:"100%",marginTop:12}} onClick={saveProgress}>Save Progress</button>
          </div>
        </div>

        {/* Group progress */}
        <div style={css.card}>
          <div style={css.cardTitle}>Group Progress</div>
          {members.filter(m=>m.role==="member").map((m,i)=>(
            <div key={m.id} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={css.avatar(m.color,26)}>{m.avatar}</div>
                  <span style={{fontSize:13,fontWeight:600}}>{m.name.split(" ")[0]}</span>
                </div>
                <span style={{fontSize:12,color:m.bookPct===100?G.accent:G.muted,fontWeight:700}}>{m.id===member.id?myPct:m.bookPct}%</span>
              </div>
              <ProgressBar pct={m.id===member.id?myPct:m.bookPct} color={m.bookPct===100?"#4ade80":m.color} height={4}/>
            </div>
          ))}
        </div>
      </div>

      {/* Discussion */}
      <div style={css.card}>
        <div style={css.cardTitle}>Discussion Board</div>
        <div style={{background:"rgba(74,222,128,0.06)",border:`1px solid rgba(74,222,128,0.15)`,borderRadius:12,padding:"14px 16px",marginBottom:18}}>
          <div style={{fontSize:11,color:G.accent,fontWeight:700,letterSpacing:"1px",marginBottom:6}}>💬 THIS WEEK'S PROMPT</div>
          <div style={{fontSize:15,color:"#c8e0cc",fontStyle:"italic"}}>"{book.prompt}"</div>
        </div>
        {discussions.map((d,i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:16,padding:"12px 14px",background:G.faint,borderRadius:12}}>
            <div style={css.avatar(d.color,34)}>{d.avatar}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontWeight:700,fontSize:13,color:G.accent}}>{d.member}</span>
                <span style={{fontSize:11,color:G.muted}}>{d.ts}</span>
              </div>
              <div style={{fontSize:13,color:"#c0d8c4",lineHeight:1.5}}>{d.text}</div>
            </div>
          </div>
        ))}
        <div style={{marginTop:14}}>
          <textarea style={{...css.textarea,marginBottom:10}} rows={3} placeholder="Share your thoughts on this week's reading..." value={comment} onChange={e=>setComment(e.target.value)}/>
          <button style={{...css.btn("primary"),float:"right"}} onClick={submitComment}>Post Comment →</button>
          <div style={{clear:"both"}}/>
        </div>
      </div>

      {/* Past books */}
      <div style={{...css.card,marginTop:18}}>
        <div style={css.cardTitle}>Past Reads</div>
        <div style={{display:"flex",gap:14}}>
          {bookData.past.map((b,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"center",background:G.faint,borderRadius:12,padding:"12px 16px",flex:1}}>
              <div style={{fontSize:28}}>{b.emoji}</div>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{b.title}</div>
                <div style={{fontSize:12,color:G.muted}}>{b.author}</div>
                <div style={{fontSize:12,color:"#f59e0b",marginTop:2}}>{"★".repeat(Math.round(b.rating))} {b.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NUDGES TAB (Admin only) ──────────────────────────────────────────────────
function NudgesTab({members,goals}){
  const done=goals.filter(g=>g.status==="completed").length;
  const totalHrs=members.filter(m=>m.role==="member").reduce((s,m)=>s+Math.floor(m.points/30),0);
  const avgBook=Math.round(members.filter(m=>m.role==="member").reduce((s,m)=>s+m.bookPct,0)/members.filter(m=>m.role==="member").length);
  const topStreak=members.filter(m=>m.role==="member").sort((a,b)=>b.streak-a.streak)[0];
  const atRisk=goals.filter(g=>g.status==="at-risk");
  const [copied,setCopied]=useState(null);
  const copy=(text,id)=>{navigator.clipboard.writeText(text).then(()=>{setCopied(id);setTimeout(()=>setCopied(null),2000);});};

  const nudges=[
    {
      id:"weekly",
      label:"🔥 Weekly Momentum Nudge",
      freq:"Send every Monday",
      msg:`Hey REP fam! 👋\n\nWe're kicking off a new week — time to check in!\n\n📖 Book: "Atomic Habits" — drop a 🔥 if you've read your chapters!\n\n🎯 Goals: Share ONE thing you're committing to finishing before Sunday.\n\n💪 Remember: 1% better every day compounds into something extraordinary.\n\nLet's keep the ripple going! 🌊\n— VOA REP Team`
    },
    {
      id:"monthly",
      label:"📊 Monthly Progress Celebration",
      freq:"Send 1st of each month",
      msg:`🌟 REP Monthly Recap!\n\nLook what we accomplished together this month:\n✅ ${done} goals completed across the group\n⏱ ${totalHrs}+ volunteer hours logged\n📗 Average book progress: ${avgBook}%\n🔥 Top streak: ${topStreak?.name} at ${topStreak?.streak} days!\n\nEvery small action creates a ripple. You are proof. 💚\n\nNext discussion: March 15 — see you there!\n— VOA REP Team`
    },
    {
      id:"atrisk",
      label:"⚠ At-Risk Check-in",
      freq:"Send mid-week as needed",
      msg:`Hey REP fam 💚\n\nA gentle nudge for anyone who's been quiet this week — we see you and we've got you!\n\nNo judgment here. Life happens. But accountability is why we're here.\n\nIf you're struggling with a goal, drop a message in the group. Someone in this circle has been through it.\n\nWe rise together. 🌊\n— VOA REP Team`
    },
    {
      id:"bookclub",
      label:"📖 Book Club Reminder",
      freq:"Send 2 days before discussion",
      msg:`📚 REP Book Club Reminder!\n\nOur discussion for "Atomic Habits" is in 2 days!\n\n💬 This week's prompt:\n"What ONE habit have you started or dropped this month based on the book?"\n\nPrepare your thoughts — everyone shares! 🎤\n\nDate: March 15 · Time: TBD\n\nSee you there! 📗\n— VOA REP Team`
    },
  ];

  return (
    <div>
      <div style={{...css.card,marginBottom:18,background:"linear-gradient(135deg,#0d2214,#0d1a0f)"}}>
        <div style={css.cardTitle}>📲 WhatsApp Nudge Generator</div>
        <div style={{fontSize:13,color:G.muted}}>Ready-to-send messages for your REP WhatsApp group. Copy any message and paste it directly.</div>
        {atRisk.length>0&&(
          <div style={{marginTop:14,background:"rgba(251,146,60,0.08)",border:"1px solid rgba(251,146,60,0.2)",borderRadius:12,padding:"10px 14px"}}>
            <span style={{fontSize:12,color:"#fb923c",fontWeight:700}}>⚠ {atRisk.length} goal{atRisk.length>1?"s":""} at risk</span>
            <span style={{fontSize:12,color:G.muted}}> — consider sending the At-Risk check-in message</span>
          </div>
        )}
      </div>

      {nudges.map(n=>(
        <div key={n.id} style={{...css.card,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:2}}>{n.label}</div>
              <div style={{fontSize:11,color:G.accent,fontWeight:600}}>📅 {n.freq}</div>
            </div>
            <button onClick={()=>copy(n.msg,n.id)} style={{...css.btn("secondary"),fontSize:12,padding:"7px 14px"}}>
              {copied===n.id?"✓ Copied!":"Copy →"}
            </button>
          </div>
          <div style={{background:G.faint,borderRadius:12,padding:"14px 16px",fontSize:13,color:"#c0d8c4",lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"monospace,sans-serif"}}>
            {n.msg}
          </div>
        </div>
      ))}

      {/* Custom message */}
      <div style={css.card}>
        <div style={css.cardTitle}>✍️ Write Custom Message</div>
        <CustomNudge members={members} copy={copy} copied={copied}/>
      </div>
    </div>
  );
}

function CustomNudge({members,copy,copied}){
  const [text,setText]=useState("");
  const placeholders=["[member name]","[goal]","[date]"];
  return (
    <div>
      <textarea style={{...css.textarea,marginBottom:10}} rows={6} placeholder="Write your custom WhatsApp message here..." value={text} onChange={e=>setText(e.target.value)}/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        {placeholders.map(p=>(
          <button key={p} onClick={()=>setText(t=>t+p)} style={{...css.btn("secondary"),fontSize:11,padding:"5px 10px"}}>{p}</button>
        ))}
      </div>
      <button onClick={()=>copy(text,"custom")} style={{...css.btn("primary"),width:"100%"}}>
        {copied==="custom"?"✓ Copied to clipboard!":"Copy Message →"}
      </button>
    </div>
  );
}

// ─── Member Home ──────────────────────────────────────────────────────────────
function MemberHome({member,goals,onUpdateGoal,onAddGoal}){
  const [editGoal,setEditGoal]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [toast,setToast]=useState(null);
  const myGoals=goals.filter(g=>g.memberId===member.id);
  const done=myGoals.filter(g=>g.status==="completed").length;

  return (
    <div style={css.body}>
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
      {editGoal&&<GoalModal goal={editGoal} onSave={u=>{onUpdateGoal(u);setEditGoal(null);setToast("✓ Goal updated!");}} onClose={()=>setEditGoal(null)}/>}
      {showAdd&&<AddGoalModal member={member} onSave={g=>{onAddGoal(g);setShowAdd(false);setToast("🎯 Goal added!");}} onClose={()=>setShowAdd(false)}/>}

      {/* Hero */}
      <div style={{...css.card,background:"linear-gradient(135deg,#0f2418,#0d1a0f)",marginBottom:18,display:"flex",gap:18,alignItems:"center"}}>
        <div style={css.avatar(member.color,52)}>{member.avatar}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:21,fontWeight:800}}>Hey, {member.name.split(" ")[0]} 👋</div>
          <div style={{fontSize:13,color:G.muted,marginTop:2}}>Week of March 7 — Keep the ripple going.</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:30,fontWeight:800,color:G.accent}}>🔥 {member.streak}</div>
          <div style={{fontSize:11,color:G.muted}}>day streak</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:22}}>
        {[{label:"Goals Done",val:`${done}/${myGoals.length}`,icon:"🎯"},{label:"REP Points",val:member.points,icon:"⚡"},{label:"Book Progress",val:`${member.bookPct}%`,icon:"📖"}]
          .map((s,i)=>(
          <div key={i} style={{...css.card,textAlign:"center",padding:"16px 10px"}}>
            <div style={{fontSize:22}}>{s.icon}</div>
            <div style={{fontSize:22,fontWeight:800,color:G.accent}}>{s.val}</div>
            <div style={{fontSize:11,color:G.muted,marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Goals */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={css.cardTitle}>My Goals</div>
        <button style={css.btn("secondary")} onClick={()=>setShowAdd(true)}>+ Add Goal</button>
      </div>
      {myGoals.length===0&&<div style={{...css.card,textAlign:"center",padding:36,color:G.muted}}>No goals yet. Add your first one! 🎯</div>}
      {myGoals.map(g=>{
        const cat=CATEGORY_META[g.category]||{};
        return (
          <div key={g.id} style={css.goalCard} onClick={()=>setEditGoal(g)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:5}}>{g.title}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  <span style={css.catBadge(g.category)}>{cat.icon} {g.category}</span>
                  <span style={{fontSize:11,color:G.muted}}>Due {g.due}</span>
                  {g.proofs?.length>0&&<span style={{fontSize:11,color:"#60a5fa"}}>📎 {g.proofs.length} proof{g.proofs.length>1?"s":""}</span>}
                </div>
                {g.note?<div style={{fontSize:12,color:G.muted,marginTop:7,fontStyle:"italic"}}>"{g.note}"</div>:null}
              </div>
              <div style={{textAlign:"right"}}>
                <span style={css.statusBadge(g.status)}>{STATUS_META[g.status].icon} {STATUS_META[g.status].label}</span>
                <div style={{fontSize:10,color:G.muted,marginTop:5}}>Tap to update →</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Admin View ───────────────────────────────────────────────────────────────
function AdminView({members,goals,onUpdateGoal,bookData}){
  const [tab,setTab]=useState("dashboard");
  const [filter,setFilter]=useState("all");
  const [viewGoal,setViewGoal]=useState(null);
  const [toast,setToast]=useState(null);
  const displayed=filter==="all"?goals:goals.filter(g=>g.status===filter);
  const totalHrs=members.filter(m=>m.role==="member").reduce((s,m)=>s+Math.floor(m.points/30),0);
  const done=goals.filter(g=>g.status==="completed").length;
  const avgBook=Math.round(members.filter(m=>m.role==="member").reduce((s,m)=>s+m.bookPct,0)/members.filter(m=>m.role==="member").length);

  const adminTabs=[{id:"dashboard",label:"📊 Dashboard"},{id:"goals",label:"🎯 Goals"},{id:"nudges",label:"📲 Nudges"}];

  return (
    <div style={css.body}>
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
      {viewGoal&&(
        <div style={css.overlay} onClick={()=>setViewGoal(null)}>
          <div style={css.modal} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:10,color:G.accent,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}>Goal Detail — Admin</div>
            <div style={{fontSize:19,fontWeight:800,marginBottom:4}}>{viewGoal.title}</div>
            <div style={{color:G.muted,fontSize:13,marginBottom:14}}>{members.find(m=>m.id===viewGoal.memberId)?.name} · Due {viewGoal.due}</div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <span style={css.catBadge(viewGoal.category)}>{(CATEGORY_META[viewGoal.category]||{}).icon} {viewGoal.category}</span>
              <span style={css.statusBadge(viewGoal.status)}>{STATUS_META[viewGoal.status].icon} {STATUS_META[viewGoal.status].label}</span>
            </div>
            {viewGoal.note&&<div style={{background:G.faint,borderRadius:10,padding:"10px 14px",fontSize:13,color:G.muted,marginBottom:14,fontStyle:"italic"}}>"{viewGoal.note}"</div>}
            {viewGoal.proofs?.length>0?(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:G.muted,marginBottom:8,fontWeight:600}}>SUBMITTED PROOF</div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {viewGoal.proofs.map((p,i)=>p.type?.startsWith("image")?
                    <img key={i} src={p.url} alt="" style={{width:110,height:110,objectFit:"cover",borderRadius:12,border:`2px solid ${G.border}`}}/>:
                    <div key={i} style={{width:110,height:110,background:G.faint,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:G.muted,textAlign:"center",padding:8}}>📄 {p.name}</div>
                  )}
                </div>
              </div>
            ):<div style={{color:G.muted,fontSize:13,marginBottom:14}}>No proof submitted yet.</div>}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button style={css.btn("ghost")} onClick={()=>setViewGoal(null)}>Close</button>
              <button style={{...css.btn("danger")}} onClick={()=>{onUpdateGoal({...viewGoal,status:"at-risk"});setViewGoal(null);setToast("⚠ Flagged at-risk");}}>⚠ Flag</button>
              <button style={css.btn("primary")} onClick={()=>{onUpdateGoal({...viewGoal,status:"completed"});setViewGoal(null);setToast("✓ Goal approved!");}}>✓ Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin sub-tabs */}
      <div style={{display:"flex",gap:6,marginBottom:22,background:"rgba(255,255,255,0.03)",borderRadius:14,padding:4}}>
        {adminTabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{...css.navItem(tab===t.id),borderRadius:10,padding:"8px 16px",fontSize:13}}>{t.label}</button>
        ))}
      </div>

      {tab==="dashboard"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
            {[{label:"Members",val:members.filter(m=>m.role==="member").length,icon:"👥"},
              {label:"Goals Done",val:`${done}/${goals.length}`,icon:"✅"},
              {label:"Vol. Hours",val:totalHrs,icon:"🤝"},
              {label:"Avg Book",val:`${avgBook}%`,icon:"📗"}].map((s,i)=>(
              <div key={i} style={{...css.card,textAlign:"center"}}>
                <div style={{fontSize:22}}>{s.icon}</div>
                <div style={{fontSize:26,fontWeight:800,color:G.accent}}>{s.val}</div>
                <div style={{fontSize:11,color:G.muted}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={css.card}>
            <div style={css.cardTitle}>Member Overview</div>
            {members.filter(m=>m.role==="member").map(m=>{
              const mg=goals.filter(g=>g.memberId===m.id);
              const d=mg.filter(g=>g.status==="completed").length;
              return (
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${G.border}`}}>
                  <div style={css.avatar(m.color,36)}>{m.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>{m.name}</div>
                    <div style={{fontSize:11,color:G.muted}}>🔥 {m.streak}d · ⚡{m.points}pts · 📖 {m.bookPct}%</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontWeight:700,color:G.accent}}>{d}/{mg.length} goals</div>
                    <div style={{width:80,marginTop:4}}><ProgressBar pct={mg.length?d/mg.length*100:0}/></div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab==="goals"&&(
        <div style={css.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={css.cardTitle}>All Goals</div>
            <div style={{display:"flex",gap:6}}>
              {["all","completed","on-track","at-risk"].map(f=>(
                <button key={f} onClick={()=>setFilter(f)} style={{padding:"4px 11px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,background:filter===f?G.accent:"rgba(255,255,255,0.06)",color:filter===f?G.bg:G.muted}}>
                  {f==="all"?"All":STATUS_META[f]?.label}
                </button>
              ))}
            </div>
          </div>
          {displayed.map(g=>{
            const m=members.find(x=>x.id===g.memberId);
            return (
              <div key={g.id} style={css.goalCard} onClick={()=>setViewGoal(g)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                  <div style={{display:"flex",gap:10,alignItems:"center",flex:1}}>
                    {m&&<div style={css.avatar(m.color,28)}>{m.avatar}</div>}
                    <div>
                      <div style={{fontSize:13,fontWeight:700}}>{g.title}</div>
                      <div style={{display:"flex",gap:8,marginTop:3}}>
                        <span style={css.catBadge(g.category)}>{(CATEGORY_META[g.category]||{}).icon} {g.category}</span>
                        <span style={{fontSize:11,color:G.muted}}>{m?.name} · Due {g.due}</span>
                        {g.proofs?.length>0&&<span style={{fontSize:11,color:"#60a5fa"}}>📸 {g.proofs.length}</span>}
                      </div>
                    </div>
                  </div>
                  <span style={css.statusBadge(g.status)}>{STATUS_META[g.status].icon} {STATUS_META[g.status].label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab==="nudges"&&<NudgesTab members={members} goals={goals}/>}
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({onLogin}){
  const [selected,setSelected]=useState(null);
  const [pin,setPin]=useState("");
  const [error,setError]=useState("");
  const handleNum=n=>{
    if(pin.length>=4)return;
    const next=pin+n;
    setPin(next);
    if(next.length===4){
      setTimeout(()=>{
        if(selected.pin===next)onLogin(selected);
        else{setError("Wrong PIN. Try again.");setPin("");}
      },200);
    }
  };
  return (
    <div style={css.loginWrap}>
      <div style={{textAlign:"center",marginBottom:30}}>
        <div style={{fontSize:10,letterSpacing:"3px",color:G.accent,textTransform:"uppercase",marginBottom:6}}>Volunteers Organization Africa</div>
        <div style={{fontSize:34,fontWeight:800,letterSpacing:"-1px"}}>REP Portal</div>
        <div style={{fontSize:13,color:G.muted,marginTop:4}}>Ripple Effect Program</div>
      </div>
      <div style={css.loginCard}>
        {!selected?(
          <>
            <div style={{fontSize:12,color:G.muted,marginBottom:14}}>Select your name to sign in:</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {MEMBERS_DB.map(m=>(
                <button key={m.id} onClick={()=>setSelected(m)} style={{display:"flex",alignItems:"center",gap:14,padding:"11px 14px",background:G.faint,border:`1px solid ${G.border}`,borderRadius:14,cursor:"pointer",fontFamily:"'Syne',sans-serif",color:G.text}}>
                  <div style={css.avatar(m.color,34)}>{m.avatar}</div>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontWeight:700,fontSize:14}}>{m.name}</div>
                    <div style={{fontSize:11,color:G.muted}}>{m.role==="admin"?"🛡 Admin":`🔥 ${m.streak}d streak`}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ):(
          <>
            <button onClick={()=>{setSelected(null);setPin("");setError("");}} style={{...css.btn("ghost"),padding:"0 0 14px",fontSize:13}}>← Back</button>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
              <div style={css.avatar(selected.color,42)}>{selected.avatar}</div>
              <div><div style={{fontSize:17,fontWeight:800}}>{selected.name}</div><div style={{fontSize:12,color:G.muted}}>Enter your 4-digit PIN</div></div>
            </div>
            <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:26}}>
              {[0,1,2,3].map(i=><div key={i} style={css.pinDot(i<pin.length)}/>)}
            </div>
            {error&&<div style={{color:"#fb923c",fontSize:12,textAlign:"center",marginBottom:12}}>{error}</div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((n,i)=>(
                <button key={i} disabled={n===""} onClick={()=>n==="⌫"?setPin(p=>p.slice(0,-1)):handleNum(String(n))}
                  style={{...css.numBtn,opacity:n===""?0:1}}>{n}</button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [member,setMember]=useState(null);
  const [goals,setGoals]=useStorage("rep_goals_v2",GOALS_SEED);
  const [members,setMembers]=useState(MEMBERS_DB);
  const [tab,setTab]=useState("home");

  const updateGoal=u=>setGoals(gs=>gs.map(g=>g.id===u.id?u:g));
  const addGoal=g=>setGoals(gs=>[...gs,g]);
  const updateBookProgress=(memberId,pct)=>setMembers(ms=>ms.map(m=>m.id===memberId?{...m,bookPct:pct}:m));

  if(!member) return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet"/>
      <LoginScreen onLogin={m=>{setMember(m);setTab("home");}}/>
    </>
  );

  const isAdmin=member.role==="admin";
  const memberNavItems=[
    {id:"home",   label:"🏠 Home"},
    {id:"goals",  label:"🎯 Goals"},
    {id:"books",  label:"📖 Book Club"},
  ];

  return (
    <div style={css.root}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet"/>
      <div style={css.header}>
        <div>
          <div style={{fontSize:10,letterSpacing:"2px",color:G.accent,textTransform:"uppercase"}}>VOA · REP</div>
          <div style={{fontSize:15,fontWeight:800,lineHeight:1}}>Member Portal</div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {!isAdmin&&memberNavItems.map(n=>(
            <button key={n.id} style={css.navItem(tab===n.id)} onClick={()=>setTab(n.id)}>{n.label}</button>
          ))}
          <div style={{...css.avatar(member.color,30),cursor:"pointer",marginLeft:8}} onClick={()=>setMember(null)} title="Sign out">{member.avatar}</div>
        </div>
      </div>

      {isAdmin
        ? <AdminView members={members} goals={goals} onUpdateGoal={updateGoal} bookData={BOOK_CLUB}/>
        : tab==="home"  ? <MemberHome member={member} goals={goals} onUpdateGoal={updateGoal} onAddGoal={addGoal}/>
        : tab==="goals" ? <MemberHome member={member} goals={goals} onUpdateGoal={updateGoal} onAddGoal={addGoal}/>
        : <BookClubTab member={member} members={members} bookData={BOOK_CLUB} onUpdateProgress={pct=>updateBookProgress(member.id,pct)}/>
      }
    </div>
  );
}
