import React, { useCallback, useMemo, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ConnectionLineType,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './MindMapCanvas.css';
import EditableNode from './EditableNode';
import TextNode from './TextNode';
import { useSignalR } from '../hooks/useSignalR';

const initialNodes = [];
const initialEdges = [];

const MindMapCanvas = ({ roomId, userName }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedElements, setSelected] = useState(null);

  const connection = useSignalR(roomId, userName);

  const nodeTypes = useMemo(() => ({
    editableNode: (props) => <EditableNode {...props} connection={connection} roomId={roomId} />,
    textNode: (props) => <TextNode {...props} connection={connection} roomId={roomId} />,
  }), [connection, roomId]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = addEdge({ ...params, type: ConnectionLineType.Bezier }, edges);
      setEdges(newEdge);

      // Send edge update to the backend via SignalR
      if (connection) {
        connection.invoke('SendEdgeUpdate', roomId, newEdge[newEdge.length - 1]);
      }
    },
    [setEdges, connection, roomId, edges]
  );

  const addNode = (type) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: type === 'Text' ? 'textNode' : 'editableNode',
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      data: { label: type === 'Text' ? 'New Text' : `New ${type}` },
    };

    setNodes((nds) => [...nds, newNode]);

    if (connection) {
      connection.invoke('SendNodeUpdate', roomId, newNode);
    }
  };

  const handleDragStop = (event, node) => {
    const currentNode = nodes.find((n) => n.id === node.id);

    if (connection && currentNode) {
      const updatedNode = {
        ...currentNode,
        position: node.position,
        data: { ...currentNode.data },
      };

      connection.invoke('SendNodeUpdate', roomId, updatedNode);
    }
  };

  // Deleting nodes and edges
  const onNodesDelete = useCallback(
    (deletedNodes) => {
      setNodes((nds) => nds.filter((node) => !deletedNodes.map(dn => dn.id).includes(node.id)));
      if (connection) {
        deletedNodes.forEach((node) => {
          connection.invoke('DeleteNode', roomId, node.id);  // Send delete request to backend
        });
      }
    },
    [setNodes, connection, roomId]
  );

  const onEdgesDelete = useCallback(
    (deletedEdges) => {
      setEdges((eds) => eds.filter((edge) => !deletedEdges.map(de => de.id).includes(edge.id)));
      if (connection) {
        deletedEdges.forEach((edge) => {
          connection.invoke('DeleteEdge', roomId, edge.id);  // Send delete request to backend
        });
      }
    },
    [setEdges, connection, roomId]
  );

  const handleKeyDown = useCallback((event) => {
    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedElements) {
      const nodesToDelete = selectedElements.filter((el) => el.type === 'editableNode' || el.type === 'textNode');
      const edgesToDelete = selectedElements.filter((el) => el.type === 'edge');

      if (nodesToDelete.length > 0) {
        onNodesDelete(nodesToDelete);
      }

      if (edgesToDelete.length > 0) {
        onEdgesDelete(edgesToDelete);
      }
    }
  }, [selectedElements, onNodesDelete, onEdgesDelete]);

  useEffect(() => {
    if (connection) {
      connection.on('ReceiveAllNodes', (allNodes) => {
        setNodes(allNodes);
      });

      connection.on('ReceiveAllEdges', (allEdges) => {
        setEdges(allEdges);
      });

      connection.on('ReceiveNodeUpdate', (updatedNode) => {
        setNodes((nds) => {
          const nodeExists = nds.some((node) => node.id === updatedNode.id);
          return nodeExists
            ? nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
            : [...nds, updatedNode];
        });
      });

      connection.on('ReceiveEdgeUpdate', (edge) => {
        setEdges((eds) => {
          const existingEdge = eds.find((e) => e.id === edge.id);
          return existingEdge
            ? eds.map((e) => (e.id === edge.id ? edge : e))
            : [...eds, edge];
        });
      });

      connection.on('NodeDeleted', (nodeId) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      });

      connection.on('EdgeDeleted', (edgeId) => {
        setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
      });
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (connection) {
        connection.off('ReceiveAllNodes');
        connection.off('ReceiveAllEdges');
        connection.off('ReceiveNodeUpdate');
        connection.off('ReceiveEdgeUpdate');
        connection.off('NodeDeleted');
        connection.off('EdgeDeleted');
      }

      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [connection, roomId, setNodes, setEdges, handleKeyDown]);

  const handleNodeClick = (event, node) => {
    console.log('Node clicked:', node);  // Debugging selection
    setSelected([node]);  // Manually set selected node
  };
  
  return (
    <div className="mindmap-container">
      <div className="floating-controls">
        <button className="control-button" onClick={() => addNode('Rectangle')}>Add Node</button>
        <button className="control-button" onClick={() => addNode('Text')}>Add Text</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={handleDragStop}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        connectionLineType={ConnectionLineType.Bezier}
        onSelectionChange={(elements) => {
          //console.log('Selected elements Here:', elements);  // Debugging selection
          setSelected(elements);
        }}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
      >
        <Controls />
        <Background color="#f4f4f4" gap={16} />
      </ReactFlow>
    </div>
  );
};

const MindMapCanvasWrapper = (props) => {
  return (
    <ReactFlowProvider>
      <MindMapCanvas {...props} />
    </ReactFlowProvider>
  );
};

export default MindMapCanvasWrapper;
