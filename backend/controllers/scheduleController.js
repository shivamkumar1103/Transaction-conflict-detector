
exports.analyzeSchedule = (req, res) => {
  try {
    const { operations } = req.body;
    // operations format: [{ id, type: 'R'|'W'|'C'|'A', transaction: 'T1', dataItem: 'X' }]

    const conflicts = [];
    const edges = [];
    const nodesSet = new Set();

    // 1. Detect conflicts and generate edges
    for (let i = 0; i < operations.length; i++) {
      const op1 = operations[i];
      if (op1.type === 'C' || op1.type === 'A') continue;
      
      nodesSet.add(op1.transaction);

      for (let j = i + 1; j < operations.length; j++) {
        const op2 = operations[j];
        if (op2.type === 'C' || op2.type === 'A') continue;
        
        nodesSet.add(op2.transaction);

        if (op1.transaction !== op2.transaction && op1.dataItem === op2.dataItem) {
          if (op1.type === 'R' && op2.type === 'W') {
            conflicts.push({ type: 'RW', from: op1, to: op2 });
            edges.push({ from: op1.transaction, to: op2.transaction, type: 'RW', dataItem: op1.dataItem });
          } else if (op1.type === 'W' && op2.type === 'R') {
            conflicts.push({ type: 'WR', from: op1, to: op2 });
            edges.push({ from: op1.transaction, to: op2.transaction, type: 'WR', dataItem: op1.dataItem });
          } else if (op1.type === 'W' && op2.type === 'W') {
            conflicts.push({ type: 'WW', from: op1, to: op2 });
            edges.push({ from: op1.transaction, to: op2.transaction, type: 'WW', dataItem: op1.dataItem });
          }
        }
      }
    }

    // Prepare Adjacency List for DFS
    const adjList = {};
    for (const node of nodesSet) {
      adjList[node] = new Set();
    }
    
    // Deduplicate edges for the graph
    const uniqueEdges = [];
    const edgeMap = new Map();
    
    for (const edge of edges) {
      adjList[edge.from].add(edge.to);
      const edgeKey = `${edge.from}->${edge.to}`;
      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, []);
      }
      edgeMap.get(edgeKey).push(edge);
    }
    
    for (const [key, edgeList] of edgeMap.entries()) {
        const labels = Array.from(new Set(edgeList.map(e => `${e.dataItem} (${e.type})`))).join(', ');
        uniqueEdges.push({
            id: key,
            source: edgeList[0].from,
            target: edgeList[0].to,
            label: labels,
            animated: true
        });
    }

    // 2. DFS Cycle Detection
    const visited = {};
    const recStack = {};
    let isSerializable = true;
    let cyclePath = [];

    const dfs = (node, path) => {
      if (recStack[node]) {
        cyclePath = [...path, node];
        return true; // Cycle detected
      }
      if (visited[node]) return false;

      visited[node] = true;
      recStack[node] = true;

      for (const neighbor of adjList[node]) {
        if (dfs(neighbor, [...path, node])) {
          return true;
        }
      }

      recStack[node] = false;
      return false;
    };

    for (const node of nodesSet) {
      if (!visited[node]) {
        if (dfs(node, [])) {
          isSerializable = false;
          break;
        }
      }
    }

    res.json({
      success: true,
      data: {
        isSerializable,
        conflicts,
        nodes: Array.from(nodesSet),
        edges: uniqueEdges,
        cyclePath: isSerializable ? [] : cyclePath
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

