"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage("Merci ! Vous êtes inscrit.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Erreur");
      }
    } catch {
      setStatus("error");
      setMessage("Erreur réseau");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        disabled={status === "loading"}
        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
      >
        {status === "loading" ? "..." : "OK"}
      </button>
      {status === "success" && <p className="text-green-400 text-xs mt-1">{message}</p>}
      {status === "error" && <p className="text-red-400 text-xs mt-1">{message}</p>}
    </form>
  );
}
