import React, { useEffect, useRef, useState } from "react";

type TaskState =
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "BEFORE_UPLOADED"
    | "MARKED_COMPLETE"
    | "AFTER_UPLOADED"
    | "COMPLETED"
    | "ESCALATED";

type PhotoMeta = { url?: string; uploadedAt?: string };

type Task = {
    id: string;
    title: string;
    state: TaskState;
    acceptedAt?: string | null;
    markedCompleteAt?: string | null;
    beforePhoto?: PhotoMeta;
    afterPhoto?: PhotoMeta;
};

const BEFORE_WINDOW_SECONDS = 5 * 60;
const AFTER_WINDOW_SECONDS = 5 * 60;

function formatSeconds(sec: number) {
    if (sec < 0) sec = 0;
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

export default function EmployeeTaskPage() {
    const employeeName = "Mr. X";
    const initialTasks: Task[] = [
        { id: "T-2001", title: "Clear Block A3 drain", state: "ASSIGNED" },
        { id: "T-2002", title: "Empty street dustbin #12", state: "ASSIGNED" },
    ];

    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [now, setNow] = useState<number>(Date.now());
    const tickRef = useRef<number | null>(null);

    useEffect(() => {
        tickRef.current = window.setInterval(() => setNow(Date.now()), 1000);
        return () => { if (tickRef.current) window.clearInterval(tickRef.current); };
    }, []);

    function updateTask(id: string, patch: Partial<Task>) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    }

    function handleStart(id: string) {
        const nowIso = new Date().toISOString();
        updateTask(id, { state: "IN_PROGRESS", acceptedAt: nowIso });
    }

    function handleMarkComplete(id: string) {
        const nowIso = new Date().toISOString();
        updateTask(id, { state: "MARKED_COMPLETE", markedCompleteAt: nowIso });
    }

    async function mockUploadFile(file: File) {
        const url = URL.createObjectURL(file);
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 500));
        return { url, uploadedAt: new Date().toISOString() } as PhotoMeta;
    }

    async function handleBeforeUpload(id: string, file?: File | null) {
        if (!file) return;
        const meta = await mockUploadFile(file);
        updateTask(id, { beforePhoto: meta, state: "BEFORE_UPLOADED" });
    }

    async function handleAfterUpload(id: string, file?: File | null) {
        if (!file) return;
        const meta = await mockUploadFile(file);
        updateTask(id, { afterPhoto: meta, state: "AFTER_UPLOADED" });
        setTimeout(() => updateTask(id, { state: "COMPLETED" }), 300);
    }

    function computeTimers(t: Task) {
        const acceptedMs = t.acceptedAt ? new Date(t.acceptedAt).getTime() : null;
        const markedMs = t.markedCompleteAt ? new Date(t.markedCompleteAt).getTime() : null;

        let beforeElapsed = 0,
            beforeRemaining = BEFORE_WINDOW_SECONDS,
            beforePercent = 0;
        let afterElapsed = 0,
            afterRemaining = AFTER_WINDOW_SECONDS,
            afterPercent = 0;

        if (acceptedMs) {
            beforeElapsed = Math.floor((now - acceptedMs) / 1000);
            beforeRemaining = BEFORE_WINDOW_SECONDS - beforeElapsed;
            beforePercent = Math.max(0, Math.min(100, (beforeElapsed / BEFORE_WINDOW_SECONDS) * 100));
        }

        if (markedMs) {
            afterElapsed = Math.floor((now - markedMs) / 1000);
            afterRemaining = AFTER_WINDOW_SECONDS - afterElapsed;
            afterPercent = Math.max(0, Math.min(100, (afterElapsed / AFTER_WINDOW_SECONDS) * 100));
        }

        return { beforeRemaining, beforePercent, afterRemaining, afterPercent };
    }

    const beforeRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const afterRefs = useRef<Record<string, HTMLInputElement | null>>({});

    useEffect(() => {
        tasks.forEach((t) => {
            const { beforeRemaining, afterRemaining } = computeTimers(t);
            if (t.state === "IN_PROGRESS" && beforeRemaining <= 0) updateTask(t.id, { state: "ESCALATED" });
            if (t.state === "MARKED_COMPLETE" && afterRemaining <= 0) updateTask(t.id, { state: "ESCALATED" });
        });
    }, [now]);

    const getStateColor = (state: TaskState) => {
        switch (state) {
            case "ASSIGNED": return "bg-blue-50 text-blue-700 border-blue-200";
            case "IN_PROGRESS": return "bg-orange-50 text-orange-700 border-orange-200";
            case "BEFORE_UPLOADED": return "bg-purple-50 text-purple-700 border-purple-200";
            case "MARKED_COMPLETE": return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "AFTER_UPLOADED": return "bg-indigo-50 text-indigo-700 border-indigo-200";
            case "COMPLETED": return "bg-green-50 text-green-700 border-green-200";
            case "ESCALATED": return "bg-red-50 text-red-700 border-red-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EBF2FA] via-white to-[#EBF2FA]">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
                <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-4xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-[#141414]">Task Dashboard</h1>
                        <p className="text-sm sm:text-base text-[#6C584C] mt-1">Welcome back, {employeeName}</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 text-center border border-gray-100">
                        <div className="text-lg sm:text-2xl font-bold text-[#38B000]">{tasks.length}</div>
                        <div className="text-xs sm:text-sm text-[#6C584C]">Total Tasks</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 text-center border border-gray-100">
                        <div className="text-lg sm:text-2xl font-bold text-blue-600">{tasks.filter(t => t.state === "ASSIGNED").length}</div>
                        <div className="text-xs sm:text-sm text-[#6C584C]">Pending</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 text-center border border-gray-100">
                        <div className="text-lg sm:text-2xl font-bold text-orange-600">{tasks.filter(t => ["IN_PROGRESS", "BEFORE_UPLOADED", "MARKED_COMPLETE"].includes(t.state)).length}</div>
                        <div className="text-xs sm:text-sm text-[#6C584C]">Active</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 text-center border border-gray-100">
                        <div className="text-lg sm:text-2xl font-bold text-green-600">{tasks.filter(t => t.state === "COMPLETED").length}</div>
                        <div className="text-xs sm:text-sm text-[#6C584C]">Done</div>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-4 sm:space-y-6">
                    {tasks.map((t) => {
                        const timers = computeTimers(t);
                        return (
                            <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                {/* Task Header */}
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-base sm:text-lg font-semibold text-[#141414] leading-tight">{t.title}</h3>
                                            <div className="text-xs sm:text-sm text-[#6C584C] mt-1 font-mono">ID: {t.id}</div>
                                        </div>
                                        <div className="flex justify-center sm:justify-end">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStateColor(t.state)}`}>
                                                {t.state.replace("_", " ")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Timer Sections */}
                                    {(t.state === "IN_PROGRESS" || t.state === "BEFORE_UPLOADED") && (
                                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                                            <div className="text-center">
                                                <div className="text-xs sm:text-sm font-semibold text-orange-700 mb-2">Before Photo Timer</div>
                                                <div className="w-full bg-white/80 h-2 sm:h-3 rounded-full overflow-hidden shadow-inner">
                                                    <div 
                                                        style={{ 
                                                            width: `${timers.beforePercent}%`, 
                                                            background: "linear-gradient(90deg, #38B000, #4CAF50)",
                                                            transition: "width 0.3s ease"
                                                        }} 
                                                        className="h-full rounded-full"
                                                    />
                                                </div>
                                                <div className="text-lg sm:text-xl font-bold text-orange-700 mt-2">{formatSeconds(timers.beforeRemaining)}</div>
                                                <div className="text-xs text-orange-600">remaining</div>
                                            </div>
                                        </div>
                                    )}

                                    {t.state === "MARKED_COMPLETE" && (
                                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl border border-yellow-100">
                                            <div className="text-center">
                                                <div className="text-xs sm:text-sm font-semibold text-yellow-700 mb-2">After Photo Timer</div>
                                                <div className="w-full bg-white/80 h-2 sm:h-3 rounded-full overflow-hidden shadow-inner">
                                                    <div 
                                                        style={{ 
                                                            width: `${timers.afterPercent}%`, 
                                                            background: "linear-gradient(90deg, #38B000, #4CAF50)",
                                                            transition: "width 0.3s ease"
                                                        }} 
                                                        className="h-full rounded-full"
                                                    />
                                                </div>
                                                <div className="text-lg sm:text-xl font-bold text-yellow-700 mt-2">{formatSeconds(timers.afterRemaining)}</div>
                                                <div className="text-xs text-yellow-600">remaining</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center">
                                        {t.state === "ASSIGNED" && (
                                            <button 
                                                onClick={() => handleStart(t.id)} 
                                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#38B000] to-green-500 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                            >
                                                🚀 Start Task
                                            </button>
                                        )}

                                        {(t.state === "IN_PROGRESS" || t.state === "BEFORE_UPLOADED") && (
                                            <>
                                                <input 
                                                    ref={(el) => (beforeRefs.current[t.id] = el)} 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={(e) => handleBeforeUpload(t.id, e.target.files?.[0] ?? null)} 
                                                />
                                                <button 
                                                    onClick={() => beforeRefs.current[t.id]?.click()} 
                                                    className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white border-2 border-[#6C584C] text-[#6C584C] font-semibold hover:bg-[#6C584C] hover:text-white transition-all duration-200 shadow-sm"
                                                >
                                                    📸 {t.beforePhoto ? "Replace Before" : "Upload Before"}
                                                </button>
                                                <button 
                                                    disabled={!t.beforePhoto} 
                                                    onClick={() => handleMarkComplete(t.id)} 
                                                    className={`w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm ${
                                                        t.beforePhoto 
                                                        ? "bg-gradient-to-r from-[#38B000] to-green-500 text-white hover:shadow-lg transform hover:scale-105" 
                                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    }`}
                                                >
                                                    ✅ Mark Complete
                                                </button>
                                            </>
                                        )}

                                        {t.state === "MARKED_COMPLETE" && (
                                            <>
                                                <input 
                                                    ref={(el) => (afterRefs.current[t.id] = el)} 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={(e) => handleAfterUpload(t.id, e.target.files?.[0] ?? null)} 
                                                />
                                                <button 
                                                    onClick={() => afterRefs.current[t.id]?.click()} 
                                                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                >
                                                    📷 Upload After Photo
                                                </button>
                                            </>
                                        )}

                                        {t.state === "COMPLETED" && (
                                            <div className="flex items-center justify-center w-full py-3 text-green-700 font-semibold">
                                                <span className="text-2xl mr-2">🎉</span>
                                                Task Completed Successfully!
                                            </div>
                                        )}

                                        {t.state === "ESCALATED" && (
                                            <div className="flex items-center justify-center w-full py-3 text-red-600 font-semibold bg-red-50 rounded-xl border border-red-200">
                                                <span className="text-2xl mr-2">⚠️</span>
                                                Escalated — Deadline Missed
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Photo Previews */}
                                {(t.beforePhoto?.url || t.afterPhoto?.url) && (
                                    <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {t.beforePhoto?.url && (
                                                <div>
                                                    <div className="text-xs sm:text-sm font-semibold text-[#6C584C] mb-2 text-center">📸 Before Photo</div>
                                                    <div className="relative group">
                                                        <img 
                                                            src={t.beforePhoto.url} 
                                                            alt="before" 
                                                            className="w-full h-40 sm:h-48 object-cover rounded-xl shadow-md border border-gray-200 group-hover:shadow-lg transition-shadow duration-300" 
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-300 flex items-center justify-center">
                                                            <span className="text-white text-sm opacity-0 group-hover:opacity-100 font-semibold">Click to view</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {t.afterPhoto?.url && (
                                                <div>
                                                    <div className="text-xs sm:text-sm font-semibold text-[#6C584C] mb-2 text-center">📷 After Photo</div>
                                                    <div className="relative group">
                                                        <img 
                                                            src={t.afterPhoto.url} 
                                                            alt="after" 
                                                            className="w-full h-40 sm:h-48 object-cover rounded-xl shadow-md border border-gray-200 group-hover:shadow-lg transition-shadow duration-300" 
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-300 flex items-center justify-center">
                                                            <span className="text-white text-sm opacity-0 group-hover:opacity-100 font-semibold">Click to view</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {tasks.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-semibold text-[#141414] mb-2">No tasks assigned</h3>
                        <p className="text-[#6C584C]">You're all caught up! Check back later for new assignments.</p>
                    </div>
                )}
            </div>
        </div>
    );
}