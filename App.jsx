import React, { useState } from "react";
import axios from "axios";

function App() {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");

  const handleUpload = async () => {
    try {
      const res = await axios.post("http://localhost:3000/upload", {
        code: code,
        board: "arduino:avr:uno",  // Change based on your board
        port: "COM3"               // Update based on your system
      });
      setResponse(res.data.message);
    } catch (err) {
      setResponse(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Arduino Uploader</h1>
      <textarea
        rows={10}
        cols={50}
        placeholder="Write your Arduino code here"
        onChange={(e) => setCode(e.target.value)}
      />
      <br />
      <button onClick={handleUpload}>Upload to Arduino</button>
      <pre>{response}</pre>
    </div>
  );
}

export default App;
