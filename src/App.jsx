import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, User, Lock, Terminal, Plus, Link2, 
  CheckSquare, Square, ExternalLink, ArrowLeft, 
  UserCircle, Building, Hash, Copy, UserPlus, 
  Shield, Check, X, MessageSquare, Globe, Mail, 
  Send, Server, Sparkles, BrainCircuit
} from "lucide-react";

const TOTAL_HOURS = 36;

function genId(length = 6) {
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase();
}

function getPressureColor(hoursPassed) {
  if (hoursPassed <= 12) return { bar: "bg-green-500", text: "text-green-400", label: "STABLE" };
  if (hoursPassed <= 24) return { bar: "bg-yellow-500", text: "text-yellow-400", label: "TENSE" };
  return { bar: "bg-red-500", text: "text-red-400", label: "CRITICAL" };
}

function formatForInput(dateObj) {
  const offset = dateObj.getTimezoneOffset() * 60000;
  return new Date(dateObj.getTime() - offset).toISOString().slice(0, 16);
}

// Built-in curated hackathon brainstorm starters
const BRAINSTORM_IDEAS = [
  "Crowdsourced campus micro-grants voting portal",
  "Real-time event lost-and-found map with photo verification",
  "Peer study sprint matcher with automatic 25-minute pomodoro rooms",
  "Automated resume bullet point quantifer and ATS checker"
];

