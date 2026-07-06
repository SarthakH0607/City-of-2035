import { useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";

const suggestions = [
  "Show traffic in downtown",
  "How is the air quality?",
  "Best route to central station",
];

function getAiResponse(input) {
  const text = input.toLowerCase();

  if (text.includes("traffic")) {
    return "Traffic update: Central loop is at 78% capacity. Harbor corridor is smooth with green flow.";
  }
  if (text.includes("air")) {
    return "Air quality remains stable. Current city-wide AQI is 62 with cleaner zones in the north eco-sector.";
  }
  if (text.includes("route")) {
    return "Recommended route: Eco corridor via Solar Avenue. ETA 24 minutes with low pollution and medium crowd.";
  }

  return "I can help with traffic, air quality, and route planning. Try asking one of those keywords.";
}

function AIAssistant() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageIdRef = useRef(2);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "Welcome to City AI. Ask about traffic, air, or route intelligence.",
    },
  ]);

  const emptyState = messages.length < 2;

  const nextId = () => {
    const id = messageIdRef.current;
    messageIdRef.current += 1;
    return id;
  };

  const sendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: nextId(),
      sender: "user",
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          sender: "assistant",
          text: getAiResponse(textToSend),
        },
      ]);
    }, 950);
  };

  return (
    <section className="glass h-full rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">AI City Assistant</h3>
        <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-2 py-1 text-xs text-emerald-200">
          online
        </span>
      </div>

      <div className="h-72 space-y-2 overflow-y-auto rounded-xl border border-white/8 bg-black/20 p-3">
        <AnimatePresence>
          {messages.map((msg) => (
            <Motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                msg.sender === "user"
                  ? "ml-auto bg-cyan-400/15 text-cyan-100"
                  : "border border-white/10 bg-slate-900/70 text-slate-100"
              }`}
            >
              {msg.text}
            </Motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-fit rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-300"
          >
            AI is typing...
          </Motion.div>
        )}

        {emptyState && <div className="skeleton h-12 rounded-lg" />}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => sendMessage(q)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-300/30 hover:text-cyan-100"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about traffic, air, or route..."
          className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/45"
        />
        <Motion.button
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.02 }}
          type="submit"
          className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-900"
        >
          Send
        </Motion.button>
      </form>
    </section>
  );
}

export default AIAssistant;


