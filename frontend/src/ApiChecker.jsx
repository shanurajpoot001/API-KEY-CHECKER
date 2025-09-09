import { useState } from "react";
import "./ApiChecker.css";

function ApiChecker() {
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");

  const handleCheck = async () => {
  setResult("⏳ Checking...");
  try {
    const res = await fetch("https://api-key-checker-1.onrender.com/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();
    setResult(data.message);
  } catch (err) {
    setResult("❌ Backend Error");
    console.error(err);
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">🔑 Multi-API Key Validator</h1>
      <input
        type="text"
        placeholder="Enter your API Key..."
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="p-2 border rounded w-96 mb-3"
      />
      <button
        onClick={handleCheck}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Check
      </button>
      <p className="mt-4 text-lg">{result}</p>
    </div>
  );
}

export default ApiChecker;
