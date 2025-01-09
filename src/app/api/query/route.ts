/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/query/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/app/utils/db";
import { getMongoQueryFromGPT } from "@/app/utils/openai";

export async function POST(req: NextRequest) {
  try {
    // 1. Get user query from request body
    const body = await req.json();
    const userQuery = body.query;

    // 2. Ask GPT to produce a MongoDB filter (in JSON)
    const gptResponse = await getMongoQueryFromGPT(userQuery);
    console.log("gptResponse", gptResponse);

    let mongoFilter: any = {};
    try {
      mongoFilter = JSON.parse(gptResponse);
    } catch (err) {
      return NextResponse.json(
        { error: "GPT returned invalid JSON" },
        { status: 400 }
      );
    }

    // If GPT responded with an error or an empty object
    if (mongoFilter.error) {
      return NextResponse.json({ error: mongoFilter.error }, { status: 400 });
    }
    if (Object.keys(mongoFilter).length === 0) {
      return NextResponse.json({ error: "Empty filter" }, { status: 400 });
    }

    // **Call fixDateExpressions here** to convert {"$date": "..."} to real Dates
    mongoFilter = fixDateExpressions(mongoFilter);
    console.log("Fixed date filter:", JSON.stringify(mongoFilter, null, 2));

    // 3. Connect to MongoDB
    const client = await connectToDB();
    const db = client.db();
    const usersCollection = db.collection("Clients");

    // 4. Run the query
    const results = await usersCollection.find(mongoFilter).toArray();

    // 5. Send results back
    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Error in POST /api/query:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// The same fixDateExpressions function, but called after parse
function fixDateExpressions(filter: any): any {
  // If the filter uses $expr: { $lt: [...] } or $expr: { $gt: [...] }, etc.
  // Convert { "$date": "YYYY-MM-DD" } => new Date("YYYY-MM-DD")

  // 1) Handle $expr operators ($lt, $lte, $gt, $gte, etc.)
  const exprOps = ["$lt", "$lte", "$gt", "$gte"];

  for (const op of exprOps) {
    if (filter.$expr && Array.isArray(filter.$expr[op])) {
      const args = filter.$expr[op];
      // e.g., args might be [ { "$toDate": "$dob" }, { "$date": "1990-01-01" } ]
      for (let i = 0; i < args.length; i++) {
        if (args[i].$date) {
          args[i] = new Date(args[i].$date); // Convert string to real Date object
        }
      }
    }
  }

  // 2) If there's an $and, walk through its items recursively
  if (filter.$and && Array.isArray(filter.$and)) {
    filter.$and = filter.$and.map((subFilter: any) =>
      fixDateExpressions(subFilter)
    );
  }

  // 3) Same logic for $or or nested conditions if needed
  if (filter.$or && Array.isArray(filter.$or)) {
    filter.$or = filter.$or.map((subFilter: any) =>
      fixDateExpressions(subFilter)
    );
  }

  return filter;
}
