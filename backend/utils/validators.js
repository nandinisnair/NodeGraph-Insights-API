const validateEntry = (entry) => {
  const trimmed = entry.trim();
  if (!trimmed) return false;
  
  // Check format: X->Y where X and Y are single uppercase letters
  const pattern = /^[A-Z]->[A-Z]$/;
  if (!pattern.test(trimmed)) return false;
  
  // Check for self-loop
  const [parent, child] = trimmed.split('->');
  if (parent === child) return false;
  
  return true;
};

const parseEdge = (entry) => {
  const [parent, child] = entry.trim().split('->');
  return { parent, child };
};

const validateAndParseEdges = (dataArray) => {
  const validEdges = [];
  const invalidEntries = [];
  const duplicateEdges = [];
  const seenEdges = new Set();
  
  for (const entry of dataArray) {
    if (!validateEntry(entry)) {
      invalidEntries.push(entry.trim());
      continue;
    }
    
    const edge = parseEdge(entry);
    const edgeKey = `${edge.parent}->${edge.child}`;
    
    if (seenEdges.has(edgeKey)) {
      if (!duplicateEdges.includes(edgeKey)) {
        duplicateEdges.push(edgeKey);
      }
    } else {
      seenEdges.add(edgeKey);
      validEdges.push(edge);
    }
  }
  
  return { validEdges, invalidEntries, duplicateEdges };
};

module.exports = { validateEntry, parseEdge, validateAndParseEdges };