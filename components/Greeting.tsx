"use client";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", emoji: "☀️" };
  if (hour < 18) return { text: "Good afternoon", emoji: "🌤️" };
  return { text: "Good evening", emoji: "🌙" };
}

export default function Greeting() {
  const { text, emoji } = getGreeting();

  return (
    <div>
      <p className="text-xs text-gray-400">
        {text} {emoji}
      </p>
      <p className="text-sm font-bold text-gray-900">Emmanuel Israel</p>
    </div>
  );
}
