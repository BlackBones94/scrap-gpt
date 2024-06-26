const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('content.db');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY 

if (!OPENAI_API_KEY) {
  console.error('OpenAI API key not set. Please set the OPENAI_API_KEY environment variable.');
  process.exit(1);
}

app.post('/search', async (req, res) => {
  const { query } = req.body;

  console.log(`Received search query: ${query}`);

  db.get("SELECT content FROM articles", async (err, row) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }

    if (!row) {
      console.error('No content found in database');
      res.status(500).json({ error: 'No content found in database' });
      return;
    }

    const content = row.content;
    console.log('Retrieved content from database');

    try {
      console.log('Sending request to OpenAI...');
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Find information about ${query} in the following text: ${content}` }
        ],
        max_tokens: 100,
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      });

      console.log('Received response from OpenAI:', response.data);
      res.json(response.data.choices[0].message.content.split('\n'));
    } catch (error) {
      console.error('Error fetching data from ChatGPT:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Error fetching data from ChatGPT' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
