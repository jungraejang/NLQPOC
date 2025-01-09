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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#3a7bd5] to-[#00d2ff]">
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold">
              Natural Language Query Testing App
            </h1>
            <h3 className="text-sm md:text-base">
              Type your query and get data from mock client DB
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Type your query here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:flex-1 p-2 rounded-md text-black"
            />
            <button
              onClick={sendQuery}
              className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Send
            </button>
          </div>

          <div className="text-center text-sm md:text-base">
            Sample Query:{" "}
            <span className="text-black font-bold">
              Find all clients who are from China and younger than 30
            </span>
          </div>

          {error && (
            <div className="text-red-500 text-center">Error: {error}</div>
          )}

          <div className="bg-white rounded-lg p-4 overflow-hidden">
            <h2 className="mb-4 font-semibold">Results</h2>
            <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">ID</TableHead>
                        <TableHead className="whitespace-nowrap">
                          Client ID
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          First Name
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Last Name
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Email
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Gender
                        </TableHead>
                        <TableHead className="whitespace-nowrap">DOB</TableHead>
                        <TableHead className="whitespace-nowrap">
                          Nationality
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Status
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Arrival Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.length > 0 ? (
                        results.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="whitespace-nowrap">
                              {item._id}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {item.client_id}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {item.first_name}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {item.last_name}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {item.email}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {item.gender}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {item.dob}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {item.nationality}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {item.current_status}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {item.arrival_date}
                            </TableCell>
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
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-4">
        All Rights Reserved Coding Hwaesa Inc.
      </footer>
    </div>
  );
}
