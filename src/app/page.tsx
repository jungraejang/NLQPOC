/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");

  const sendQuery = async () => {
    console.log("Sending query:", query);
    setError("");
    setResults([]);

    try {
      const response = await axios.post("/api/query", { query });
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setResults(response.data.results);
        console.log("response.data.results", response.data.results);
      }
    } catch (err) {
      console.error("Error sending query:", err);
      setError("Error sending query");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "space-between",
        background: "linear-gradient(to bottom, #3a7bd5, #00d2ff)",
      }}
    >
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          gap: "20px",
          padding: "20px",
        }}
      >
        <h1>NL Query Test</h1>
        <div>
          <input
            type="text"
            placeholder="Type your query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "600px",
              padding: "8px",
              color: "black",
            }}
          />
          <button
            onClick={sendQuery}
            style={{
              marginLeft: "10px",
              padding: "8px 16px",
            }}
          >
            Send
          </button>
        </div>

        {error && <div style={{ color: "red" }}>Error: {error}</div>}

        {results.length > 0 && (
          <div style={{ width: "90%", overflowX: "auto" }}>
            <h2>Results</h2>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={thStyle}>_id</th>
                  <th style={thStyle}>client_id</th>
                  <th style={thStyle}>first_name</th>
                  <th style={thStyle}>last_name</th>
                  <th style={thStyle}>email</th>
                  <th style={thStyle}>gender</th>
                  <th style={thStyle}>dob</th>
                  <th style={thStyle}>nationality</th>
                  <th style={thStyle}>current_status</th>
                  <th style={thStyle}>arrival_date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{item._id}</td>
                    <td style={tdStyle}>{item.client_id}</td>
                    <td style={tdStyle}>{item.first_name}</td>
                    <td style={tdStyle}>{item.last_name}</td>
                    <td style={tdStyle}>{item.email}</td>
                    <td style={tdStyle}>{item.gender}</td>
                    <td style={tdStyle}>{item.dob}</td>
                    <td style={tdStyle}>{item.nationality}</td>
                    <td style={tdStyle}>{item.current_status}</td>
                    <td style={tdStyle}>{item.arrival_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <footer
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        All Rights Reserved Coding Hwaesa Inc.
      </footer>
    </div>
  );
}

// Some simple styling for table cells
const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#333",
  color: "#fff",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
};
