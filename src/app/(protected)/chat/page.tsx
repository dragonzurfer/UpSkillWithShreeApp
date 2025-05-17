"use client";

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
            ws.send(JSON.stringify({ input: text }));
        };
        ws.onmessage = (evt) => {
            const data = JSON.parse(evt.data);
            // append each delta to the last bot message
            if (data.delta) {
                setChat((c) => {
                    const copy = [...c];
                    const last = copy.pop()!;
                    last.text += data.delta;
                    return [...copy, last];
                });
            }
            // you could also handle response_id / done flags here
        };
        ws.onerror = console.error;
        ws.onclose = () => {
            console.log("Agent WS closed");
        };
        wsAgentRef.current = ws;
    };

    return (
        <div className="flex flex-col h-screen bg-[#0F1118] text-white">
            {/* Chat history */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {chat.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${m.sender === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-800 text-gray-100"
                                }`}
                        >
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input area */}
            <div className="bg-[#20232A] px-5 py-3 shadow-md">
                <div className="flex flex-col max-w-3xl mx-auto">
                    {/* top row */}
                    <div className="flex items-center">
                        <button className="p-2 rounded-full hover:bg-[#2C2F36] transition">
                            <Plus size={24} />
                        </button>
                        <input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask anything"
                            className="flex-grow bg-transparent placeholder-[#D7DBE0] focus:outline-none text-lg mx-4"
                        />
                        <button
                            onClick={handleAudioToggle}
                            className="p-2 rounded-full hover:bg-[#2C2F36] transition"
                        >
                            {recording ? (
                                <Mic2 size={24} className="text-red-400 animate-pulse" />
                            ) : loadingAudio ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Mic2 size={24} />
                            )}
                        </button>
                        <button
                            onClick={handleSend}
                            className="p-2 ml-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
                        >
                            <ArrowUp size={24} />
                        </button>
                    </div>

                    {/* bottom row */}
                    <div className="flex items-center justify-center space-x-4 mt-3">
                        <button className="flex items-center space-x-2 px-3 py-1 rounded-full hover:bg-[#2C2F36] transition">
                            <Globe size={18} />
                            <span className="text-sm">Search</span>
                        </button>
                        <button className="flex items-center space-x-2 px-3 py-1 rounded-full hover:bg-[#2C2F36] transition">
                            <Rocket size={18} />
                            <span className="text-sm">Deep research</span>
                        </button>
                        <button className="flex items-center space-x-2 px-3 py-1 rounded-full hover:bg-[#2C2F36] transition">
                            <ImageIcon size={18} />
                            <span className="text-sm">Create image</span>
                        </button>
                        <button className="p-2 rounded-full hover:bg-[#2C2F36] transition">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
