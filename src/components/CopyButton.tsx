import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CopyButton({
    text,
    className = "",
}: {
    text: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            aria-label="Copy message"
            className={`p-1.5 rounded-lg hover:bg-subtle active:scale-95 transition
                  ${className}`}
        >
            {copied ? (
                <Check size={14} className="text-green-500" />
            ) : (
                <Copy size={14} className="text-inkMuted" />
            )}
        </button>
    );
}