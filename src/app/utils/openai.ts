import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Takes a natural language query (e.g. "Find users older than 30")
 * and returns a JSON string describing the MongoDB filter (e.g. {"age":{"$gt":30}}).
 * You can tweak the system message to suit your schema or your desired style.
 */
export async function getMongoQueryFromGPT(userQuery: string): Promise<string> {
  const systemPrompt = `
You are an assistant that ALWAYS returns a valid JSON object describing a MongoDB filter for the 'Clients' collection.
Do NOT include code fences (\`\`\`).
Do NOT add any text or explanation outside the JSON.

Below is a sample document in our 'Clients' collection:
{
  "_id": { "$oid": "677f653fa55df2322177e921" },
  "client_id": 2,
  "first_name": "Halie",
  "last_name": "Heers",
  "email": "hheers1@zdnet.com",
  "gender": "Female",
  "dob": "10/22/1977",      // stored as a string
  "nationality": "Botswana",
  "current_status": "lobortis ligula sit amet eleifend pede...",
  "arrival_date": "9/18/1915"  // also stored as a string
}

IMPORTANT:
2. For string fields like 'gender' or 'nationality', match EXACTLY (e.g. "Female" not "female").
3. For date comparisons on 'dob' or 'arrival_date', you MUST use an $expr with $toDate and a real date:
   {
     "$expr": {
       "<operator>": [
         { "$toDate": "$<field>" },
         { "$date": "YYYY-MM-DD" }
       ]
     }
   }
4. The top-level result must be a VALID MongoDB filter object. No extra keys, no code blocks, no text outside the JSON.

EXAMPLES:
- If user says "Find clients with gender female", output:
  {"gender":"Female"}
- If user says "Find clients born before January 1, 1990", output:
  {
    "$expr": {
      "$lt": [
        { "$toDate": "$dob" },
        { "$date": "1990-01-01" }
      ]
    }
  }
- If user says "Find clients who arrived after 1920-01-01", output:
  {
    "$expr": {
      "$gt": [
        { "$toDate": "$arrival_date" },
        { "$date": "1920-01-01" }
      ]
    }
  }

`;

  console.log("userQuery", userQuery);
  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
    ],
    temperature: 0,
  });

  return chatResponse.choices[0]?.message?.content ?? "";
}
