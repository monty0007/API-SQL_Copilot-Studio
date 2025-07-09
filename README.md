# 🧠 Azure OpenAI SQL Query Generator

This is a lightweight Express.js backend that uses **Azure OpenAI** to convert **natural language questions** into **valid SQL Server queries** based on a predefined database schema.

---

## 🚀 Features

- Converts plain English questions to **SQL queries**
- Uses a predefined schema from `schema.json`
- Enforces **fully qualified table names**
- Returns **only the SQL query** (no extra explanations or formatting)
- Integrates with **Azure OpenAI API**

---

## 📁 Project Structure

```bash
.
├── schema.json         # Database schema (your tables + columns)
├── .env                # Environment variables (not committed)
├── index.js            # Main Express server
├── package.json
└── README.md           # This file

## ⚙️ Setup Instructions

1. Clone the Repo

git clone https://github.com/your-username/sql-query-gen.git
cd sql-query-gen

2. Install Dependencies
bash
Copy code
npm install
3. Configure Environment Variables
Create a .env file in the root with the following keys:

env
Copy code
AZURE_OPENAI_KEY=your-azure-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT/chat/completions?api-version=2024-02-15-preview
AZURE_DEPLOYMENT_NAME=your-deployment-name
AZURE_API_VERSION=2024-02-15-preview
PORT=5000
📌 Make sure your endpoint includes the deployment ID and the correct API version.

📄 Example schema.json
json
Copy code
{
  "databases": {
    "MyDB": {
      "users": ["id", "name", "email"],
      "orders": ["id", "user_id", "amount", "date"]
    }
  }
}
🧠 How It Works
You send a POST request to /convert-to-sql with a natural language question.

The server:

Loads the schema from schema.json

Formats a strict prompt with schema and user question

Sends it to Azure OpenAI

Returns just the SQL query (no code blocks or comments)

📬 API Endpoint
POST /convert-to-sql
Request Body:

json
Copy code
{
  "question": "What is the total amount of orders for each user?"
}
Response:

json
Copy code
{
  "sql": "SELECT users.name, SUM(orders.amount) FROM MyDB.dbo.users JOIN MyDB.dbo.orders ON users.id = orders.user_id GROUP BY users.name"
}
🛡 Prompt Rules (Hardcoded in systemPrompt)
Use only the provided schema

Must use DatabaseName.dbo.TableName format

Output only the SQL (no explanation or markdown)

🧪 Testing Locally
Run the app:

bash
Copy code
node index.js
Send a test request:

bash
Copy code
curl -X POST http://localhost:5000/convert-to-sql \
  -H "Content-Type: application/json" \
  -d '{"question": "List all users"}'
📦 To-Do / Enhancements
Add support for dynamic schema uploads

Add front-end UI or Teams integration

Add logging and usage tracking

Connect directly to SQL DB to test generated queries
