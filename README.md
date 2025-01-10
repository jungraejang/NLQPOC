
# NLQ App (Next.js, MongoDB, OpenAI)

A proof-of-concept **Natural Language Query** (NLQ) application built with:
- **Next.js** (App Router, TypeScript)
- **MongoDB** (for data storage)
- **OpenAI** (to parse user’s natural language into MongoDB filters)

Users can type queries like _“Find all female clients who arrived before 1920”_ and the app will:
1. Ask GPT to convert the query to a **MongoDB filter**.
2. Execute the filter against a **MongoDB** collection (e.g. `Clients`).
3. Return the matching results (or an error if invalid).

## Features

- **Natural Language to MongoDB Filter**: GPT analyzes user text and outputs JSON for a `.find()` query.
- **Date Comparisons**: Uses `$expr` and `$toDate` if comparing string-based dates in the DB.
- **Strict JSON Format**: The system prompt enforces returning valid MongoDB filters or `{"error":"Invalid query"}`.
- **Next.js 13 App Router**: Modern file structure, SSR, and edge capabilities.
- **Deployed on Vercel**: Quick global deployment with environment variables and serverless functions.

## Screenshots

_(Optionally add screenshots or GIFs demonstrating the input field, results table, etc.)_

## Installation

1. **Clone** the repository:
   ```bash
   git clone https://github.com/username/my-nlq-app.git
   cd my-nlq-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the project root (ignored by Git). Add:
   ```bash
   OPENAI_API_KEY=sk-xxxxxxx
   MONGODB_URI=mongodb+srv://<USER>:<PASS>@cluster0.xyz.mongodb.net/<DB_NAME>?retryWrites=true&w=majority
   ```
   Ensure your MongoDB Network Access allows connections from your environment. For example, whitelist `0.0.0.0/0` in MongoDB Atlas (for dev) or set up a more secure approach.

4. **Run development server**:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
   The app should now be running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```plaintext
my-nlq-app/
├─ app/
│  ├─ page.tsx              # Main UI where user enters queries
│  ├─ api/
│  │  └─ query/
│  │     └─ route.ts        # Serverless function to handle user queries
│  └─ (lib)/               
│     ├─ db.ts              # MongoDB connection helper
│     └─ openai.ts          # GPT call to create chat completions
├─ utils/
│  └─ fixDateExpressions.ts # Example utility to transform $date -> new Date
├─ .env.local.example       # Example env file
├─ package.json
├─ README.md
└─ ...
```

## Usage

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Type a query in natural language. Examples:
   - Find clients with gender female
   - Find clients born before January 1, 1990
   - Find clients from China
3. Click **Send**.
4. The app calls OpenAI to convert your text into a MongoDB filter.
5. The filter is executed against the `Clients` collection, and matching documents are displayed.

## Deploying on Vercel

1. Push your code to a GitHub or GitLab repository.
2. Go to Vercel, create a new project by importing your repo.
3. Set your Environment Variables in Vercel project settings:
   - `OPENAI_API_KEY`
   - `MONGODB_URI`
4. Deploy.

### Troubleshooting
- **Gateway Timeout**: Your GPT request or DB query might exceed Vercel’s function timeout. Optimize the query or upgrade your plan.
- **MongoDB Network Errors**: Ensure `MONGODB_URI` is correct and Atlas is allowing external connections.
- **Invalid JSON from GPT**: If GPT occasionally returns partial text or code fences, tighten your system prompt or use OpenAI Function Calling for a more robust approach.

## Common Issues

- **Gateway Timeout**: Check Vercel’s 10-second limit on free plans (30 seconds on Pro).
- **MongoDB Connection Settings**: Whitelist `0.0.0.0/0` or set up a VPC/privatelink for secure access.
- **Larger Queries**: GPT-4 or complex filters might take more than 10 seconds. Consider optimizing or upgrading.

## Contributing

Feel free to submit issues or pull requests if you find bugs or want to add features. For major changes, open an issue first to discuss what you’d like to change.

## License

MIT – you can adapt or reuse this project for your own needs.
```
