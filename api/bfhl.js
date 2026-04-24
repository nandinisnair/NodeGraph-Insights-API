// Vercel Serverless Function for /bfhl endpoint
const { validateAndParseEdges } = require('../backend/utils/validators');
const { buildTreesFromEdges } = require('../backend/services/treeService');

// Your credentials - UPDATE THESE
const USER_ID = "nandini_04112005";        // Change this
const EMAIL_ID = "ns0112@srmist.edu.in";    // Change this
const COLLEGE_ROLL_NUMBER = "RA2311026010520";    // Change this


module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid request. "data" array is required.' });
    }

    // Process the edges
    const { validEdges, invalidEntries, duplicateEdges } = validateAndParseEdges(data);

    // Build hierarchies from valid edges
    const { hierarchies, summary } = buildTreesFromEdges(validEdges);

    const response = {
      user_id: USER_ID,
      email_id: EMAIL_ID,
      college_roll_number: COLLEGE_ROLL_NUMBER,
      hierarchies: hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary: summary
    };

    return res.json(response);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};