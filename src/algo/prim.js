function runPrim(graph, startNode) {
    let remainingNodes = {};
    let nodesInTree = {};
    let graphs = [];
    let nodeStates = [{}];
    graph.meta.colors = {};

    Object.keys(graph.nodes).forEach(node => {
        remainingNodes[node] = {
            dist: Infinity,
            ancestor: undefined,
            inTree: false,
            edge: undefined // helper
        }
        nodeStates[0][node] = {
            dist: Infinity,
            ancestor: undefined,
            inTree: false,
        }
    });

    remainingNodes[startNode].dist = 0;
    graph.meta.colors[startNode] = "red";
    nodeStates[0][startNode].dist = 0;
    //nodeStates[0][startNode].inTree = true;
    
    let stateIndex = 0;

    graphs.push(visualizeGraph(graph));
    
    while (Object.keys(nodesInTree).length < Object.keys(graph.nodes).length) {
        // Find min dist node
        let minDistNode = Object.keys(remainingNodes)[0];
        
        Object.keys(remainingNodes).forEach(node => {
            if (remainingNodes[node].dist < remainingNodes[minDistNode].dist) {
                minDistNode = node;
            }
        });
        
        nodeStates.push($.extend(true, {}, nodeStates[stateIndex]));
        stateIndex++;
        nodeStates[stateIndex][minDistNode].inTree = true;

        graph.nodes[minDistNode].forEach(edge => {
            if (remainingNodes[edge.node] && edge.weight < remainingNodes[edge.node].dist) {
                remainingNodes[edge.node] = {
                    dist: edge.weight,
                    ancestor: minDistNode,
                    inTree: false,
                    edge: `${minDistNode} -- ${edge.node}`
                }
                
                nodeStates[stateIndex][edge.node] = {
                    dist: edge.weight,
                    ancestor: minDistNode,
                    inTree: false
                }

                graph.meta.colors[edge.node] = "red";
            }
        });
        
        remainingNodes[minDistNode].inTree = true;
        
        nodesInTree[minDistNode] = remainingNodes[minDistNode];
        
        delete remainingNodes[minDistNode];

        graph.meta.colors[minDistNode] = "green";

        graphs.push(visualizeGraph(graph));

    }
    
    let retVal = {
        graphs: graphs,
        state: nodeStates
    };

    return retVal;
}
