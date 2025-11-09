// pages/index.jsx
import { useState, useEffect } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [hairType, setHairType] = useState("Curly");
  const [skinType, setSkinType] = useState("Normal");
  const [occasion, setOccasion] = useState("Casual");
  const [suggestion, setSuggestion] = useState(
    'Upload a photo and click "Get My Groomify Tips"'
  );
  const [tips] = useState([
    "Smile gently before starting a conversation to appear approachable.",
    "Breathe slowly for 3 deep breaths when you feel nervous.",
    "Keep eye contact for ~3 seconds, then look away briefly.",
    "Ask open questions — people love to share about themselves.",
    "Practice a short introduction about yourself (20–30 seconds).",
  ]);
  const [completedTips, setCompletedTips] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("groomify_completed")) || [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [records, setRecords] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("groomify_records")) || [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("groomify_completed", JSON.stringify(completedTips));
    }
  }, [completedTips]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("groomify_records", JSON.stringify(records));
    }
  }, [records]);

  function handlePhotoChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFile(f);
    const u = URL.createObjectURL(f);
    setPhotoUrl(u);
  }

  function generateSuggestion() {
    const hairMap = {
      Curly:
        "Embrace your curls: use a lightweight curl cream and diffuse for volume. Try a shorter tapered side for a modern look.",
      Straight:
        "Add texture with a light paste or salt spray. A layered cut adds movement. Consider medium length with side part.",
      Wavy:
        "Enhance waves with a light mousse and scrunching. Go for a textured medium-length cut.",
    };
    const skinMap = {
      Oily:
        "Use oil-free cleanser and a lightweight mattifying moisturizer. Don’t skip SPF — use a gel-based SPF.",
      Dry: "Use a hydrating cleanser and richer moisturizer. Add a gentle exfoliation 1–2x per week.",
      Normal:
        "Keep a simple routine: gentle cleanser, moisturizer, and daily SPF.",
    };
    const occasionMap = {
      Casual:
        "For casual looks: relaxed hair, minimal product; clean, well-fitted casual shirt is great.",
      Date: "For a date: slightly polished — neat hair, subtle fragrance, and a well-ironed shirt. Warm colors work well.",
      Interview:
        "For interviews: conservative and neat. Clean haircut, simple outfit (solid colors), and confident posture.",
    };

    const combined = `${hairMap[hairType]} ${skinMap[skinType]} ${occasionMap[occasion]}`;
    setSuggestion(combined);

    const rec = {
      id: Date.now(),
      name: name || "Anonymous",
      hairType,
      skinType,
      occasion,
      createdAt: new Date().toISOString(),
    };
    setRecords((prev) => [rec, ...prev]);
    setMessage("Tips generated — saved locally in your browser.");
    setTimeout(() => setMessage(""), 2500);
  }

  function toggleTip(i) {
    setCompletedTips((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-md p-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Groomify AI</h1>
            <p className="text-sm text-gray-500">Look good. Feel confident.</p>
          </div>
          <div className="text-sm text-gray-400">by Ronit Roy</div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel */}
          <section className="col-span-1 bg-gray-50 p-4 rounded-lg">
            <h2 className="font-medium mb-3">Upload & Details</h2>
            <div className="flex flex-col gap-3">
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />

              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="preview"
                  className="h-40 w-full object-cover rounded-md"
                />
              ) : (
                <div className="h-40 w-full rounded-md border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                  Upload a selfie
                </div>
              )}

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="px-3 py-2 rounded-md border border-gray-200"
              />

              <select
                value={hairType}
                onChange={(e) => setHairType(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-200"
              >
                <option>Curly</option>
                <option>Straight</option>
                <option>Wavy</option>
              </select>

              <select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-200"
              >
                <option>Normal</option>
                <option>Oily</option>
                <option>Dry</option>
              </select>

              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-200"
              >
                <option>Casual</option>
                <option>Date</option>
                <option>Interview</option>
              </select>

              <button
                onClick={generateSuggestion}
                className="mt-2 w-full px-4 py-2 rounded-lg bg-sky-600 text-white font-medium"
              >
                Get My Groomify Tips
              </button>
              <p className="text-xs text-gray-400 mt-2">
                Photos remain in your browser (prototype). Add privacy policy
                for public launch.
              </p>
            </div>
          </section>

          {/* Right Panel */}
          <section className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg">
            <h2 className="font-medium mb-3">Grooming Suggestions</h2>
            <div className="p-4 rounded-md border border-gray-100 bg-gray-50 mb-4">
              <p className="text-sm text-gray-600">{suggestion}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Confidence Tips */}
              <div>
                <h3 className="text-sm font-medium mb-2">Confidence Coach</h3>
                <ul className="space-y-2">
                  {tips.map((t, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-2 rounded-md border border-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={completedTips.includes(i)}
                        onChange={() => toggleTip(i)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-sm">{t}</div>
                        <div className="text-xs text-gray-400">
                          Practice tip
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Records */}
              <div>
                <h3 className="text-sm font-medium mb-2">Prototype Records</h3>
                <p className="text-xs text-gray-400 mb-2">
                  Saved locally in your browser
                </p>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {records.length === 0 ? (
                    <p className="text-xs text-gray-400">
                      No records yet — generate tips to save a record.
                    </p>
                  ) : (
                    records.map((r) => (
                      <div
                        key={r.id}
                        className="p-2 border rounded-md bg-gray-50 text-xs"
                      >
                        <div className="font-medium">{r.name}</div>
                        <div className="text-gray-500">
                          {r.hairType} • {r.skinType} • {r.occasion}
                        </div>
                        <div className="text-gray-400">
                          {new Date(r.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {message && (
              <div className="mt-4 text-sm text-sky-600">{message}</div>
            )}
          </section>
        </main>

        <footer className="mt-6 text-xs text-gray-400 text-center">
          Prototype • Groomify AI • Demo only — add privacy & legal before
          public launch.
        </footer>
      </div>
    </div>
  );
}
