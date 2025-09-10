import React, { useEffect, useRef, useState } from "react";

// EmployeeTaskPage.tsx
// Focused view for ONE employee (e.g., Mr. X) showing their assigned tasks only.
// - Not a full table of all employees anymore.
// - Lists tasks for the logged-in/selected employee.
// - Shows task status, timers, and inline actions.

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
    // Mock: this page is for Mr. X
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

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-[#141414] mb-4">Tasks for {employeeName}</h2>
            <div className="space-y-4">
                {tasks.map((t) => {
                    const timers = computeTimers(t);
                    return (
                        <div key={t.id} className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-medium text-[#141414]">{t.title}</h3>
                                    <div className="text-xs text-[#6C584C] mt-1">ID: {t.id}</div>
                                </div>
                                <div className="text-sm font-medium text-[#141414]">{t.state}</div>
                            </div>

                            {(t.state === "IN_PROGRESS" || t.state === "BEFORE_UPLOADED") && (
                                <div className="mt-3">
                                    <div className="text-xs text-[#6C584C]">Before photo timer</div>
                                    <div className="w-full bg-[#EBF2FA] h-2 rounded-full overflow-hidden mt-1">
                                        <div style={{ width: `${timers.beforePercent}%`, background: "#38B000", height: 8 }} />
                                    </div>
                                    <div className="text-xs text-[#6C584C] mt-1">{formatSeconds(timers.beforeRemaining)}</div>
                                </div>
                            )}

                            {t.state === "MARKED_COMPLETE" && (
                                <div className="mt-3">
                                    <div className="text-xs text-[#6C584C]">After photo timer</div>
                                    <div className="w-full bg-[#EBF2FA] h-2 rounded-full overflow-hidden mt-1">
                                        <div style={{ width: `${timers.afterPercent}%`, background: "#38B000", height: 8 }} />
                                    </div>
                                    <div className="text-xs text-[#6C584C] mt-1">{formatSeconds(timers.afterRemaining)}</div>
                                </div>
                            )}

                            <div className="mt-3 flex flex-wrap gap-2">
                                {t.state === "ASSIGNED" && (
                                    <button onClick={() => handleStart(t.id)} className="py-1 px-3 rounded-md bg-[#38B000] text-white text-sm">Start</button>
                                )}

                                {(t.state === "IN_PROGRESS" || t.state === "BEFORE_UPLOADED") && (
                                    <>
                                        <input ref={(el) => (beforeRefs.current[t.id] = el)} type="file" accept="image/*" className="hidden" onChange={(e) => handleBeforeUpload(t.id, e.target.files?.[0] ?? null)} />
                                        <button onClick={() => beforeRefs.current[t.id]?.click()} className="py-1 px-3 rounded-md bg-white border border-[#6C584C] text-sm">
                                            {t.beforePhoto ? "Replace Before" : "Upload Before"}
                                        </button>
                                        <button disabled={!t.beforePhoto} onClick={() => handleMarkComplete(t.id)} className={`py-1 px-3 rounded-md text-sm ${t.beforePhoto ? "bg-[#38B000] text-white" : "bg-[#EBF2FA] text-[#6C584C]"}`}>
                                            Mark Complete
                                        </button>
                                    </>
                                )}

                                {t.state === "MARKED_COMPLETE" && (
                                    <>
                                        <input ref={(el) => (afterRefs.current[t.id] = el)} type="file" accept="image/*" className="hidden" onChange={(e) => handleAfterUpload(t.id, e.target.files?.[0] ?? null)} />
                                        <button onClick={() => afterRefs.current[t.id]?.click()} className="py-1 px-3 rounded-md bg-white border border-[#6C584C] text-sm">Upload After</button>
                                    </>
                                )}

                                {t.state === "COMPLETED" && (
                                    <div className="text-sm text-green-700">Completed ✓</div>
                                )}
                                {t.state === "ESCALATED" && (
                                    <div className="text-sm text-red-600">Escalated — missed deadline</div>
                                )}
                            </div>

                            {t.beforePhoto?.url && (
                                <div className="mt-3">
                                    <div className="text-xs text-[#6C584C]">Before photo preview</div>
                                    <img src={t.beforePhoto.url} alt="before" className="w-full h-36 object-cover rounded-md mt-1" />
                                </div>
                            )}
                            {t.afterPhoto?.url && (
                                <div className="mt-3">
                                    <div className="text-xs text-[#6C584C]">After photo preview</div>
                                    <img src={t.afterPhoto.url} alt="after" className="w-full h-36 object-cover rounded-md mt-1" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}