const buildTreesFromEdges = (edges) => {
  if (!edges || edges.length === 0) {
    return { hierarchies: [], summary: { total_trees: 0, total_cycles: 0, largest_tree_root: "" } };
  }
  
  // Build adjacency list
  const childrenMap = new Map();
  const parentsMap = new Map();
  const allNodes = new Set();
  
  for (const edge of edges) {
    allNodes.add(edge.parent);
    allNodes.add(edge.child);
    
    if (!childrenMap.has(edge.parent)) {
      childrenMap.set(edge.parent, []);
    }
    childrenMap.get(edge.parent).push(edge.child);
    
    if (!parentsMap.has(edge.child)) {
      parentsMap.set(edge.child, []);
    }
    parentsMap.get(edge.child).push(edge.parent);
  }
  
  // Find connected components
  const components = findConnectedComponents(edges, allNodes);
  
  const hierarchies = [];
  
  for (const component of components) {
    const { nodes, componentEdges } = component;
    
    // Check if this component has a cycle
    const hasCycle = detectCycleInComponent(nodes, componentEdges);
    
    if (hasCycle) {
      // For cycles, use lexicographically smallest node as root
      const root = Array.from(nodes).sort()[0];
      hierarchies.push({
        root: root,
        tree: {},
        has_cycle: true
      });
    } else {
      // Find root in this component (node with no parent)
      let root = null;
      for (const node of nodes) {
        if (!parentsMap.has(node)) {
          root = node;
          break;
        }
      }
      
      // If no root found (shouldn't happen for acyclic), use smallest node
      if (!root) {
        root = Array.from(nodes).sort()[0];
      }
      
      const tree = {};
      const depth = buildTree(root, childrenMap, tree, new Set());
      
      hierarchies.push({
        root: root,
        tree: tree,
        depth: depth
      });
    }
  }
  
  // Calculate summary
  const nonCyclicTrees = hierarchies.filter(h => !h.has_cycle);
  const cyclicGroups = hierarchies.filter(h => h.has_cycle);
  
  let largestTreeRoot = "";
  let largestTreeDepth = -1;
  
  for (const tree of nonCyclicTrees) {
    if (tree.depth > largestTreeDepth || 
        (tree.depth === largestTreeDepth && tree.root < largestTreeRoot)) {
      largestTreeDepth = tree.depth;
      largestTreeRoot = tree.root;
    }
  }
  
  const summary = {
    total_trees: nonCyclicTrees.length,
    total_cycles: cyclicGroups.length,
    largest_tree_root: largestTreeRoot || ""
  };
  
  return { hierarchies, summary };
};

const findConnectedComponents = (edges, allNodes) => {
  // Build undirected adjacency for component detection
  const undirectedMap = new Map();
  
  for (const edge of edges) {
    if (!undirectedMap.has(edge.parent)) undirectedMap.set(edge.parent, []);
    if (!undirectedMap.has(edge.child)) undirectedMap.set(edge.child, []);
    undirectedMap.get(edge.parent).push(edge.child);
    undirectedMap.get(edge.child).push(edge.parent);
  }
  
  const visited = new Set();
  const components = [];
  
  for (const node of allNodes) {
    if (!visited.has(node)) {
      const componentNodes = new Set();
      const queue = [node];
      
      while (queue.length > 0) {
        const current = queue.shift();
        if (!visited.has(current)) {
          visited.add(current);
          componentNodes.add(current);
          
          const neighbors = undirectedMap.get(current) || [];
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
              queue.push(neighbor);
            }
          }
        }
      }
      
      // Get edges belonging to this component
      const componentEdges = edges.filter(edge => 
        componentNodes.has(edge.parent) && componentNodes.has(edge.child)
      );
      
      components.push({
        nodes: componentNodes,
        componentEdges: componentEdges
      });
    }
  }
  
  return components;
};

const detectCycleInComponent = (nodes, edges) => {
  // Build directed adjacency
  const adjMap = new Map();
  for (const edge of edges) {
    if (!adjMap.has(edge.parent)) adjMap.set(edge.parent, []);
    adjMap.get(edge.parent).push(edge.child);
  }
  
  const visited = new Set();
  const recursionStack = new Set();
  
  const hasCycle = (node) => {
    visited.add(node);
    recursionStack.add(node);
    
    const neighbors = adjMap.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }
    
    recursionStack.delete(node);
    return false;
  };
  
  for (const node of nodes) {
    if (!visited.has(node)) {
      if (hasCycle(node)) return true;
    }
  }
  
  return false;
};

const buildTree = (node, childrenMap, treeObj, visited) => {
  visited.add(node);
  const children = childrenMap.get(node) || [];
  
  if (children.length === 0) {
    treeObj[node] = {};
    return 1;
  }
  
  const childObj = {};
  let maxDepth = 0;
  
  for (const child of children) {
    if (!visited.has(child)) {
      const depth = buildTree(child, childrenMap, childObj, visited);
      maxDepth = Math.max(maxDepth, depth);
    }
  }
  
  treeObj[node] = childObj;
  return maxDepth + 1;
};

module.exports = { buildTreesFromEdges };