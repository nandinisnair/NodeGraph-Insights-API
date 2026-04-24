const express = require('express');
const cors = require('cors');
const { validateAndParseEdges } = require('./utils/validators');
const { buildTreesFromEdges } = require('./services/treeService');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// POST endpoint for hierarchy processing
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid request. "data" array required.' });
    }
    
    // Process the edges
    const { validEdges, invalidEntries, duplicateEdges } = validateAndParseEdges(data);
    
    // Build hierarchies from valid edges
    const { hierarchies, summary } = buildTreesFromEdges(validEdges);
    
    // Your credentials - UPDATE THESE
    const response = {
      user_id: "nandini_15031995",
      email_id: "nandini@college.edu",
      college_roll_number: "21CS1001",
      hierarchies: hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary: summary
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/bfhl`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});