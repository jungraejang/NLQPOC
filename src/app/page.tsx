/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <h1 className="text-4xl font-bold">
          Natural Language Query Testing App
        </h1>
        <h3>Type your query and get data from mock client DB</h3>
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
            className="bg-black text-white px-4 py-2 rounded-md"
            style={{
              marginLeft: "10px",
              padding: "8px 16px",
            }}
          >
            Send
          </button>
        </div>
        <div>
          Sample Query: Find all clients who are from China and younger than 30
        </div>

        {error && <div style={{ color: "red" }}>Error: {error}</div>}

        <div className="w-[90%] overflow-x-auto bg-white rounded-lg p-4">
          <h2 className="mb-4">Results</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>Arrival Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length > 0 ? (
                results.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item._id}</TableCell>
                    <TableCell>{item.client_id}</TableCell>
                    <TableCell>{item.first_name}</TableCell>
                    <TableCell>{item.last_name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.gender}</TableCell>
                    <TableCell>{item.dob}</TableCell>
                    <TableCell>{item.nationality}</TableCell>
                    <TableCell>{item.current_status}</TableCell>
                    <TableCell>{item.arrival_date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
