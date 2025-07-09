const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const {
  AZURE_OPENAI_KEY,
  AZURE_OPENAI_ENDPOINT,
  AZURE_DEPLOYMENT_NAME,
  AZURE_API_VERSION,
} = process.env;

const schema = require("./schema.json");

function generateSchemaText(schema) {
    let result = "";
    for (const [db, tables] of Object.entries(schema.databases)) {
      result += `Database: ${db}\n`;
      for (const [table, columns] of Object.entries(tables)) {
        if (Array.isArray(columns)) {
          result += `Table: ${db}.dbo.${table} (${columns.join(", ")})\n`;
        }
      }
      result += "\n";
    }
    return result.trim();
  }
  
  
  

const systemPrompt = `
You are a SQL Server expert.

Convert the user’s plain English question into a valid SQL query.

Use only the tables and columns provided.

Always use fully qualified table names in the format: DatabaseName.dbo.TableName

Return ONLY the SQL query as plain text.

Do NOT include any explanations, comments, or additional text.

Strictly no code blocks or markdown formatting.

dont show next line syntax
`;

// app.post("/convert-to-sql", async (req, res) => {
//   const { question, schema } = req.body;

//   const userPrompt = `Schema:\n${schema}\n\nQuestion:\n${question}`;

//   try {
//     const response = await axios.post(
//       `${AZURE_OPENAI_ENDPOINT}`,
//       {
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: userPrompt },
//         ],
//         temperature: 0.1,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "api-key": AZURE_OPENAI_KEY,
//         },
//       }
//     );

//     const sql = response.data.choices[0].message.content.trim();
//     res.json({ sql });
//   } catch (err) {
//   console.error("Azure OpenAI Error:", err?.response?.data || err.message);
//   res.status(500).json({ error: err?.response?.data || "Azure OpenAI failed" });
// }

// });

app.post("/convert-to-sql", async (req, res) => {
    const { question } = req.body;
  
    const schemaText = generateSchemaText(schema); // 👈 generate schema from file
  
    const userPrompt = `Schema:\n${schemaText}\n\nQuestion:\n${question}`;
  
    try {
      const response = await axios.post(
        `${AZURE_OPENAI_ENDPOINT}`,
        {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.1
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": AZURE_OPENAI_KEY
          }
        }
      );
  
      const sql = response.data.choices[0].message.content.trim();
      res.json({ sql });
    } catch (err) {
      console.error("Azure OpenAI Error:", err?.response?.data || err.message);
      res.status(500).json({ error: "Azure OpenAI failed" });
    }
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