export default function HackathonSurvivalApp() {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profile, setProfile] = useState({ id: "", name: "", school: "", pronouns: "", status: "team" });
  const [activeAppView, setActiveAppView] = useState("project");

  // Network State
  const [teamRoster, setTeamRoster] = useState([]); 
  const [friends, setFriends] = useState([{ id: "ALEX99", name: "AlexC" }]);

  // Project State
  const [coreIdea, setCoreIdea] = useState("");
  const [resources, setResources] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [aiInsight, setAiInsight] = useState("");
  
  // Timer State
  const [startTime, setStartTime] = useState(() => formatForInput(new Date()));
  const [hoursPassed, setHoursPassed] = useState(0);

  // Local input buffers
  const [ideaDraft, setIdeaDraft] = useState("");
  const [taskDraft, setTaskDraft] = useState("");
  const [resourceTitleDraft, setResourceTitleDraft] = useState("");
  const [resourceUrlDraft, setResourceUrlDraft] = useState("");

  // Automatic Timer Calculation
  useEffect(() => {
    const calculateTime = () => {
      const startMs = new Date(startTime).getTime();
      const nowMs = Date.now();
      if (isNaN(startMs)) return;
      const hrsPassed = (nowMs - startMs) / (1000 * 60 * 60);
      setHoursPassed(Math.max(0, hrsPassed));
    };
    calculateTime();
    const interval = setInterval(calculateTime, 10000);
    return () => clearInterval(interval);
  }, [startTime]);

  const pressure = useMemo(() => getPressureColor(hoursPassed), [hoursPassed]);
  const progressPct = Math.min(100, Math.max(0, (hoursPassed / TOTAL_HOURS) * 100));

  function handleProfileComplete() {
    if (!profile.id) setProfile(prev => ({ ...prev, id: genId(6) }));
    setIsProfileComplete(true);
    if (profile.status === "team" && activeAppView === "project" && coreIdea === "") {
      setActiveAppView("tavern");
    }
  }

  function lockIdea() {
    const trimmed = ideaDraft.trim();
    if (!trimmed) return;
    setCoreIdea(trimmed);
  }

  function addCustomTask(taskText) {
    const text = typeof taskText === 'string' ? taskText : taskDraft;
    const trimmed = text.trim();
    if (!trimmed) return;
    setCustomTasks((prev) => [...prev, { id: genId(), text: trimmed, isCompleted: false }]);
    setTaskDraft("");
  }

  function toggleTask(id) {
    setCustomTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  }

  function addResource() {
    const title = resourceTitleDraft.trim();
    const url = resourceUrlDraft.trim();
    if (!title || !url) return;
    setResources((prev) => [...prev, { id: genId(), title, url }]);
    setResourceTitleDraft("");
    setResourceUrlDraft("");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-mono selection:bg-amber-500/30 pb-20 flex flex-col">
      <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            <div className="flex-1">
              <div className="flex items-center justify-between md:justify-start gap-4">
                <div className="flex items-center gap-2 text-xs tracking-wide text-neutral-400">
                  <Terminal size={14} className="text-amber-400" />
                  <span>survival_protocol.sh</span>
                </div>
                
                {/* Visual Timer Layout */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-500">Start Time:</span>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 focus:border-amber-500 outline-none px-2 py-0.5 text-neutral-300 rounded-sm"
                  />
                </div>
              </div>
              
              <div className={`mt-2 flex items-center gap-2 text-xs tracking-wide ${pressure.text}`}>
                <span>H+{hoursPassed.toFixed(2)} / {TOTAL_HOURS} HRS</span>
                <span className="text-neutral-600">·</span>
                <span>{pressure.label}</span>
              </div>
              <div className="mt-1 h-1.5 w-full bg-neutral-900 border border-neutral-800 overflow-hidden max-w-sm">
                <div className={`h-full ${pressure.bar} transition-all duration-1000`} style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isProfileComplete && (
                <>
                  <div className="flex items-center gap-1 border border-neutral-800 bg-neutral-900/50 p-1">
                    <button onClick={() => setActiveAppView("project")} className={`flex items-center gap-2 px-3 py-1.5 text-xs transition-colors cursor-pointer ${activeAppView === "project" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-amber-400"}`}>
                      <Server size={14} /> Project Matrix
                    </button>
                    <button onClick={() => setActiveAppView("tavern")} className={`flex items-center gap-2 px-3 py-1.5 text-xs transition-colors cursor-pointer ${activeAppView === "tavern" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-amber-400"}`}>
                      <MessageSquare size={14} /> Enter Tavern
                    </button>
                  </div>
                  <button onClick={() => setIsProfileComplete(false)} title="Edit Profile" className="flex items-center justify-center p-2 text-neutral-500 hover:text-amber-400 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors cursor-pointer rounded-sm">
                    <UserCircle size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 py-6">
        {!isProfileComplete && <StepProfile profile={profile} setProfile={setProfile} onComplete={handleProfileComplete} />}
        
        {isProfileComplete && activeAppView === "tavern" && (
          <StepTavern profile={profile} teamRoster={teamRoster} setTeamRoster={setTeamRoster} friends={friends} setFriends={setFriends} onGoToProject={() => setActiveAppView("project")} />
        )}

        {isProfileComplete && activeAppView === "project" && (
          <>
            {coreIdea === "" ? (
              <StepIdeaLock ideaDraft={ideaDraft} setIdeaDraft={setIdeaDraft} onLock={lockIdea} />
            ) : (
              <StepMatrix
                isSolo={profile.status === "solo"}
                coreIdea={coreIdea}
                customTasks={customTasks}
                taskDraft={taskDraft}
                setTaskDraft={setTaskDraft}
                onAddTask={addCustomTask}
                onToggleTask={toggleTask}
                resources={resources}
                resourceTitleDraft={resourceTitleDraft}
                setResourceTitleDraft={setResourceTitleDraft}
                resourceUrlDraft={resourceUrlDraft}
                setResourceUrlDraft={setResourceUrlDraft}
                onAddResource={addResource}
                onPivot={() => { setCoreIdea(""); setAiInsight(""); setCustomTasks([]); }}
                teamRoster={teamRoster}
                onManageTeam={() => setActiveAppView("tavern")}
                aiInsight={aiInsight}
                setAiInsight={setAiInsight}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function StepProfile({ profile, setProfile, onComplete }) {
  const isFormValid = profile.name.trim() !== "" && profile.school.trim() !== "";
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl text-neutral-100">Hacker Registration</h1>
      </div>
      <div className="w-full max-w-md flex flex-col gap-4 text-left">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-500 flex items-center gap-2"><UserCircle size={12}/> Name / Alias</label>
          <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-neutral-900 border border-neutral-800 focus:border-amber-500 outline-none px-3 py-2 text-sm text-neutral-100" autoFocus />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-neutral-500 flex items-center gap-2"><Building size={12}/> Affiliation / School</label>
            <input type="text" value={profile.school} onChange={(e) => setProfile({ ...profile, school: e.target.value })} className="bg-neutral-900 border border-neutral-800 focus:border-amber-500 outline-none px-3 py-2 text-sm text-neutral-100" />
          </div>
          <div className="flex flex-col gap-1 w-1/3">
            <label className="text-xs text-neutral-500 flex items-center gap-2"><Hash size={12}/> Pronouns</label>
            <input type="text" value={profile.pronouns} onChange={(e) => setProfile({ ...profile, pronouns: e.target.value })} placeholder="e.g. they/them" className="bg-neutral-900 border border-neutral-800 focus:border-amber-500 outline-none px-3 py-2 text-sm text-neutral-100" />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-xs text-neutral-500">Builder Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setProfile({ ...profile, status: "team" })} className={`px-3 py-3 text-xs border transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 ${profile.status === "team" ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-neutral-600"}`}>
              <span className="font-bold">Team Mode</span><span className="text-[10px] opacity-70">Form, join, or manage</span>
            </button>
            <button onClick={() => setProfile({ ...profile, status: "solo" })} className={`px-3 py-3 text-xs border transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 ${profile.status === "solo" ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-neutral-600"}`}>
              <span className="font-bold">Lone Wolf</span><span className="text-[10px] opacity-70">Building solo</span>
            </button>
          </div>
        </div>
        <button onClick={onComplete} disabled={!isFormValid} className="mt-4 w-full bg-amber-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 disabled:cursor-not-allowed px-4 py-3 text-sm hover:bg-amber-400 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold">
          {profile.id ? "Update Profile" : "Initialize Profile"}
        </button>
      </div>
    </div>
  );
}

function StepTavern({ profile, teamRoster, setTeamRoster, friends, setFriends, onGoToProject }) {
  const [activeTab, setActiveTab] = useState("roster"); 
  const displayRoster = [{ id: profile.id, name: profile.name, school: profile.school, isMe: true }, ...teamRoster];
  const [inviteInput, setInviteInput] = useState("");

  function handleInvite(e) {
    e.preventDefault();
    if (!inviteInput.trim()) return;
    setTeamRoster([...teamRoster, { id: inviteInput.toUpperCase(), name: "Unknown Builder", school: "Network", isMe: false }]);
    setInviteInput("");
  }
  function handleRemoveMember(idToRemove) { setTeamRoster(teamRoster.filter(member => member.id !== idToRemove)); }

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 animate-in fade-in duration-300 h-full">
      <div className="w-full md:w-64 flex flex-col gap-6 shrink-0">
        <div className="border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col gap-1">
          <span className="text-[10px] text-amber-500 tracking-widest uppercase">Your Broadcast ID</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-neutral-100">{profile.id}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-neutral-600 font-bold mb-1 tracking-widest">NETWORKS</span>
          <button onClick={() => setActiveTab("global")} className={`flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer ${activeTab === "global" ? "bg-neutral-800 text-amber-400" : "hover:bg-neutral-900/50 text-neutral-400"}`}><Globe size={14} /> # global-chat</button>
          <button onClick={() => setActiveTab("roster")} className={`flex items-center justify-between px-3 py-2 text-sm text-left transition-colors cursor-pointer ${activeTab === "roster" ? "bg-neutral-800 text-amber-400" : "hover:bg-neutral-900/50 text-neutral-400"}`}>
            <span className="flex items-center gap-2"><Shield size={14} /> My Team Roster</span>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded">{teamRoster.length + 1}/4</span>
          </button>
        </div>
      </div>
      <div className="flex-1 border border-neutral-800 bg-neutral-900/20 flex flex-col min-h-[500px]">
        {activeTab === "global" && (
          <div className="flex-1 flex items-center justify-center text-neutral-500 italic text-sm">Global broadcast active. Connect with builders across teams.</div>
        )}
        {activeTab === "roster" && (
           <div className="flex flex-col h-full">
             <div className="border-b border-neutral-800 px-4 py-3 bg-neutral-900/50 flex items-center justify-between">
               <div className="flex items-center gap-2 text-sm text-amber-400 tracking-wide font-bold"><Shield size={16}/> SQUAD MANAGER</div>
               <button onClick={onGoToProject} className="text-xs border border-amber-500/50 hover:bg-amber-500 hover:text-neutral-950 text-amber-400 px-3 py-1 transition-colors cursor-pointer">Go to Project Matrix</button>
             </div>
             <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto">
               <div className="flex flex-col gap-4">
                 <span className="flex items-center gap-2 text-neutral-400 text-xs tracking-widest border-b border-neutral-800 pb-2"><UserPlus size={14} className="text-amber-400" /> INVITE BY ID</span>
                 <form onSubmit={handleInvite} className="flex gap-2">
                   <input type="text" value={inviteInput} onChange={(e) => setInviteInput(e.target.value)} placeholder="e.g. M92KLA" className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none px-3 py-2 text-sm text-neutral-100 uppercase max-w-sm" />
                   <button type="submit" className="bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 px-4 py-2 text-sm transition-colors cursor-pointer">Send</button>
                 </form>
               </div>
               <div className="flex flex-col gap-4 mt-4">
                 <div className="flex items-center justify-between text-xs tracking-widest border-b border-neutral-800 pb-2">
                   <span className="flex items-center gap-2 text-neutral-400"><Users size={14} className="text-amber-400" /> ACTIVE ROSTER</span>
                   <span className="text-amber-500">{displayRoster.length} / 4</span>
                 </div>
                 <ul className="flex flex-col gap-2">
                   {displayRoster.map(member => (
                     <li key={member.id} className="flex items-center justify-between border border-neutral-800 bg-neutral-900/50 px-4 py-3">
                       <div className="flex flex-col"><span className="text-sm text-neutral-200 flex items-center gap-2">{member.name} {member.isMe && <span className="text-[10px] bg-amber-500 text-neutral-950 px-1 rounded-sm">YOU</span>}</span><span className="text-xs text-neutral-500">{member.school}</span></div>
                       <div className="flex items-center gap-4"><span className="text-xs text-neutral-600 font-mono">{member.id}</span>{!member.isMe && <button onClick={() => handleRemoveMember(member.id)} className="text-red-900 hover:text-red-400 transition-colors cursor-pointer"><X size={16} /></button>}</div>
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}

function StepIdeaLock({ ideaDraft, setIdeaDraft, onLock }) {
  const [showStarters, setShowStarters] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center animate-in fade-in duration-300">
      <div>
        <p className="text-amber-400 text-xs tracking-widest mb-2">[ SCOPE LOCK ]</p>
        <h1 className="text-2xl md:text-3xl text-neutral-100">What is your ONE core feature?</h1>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-3">
        <input
          type="text"
          value={ideaDraft}
          onChange={(e) => setIdeaDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onLock()}
          placeholder="e.g. Real-time voting on submitted memes"
          className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 outline-none px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          <button 
            type="button"
            onClick={() => setShowStarters(!showStarters)} 
            className="flex items-center justify-center gap-2 border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300 px-4 py-3 text-sm transition-colors cursor-pointer"
          >
            <Sparkles size={14} className="text-amber-500" />
            {showStarters ? "Hide Starters" : "Idea Starters"}
          </button>
          <button onClick={onLock} disabled={!ideaDraft.trim()} className="flex items-center justify-center gap-2 bg-amber-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 disabled:cursor-not-allowed px-4 py-3 text-sm hover:bg-amber-400 transition-colors cursor-pointer font-bold">
            <Lock size={14} /> Lock Idea
          </button>
        </div>

        {showStarters && (
          <div className="mt-4 flex flex-col gap-2 text-left animate-in slide-in-from-bottom-2">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Click to auto-fill:</span>
            {BRAINSTORM_IDEAS.map((idea, i) => (
              <button 
                key={i} 
                type="button"
                onClick={() => { setIdeaDraft(idea); setShowStarters(false); }}
                className="text-left text-xs bg-neutral-900/50 hover:bg-amber-500/10 border border-neutral-800 hover:border-amber-500/50 p-2.5 transition-colors text-neutral-300 cursor-pointer"
              >
                {idea}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
/* ============================================================
   PROJECT MATRIX: System Design Architecture Blueprint
   ============================================================ */
function SystemDesignBlueprint() {
  const [nodes, setNodes] = useState([
    { id: "1", tier: "Client / Interface", name: "Responsive React / Vite PWA", role: "UI rendering & local state" },
    { id: "2", tier: "API / Gateway", name: "Client-Side Event Router", role: "Channel routing & direct payload dispatch" },
    { id: "3", tier: "Storage / Engine", name: "In-Memory Session Store", role: "Ephemeral roster & scope tracking" }
  ]);
  const [tier, setTier] = useState("Client / Interface");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const TIERS = ["Client / Interface", "API / Gateway", "Compute & Engine", "Storage / DB", "External Services"];

  function handleAddNode(e) {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;
    setNodes(prev => [...prev, { id: genId(4), tier, name: name.trim(), role: role.trim() }]);
    setName("");
    setRole("");
  }

  function handleRemoveNode(id) {
    setNodes(prev => prev.filter(n => n.id !== id));
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-2 text-xs tracking-widest text-neutral-400">
          <Server size={14} className="text-amber-400" />
          SYSTEM DESIGN TOPOLOGY
        </div>
        <span className="text-[10px] text-amber-500 font-mono">{nodes.length} COMPONENTS ACTIVE</span>
      </div>

      {/* Form: Add Component to Topology */}
      <form onSubmit={handleAddNode} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-neutral-900/40 p-3 border border-neutral-800">
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none px-2 py-1.5 text-xs text-neutral-300"
        >
          {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Service / Component Name"
          className="bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none px-3 py-1.5 text-xs text-neutral-100"
        />
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role / Responsibility"
          className="bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none px-3 py-1.5 text-xs text-neutral-100"
        />
        <button
          type="submit"
          className="bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 text-xs px-3 py-1.5 transition-colors cursor-pointer flex items-center justify-center gap-1 font-bold"
        >
          <Plus size={12} /> Add Component
        </button>
      </form>

      {/* Visual Pipeline Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {nodes.map((node, index) => (
          <div key={node.id} className="relative border border-neutral-800 bg-neutral-900/60 p-3.5 flex flex-col justify-between gap-2 group hover:border-amber-500/60 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-500 tracking-wider font-mono uppercase bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/20">
                {node.tier}
              </span>
              <button
                onClick={() => handleRemoveNode(node.id)}
                className="text-neutral-600 hover:text-red-400 transition-colors cursor-pointer"
                title="Remove component"
              >
                <X size={12} />
              </button>
            </div>
            <div>
              <div className="text-sm text-neutral-100 font-bold tracking-tight">{node.name}</div>
              <div className="text-xs text-neutral-400 mt-1">{node.role}</div>
            </div>
            <div className="text-[10px] text-neutral-600 font-mono pt-1 border-t border-neutral-800/80 flex items-center justify-between">
              <span>NODE_0{index + 1}</span>
              <span>SYNCED</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function StepMatrix({
  isSolo, coreIdea, customTasks, taskDraft, setTaskDraft, onAddTask, onToggleTask, 
  resources, resourceTitleDraft, setResourceTitleDraft, resourceUrlDraft, setResourceUrlDraft,
  onAddResource, onPivot, teamRoster, onManageTeam, aiInsight, setAiInsight
}) {
  const matrixTasks = isSolo ? ["The Happy Path (Make it work)", "The Polish (Make it look good)"] : ["The Happy Path", "The Edge Cases", "The Polish"];

  // Check if all custom tasks exist and are completed
  const isEverythingCompleted = customTasks.length > 0 && customTasks.every(t => t.isCompleted);

  function handleAutoSprintTasks() {
    onAddTask("Wire client state & input handlers");
    onAddTask("Implement core output display & loading state");
    onAddTask("Format responsive mobile layout & pitch screen");
    setAiInsight("Judge Expansion Hook: Frame this MVP as the foundation for decentralized, multi-campus builder sync across university hackathons.");
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* SUCCESS BANNER */}
      {isEverythingCompleted && (
        <div className="border border-green-500/50 bg-green-500/10 p-6 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300 rounded-sm">
          <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2 text-lg">
            <Check size={20} /> ALL TASKS COMPLETED
          </h3>
          <p className="text-sm text-green-100/90 mb-4 max-w-md">
            Excellent work! Make sure to create and post your Devpost submission before the final deadline hits.
          </p>
          <a
            href="https://shellhacks-2026.devpost.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-400 text-neutral-950 px-6 py-2.5 font-bold text-sm transition-colors cursor-pointer flex items-center gap-2"
          >
            Submit to ShellHacks 2026 <ExternalLink size={14} />
          </a>
        </div>
      )}

      <div className="border border-amber-500/40 bg-amber-500/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs tracking-widest mb-1"><Lock size={12} /> LOCKED SCOPE</div>
          <p className="text-neutral-100 text-lg">{coreIdea}</p>
        </div>
        <button onClick={onPivot} className="shrink-0 flex items-center gap-2 text-xs text-neutral-500 hover:text-red-400 transition-colors border border-neutral-800 hover:border-red-900/50 bg-neutral-950 px-3 py-2 cursor-pointer"><ArrowLeft size={12} /> Pivot Idea</button>
      </div>

      {aiInsight && (
        <div className="border border-amber-500/30 bg-amber-500/10 p-5 rounded-sm animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs tracking-widest mb-2 font-bold"><BrainCircuit size={14} /> PITCH VISION</div>
          <p className="text-sm text-amber-100/90 leading-relaxed">{aiInsight}</p>
        </div>
      )}

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h2 className="text-xs tracking-widest text-neutral-500">DEPTH MATRIX</h2>
          {!isSolo && (
             <div className="flex items-center gap-2">
               <div className="text-xs text-amber-500/70 border border-amber-500/30 px-2 py-1 bg-amber-500/10 font-bold">Networked: +{teamRoster.length} Members</div>
               <button onClick={onManageTeam} className="text-xs text-neutral-400 hover:text-amber-400 border border-neutral-800 hover:border-amber-500 bg-neutral-950 px-3 py-1 transition-colors cursor-pointer flex items-center gap-1"><Users size={12} /> Manage</button>
             </div>
          )}
        </div>
        <ol className="border border-neutral-800 divide-y divide-neutral-800">
          {matrixTasks.map((task, i) => (
             <li key={task} className="flex items-center gap-4 px-4 py-3 bg-neutral-900/40"><span className="text-amber-400 text-sm w-5">{i + 1}.</span><span className="text-neutral-200 text-sm">{task}</span></li>
          ))}
        </ol>
      </section>
      {/* System Design Blueprint Section */}
      <SystemDesignBlueprint />
      <section>
        <h2 className="text-xs tracking-widest text-neutral-500 mb-3">WORKSPACE</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-neutral-800 bg-neutral-900/40 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-400 text-xs tracking-widest"><CheckSquare size={14} className="text-amber-400" /> CHECKLIST</div>
              <button onClick={handleAutoSprintTasks} className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500 hover:text-neutral-950 px-2 py-1 transition-colors cursor-pointer">
                <Sparkles size={10} /> Auto-Sprint
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); onAddTask(); }} className="flex gap-2">
              <input type="text" value={taskDraft} onChange={(e) => setTaskDraft(e.target.value)} placeholder="Add a task..." className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none px-3 py-2 text-sm text-neutral-100" />
              <button type="submit" className="flex items-center gap-1 bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 px-3 py-2 text-sm transition-colors cursor-pointer"><Plus size={14} /></button>
            </form>
            <ul className="flex flex-col divide-y divide-neutral-800">
              {customTasks.length === 0 && <li className="text-neutral-600 text-xs py-3">No tasks yet.</li>}
              {customTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 py-2">
                  <button onClick={() => onToggleTask(task.id)} className="text-amber-400 shrink-0 cursor-pointer">{task.isCompleted ? <CheckSquare size={16} /> : <Square size={16} className="text-neutral-600" />}</button>
                  <span className={`text-sm ${task.isCompleted ? "text-neutral-600 line-through" : "text-neutral-200"}`}>{task.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-neutral-800 bg-neutral-900/40 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-neutral-400 text-xs tracking-widest"><Link2 size={14} className="text-amber-400" /> RESOURCE DROP</div>
            <form onSubmit={(e) => { e.preventDefault(); onAddResource(); }} className="flex flex-col gap-2">
              <input type="text" value={resourceTitleDraft} onChange={(e) => setResourceTitleDraft(e.target.value)} placeholder="Title" className="bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none px-3 py-2 text-sm text-neutral-100" />
              <input type="text" value={resourceUrlDraft} onChange={(e) => setResourceUrlDraft(e.target.value)} placeholder="https://..." className="bg-neutral-950 border border-neutral-800 focus:border-amber-500 outline-none px-3 py-2 text-sm text-neutral-100" />
              <button type="submit" className="flex items-center justify-center gap-1 bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 px-3 py-2 text-sm transition-colors cursor-pointer"><Plus size={14} /> Add Link</button>
            </form>
            <ul className="flex flex-col gap-2">
              {resources.length === 0 && <li className="text-neutral-600 text-xs py-1">No resources yet.</li>}
              {resources.map((res) => (
                <li key={res.id}>
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 border border-neutral-800 hover:border-amber-500 px-3 py-2 text-sm text-neutral-200 hover:text-amber-400 transition-colors">
                    <span className="truncate">{res.title}</span><ExternalLink size={12} className="shrink-0 text-neutral-600" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}