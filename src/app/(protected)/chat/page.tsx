"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import { CopyButton } from "@/components/CopyButton";

import { useEffect, useRef, useState } from "react";
import {
    Plus,
    Globe,
    Rocket,
    ImageIcon,
    MoreHorizontal,
    Mic2,
    ArrowUp,
} from "lucide-react";

type ChatMessage = {
    sender: "user" | "bot";
    text: string;
};

export default function HomePage() {
    // --- audio WS (unchanged) ---
    const wsAudioRef = useRef<WebSocket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recording, setRecording] = useState(false);
    const [loadingAudio, setLoadingAudio] = useState(false);

    // --- agent WS & chat state ---
    const wsAgentRef = useRef<WebSocket | null>(null);
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");

    // keep track of last response_id
    const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);

    const endOfChatRef = useRef<HTMLDivElement | null>(null);

    // Initialize or re‐initialize audio WebSocket
    const initAudioSocket = () => {
        if (wsAudioRef.current) wsAudioRef.current.close();
        const ws = new WebSocket("ws://localhost:8000/ws/audio");
        ws.binaryType = "arraybuffer";
        ws.onmessage = (evt) => {
            setInputText(evt.data as string);
            setLoadingAudio(false);
            initAudioSocket(); // ready for next recording
        };
        ws.onerror = () => setLoadingAudio(false);
        wsAudioRef.current = ws;
    };

    useEffect(() => {
        initAudioSocket();
        return () => {
            wsAudioRef.current?.close();
            wsAgentRef.current?.close();
        };
    }, []);

    useEffect(() => {
        // smooth scroll each time a chunk arrives
        endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);


    // Audio record toggle
    const handleAudioToggle = async () => {
        const ws = wsAudioRef.current!;
        if (!recording) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mr = new MediaRecorder(stream);
            mr.ondataavailable = (e) => {
                if (e.data.size > 0) ws.send(e.data);
            };
            mr.start(250);
            mediaRecorderRef.current = mr;
            setRecording(true);
        } else {
            mediaRecorderRef.current!.stop();
            ws.send(JSON.stringify({ event: "STOP" }));
            setRecording(false);
            setLoadingAudio(true);
        }
    };

    // Send user message to agent and stream back
    const handleSend = () => {
        const text = inputText.trim();
        if (!text) return;

        // 1) add user bubble
        setChat((c) => [...c, { sender: "user", text }]);
        setInputText("");

        // 2) add empty bot bubble to fill in
        setChat((c) => [...c, { sender: "bot", text: "" }]);

        // 3) open agent WS
        if (wsAgentRef.current) wsAgentRef.current.close();
        const ws = new WebSocket("ws://localhost:8000/ws/agent");

        ws.onopen = () => {
            // include previous_response_id if we have one
            ws.send(
                JSON.stringify({
                    input: text,
                    previous_response_id: previousResponseId,
                })
            );
        };

        ws.onmessage = (evt) => {
            const data = JSON.parse(evt.data);

            // capture response_id on first event
            if (data.last_response_id) {
                setPreviousResponseId(data.last_response_id);
            }

            if (data.delta !== undefined) {
                setChat((prev) => {
                    const copy = [...prev];
                    const last = copy.pop()!;
                    const chunk = data.delta as string;

                    // only append if it's not already at the end
                    if (!last.text.endsWith(chunk)) {
                        last.text = last.text + chunk;
                    }

                    copy.push(last);
                    return copy;
                });
            }

            // you could also handle data.done here if needed
        };

        ws.onerror = console.error;
        ws.onclose = () => {
            console.log("Agent WS closed");
        };

        wsAgentRef.current = ws;
    };

    function normalizeMathDelimiters(s: string) {
        // turn \[  …  \]  into  $$ … $$
        return s.replace(/\\\[/g, "$$").replace(/\\\]/g, "$$");
    }

    const stopWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();   // don’t let it reach the chat scroller
    };

    const chatStarted = chat.length > 0;

    return (
        <div className={`flex flex-col h-screen bg-surface text-ink overflow-hidden
                     ${chatStarted ? "" : "justify-center"}`}>

            {!chatStarted && (
                <h1 className="text-3xl md:text-4xl font-semibold mb-10 text-center">
                    What&rsquo;s on the agenda today?
                </h1>
            )}

            {/* ─── chat history ─────────────────────────────────────── */}
            {chatStarted && (
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {chat.map((m, i) => (
                        <div key={i}
                            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`relative max-w-[70%] rounded-2xl px-4 py-2 whitespace-pre-wrap
                      ${m.sender === "user"
                                        ? "bg-brand text-surface"
                                        : "bg-subtle text-ink"}`}
                            >

                                <CopyButton
                                    text={m.text}
                                    className="sticky top-4 right-0 ml-auto opacity-0
                   group-hover:opacity-100"
                                />
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {normalizeMathDelimiters(m.text)}
                                </ReactMarkdown>
                                {m.text.length > 0 && <CopyButton text={m.text} />}
                            </div>
                        </div>
                    ))}
                    <div ref={endOfChatRef} />
                </div>
            )}

            {/* ─── input card ───────────────────────────────────────── */}
            <div className="w-full max-w-[700px] mx-auto px-4">
                <div className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm"
                    onWheel={stopWheel}
                >
                    {/* top row */}
                    <div className="flex items-center gap-3">
                        <IconCircle><Plus size={20} /></IconCircle>

                        <input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask anything"
                            className="flex-1 bg-transparent outline-none placeholder-inkMuted text-base"
                        />

                        <IconCircle onClick={handleAudioToggle}>
                            {recording ? (
                                <Mic2 size={20} className="text-red-500 animate-pulse" />
                            ) : loadingAudio ? (
                                <Spinner />
                            ) : (
                                <Mic2 size={20} />
                            )}
                        </IconCircle>

                        <IconCircle onClick={handleSend} className="bg-brand hover:bg-brand-dark">
                            <ArrowUp size={20} className="text-surface" />
                        </IconCircle>
                    </div>

                    {/* chips */}
                    <div className="flex items-center flex-wrap gap-3 mt-3">
                        <IconPill icon={<Globe size={16} />} label="Search" />
                        <IconPill icon={<Rocket size={16} />} label="Deep research" />
                        <IconPill icon={<ImageIcon size={16} />} label="Create image" />
                        <IconCircle><MoreHorizontal size={18} /></IconCircle>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── small helpers ───────────────────────────────────────── */

function IconCircle({
    children,
    onClick,
    className = "",
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-10 h-10 flex items-center justify-center rounded-full
                  hover:bg-brand-light transition ${className}`}
        >
            {children}
        </button>
    );
}

function IconPill({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button className="flex items-center gap-1 px-3 h-9 rounded-full
                       border border-border hover:bg-brand-light text-sm">
            {icon}
            {label}
        </button>
    );
}

function Spinner() {
    return (
        <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
    );
}