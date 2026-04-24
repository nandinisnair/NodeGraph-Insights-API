const express = require('express');
const cors = require('cors');
const { validateAndParseEdges } = require('./utils/validators');
const { buildTreesFromEdges } = require('./services/treeService');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (required for evaluation)
app.use(cors());
app.use(express.json());

// POST endpoint for hierarchy processing
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    
    // Validate request
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ 
        error: 'Invalid request. "data" array is required.' 
      });
    }
    
    // Process the edges (validation, duplicate detection, multi-parent handling)
    const { validEdges, invalidEntries, duplicateEdges } = validateAndParseEdges(data);
    
    // Build hierarchies from valid edges
    const { hierarchies, summary } = buildTreesFromEdges(validEdges);
    
    // ============================================
    // UPDATE THESE WITH YOUR ACTUAL CREDENTIALS
    // ============================================
    const response = {
      user_id: "nandini_04112005",           // Change to yourname_ddmmyyyy
      email_id: "ns0112@srmist.edu.in",       // Change to your college email
      college_roll_number: "RA2311026010520",       // Change to your roll number
      hierarchies: hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary: summary
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint (for monitoring and keeping server awake)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint - simple welcome message
app.get('/', (req, res) => {
  res.json({ 
    message: 'SRM Full Stack Challenge API',
    endpoints: {
      post: '/bfhl',
      health: '/health'
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    availableEndpoints: ['POST /bfhl', 'GET /health', 'GET /']
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 POST endpoint: http://localhost:${PORT}/bfhl`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Root endpoint: http://localhost:${PORT}/`);
  console.log(`✅ CORS enabled - Ready for cross-origin requests`);
});