import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  Card,
  Button,
  Input,
  makeStyles,
  shorthands,
  Badge,
} from '@fluentui/react-components';
import {
  Add20Regular,
  Delete20Regular,
  Navigation20Regular,
} from '@fluentui/react-icons';
import { useTodo } from '../../context/TodoContext';

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('0'),
    height: 'calc(100vh - 100px)',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    marginBottom: '24px',
    ...shorthands.padding('0', '0', '16px', '0'),
    borderBottom: '1px solid #e1dfdd',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 10,
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#323130',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#605e5c',
  },
  canvas: {
    position: 'relative',
    width: '200%',
    height: '200%',
    minHeight: '1000px',
    minWidth: '1000px',
    backgroundColor: '#fafafa',
    backgroundImage: 'radial-gradient(circle, #e1dfdd 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    cursor: 'grab',
    '&.dragging': {
      cursor: 'grabbing',
    },
  },
  viewport: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  ideaCard: {
    position: 'absolute',
    minWidth: '200px',
    maxWidth: '300px',
    ...shorthands.padding('16px'),
    cursor: 'move',
    transition: 'transform 0.1s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    '&.dragging': {
      transform: 'rotate(5deg) scale(1.05)',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
    },
  },
  ideaInput: {
    width: '100%',
    marginBottom: '12px',
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    fontSize: '16px',
    fontWeight: '600',
  },
  ideaDescription: {
    width: '100%',
    minHeight: '60px',
    marginBottom: '12px',
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    fontSize: '14px',
    resize: 'vertical',
  },
  ideaActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
  },
  priorityBadge: {
    fontSize: '10px',
  },
  toolbar: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    gap: '12px',
    zIndex: 100,
  },
  quickAdd: {
    position: 'fixed',
    top: '120px',
    right: '24px',
    width: '300px',
    ...shorthands.padding('16px'),
    zIndex: 100,
    display: 'none',
    '&.visible': {
      display: 'block',
    },
  },
  quickAddInput: {
    width: '100%',
    marginBottom: '12px',
  },
});

interface BrainstormIdea {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  priority: 'low' | 'medium' | 'high';
  color: string;
}

const BrainstormView: React.FC = () => {
  const classes = useStyles();
  const { actions } = useTodo();
  const [ideas, setIdeas] = useState<BrainstormIdea[]>([]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [draggedIdea, setDraggedIdea] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  const colors = ['#ffeb3b', '#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0'];

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  const addIdea = (x: number = Math.random() * 500, y: number = Math.random() * 500) => {
    const newIdea: BrainstormIdea = {
      id: Date.now().toString(),
      title: quickTitle || 'New Idea',
      description: '',
      x,
      y,
      priority: 'medium',
      color: getRandomColor(),
    };
    setIdeas(prev => [...prev, newIdea]);
    setQuickTitle('');
    setShowQuickAdd(false);
  };

  const updateIdea = (id: string, updates: Partial<BrainstormIdea>) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === id ? { ...idea, ...updates } : idea
    ));
  };

  const deleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  const convertToTask = async (idea: BrainstormIdea) => {
    try {
      await actions.createTodo({
        title: idea.title,
        description: idea.description,
        priority: idea.priority,
        category: 'Brainstorm',
      });
      deleteIdea(idea.id);
    } catch (error) {
      console.error('Failed to convert idea to task:', error);
    }
  };

  const handleIdeaDragStart = (e: React.MouseEvent, ideaId: string) => {
    e.stopPropagation();
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
      setDraggedIdea(ideaId);
      setDragOffset({
        x: e.clientX - idea.x,
        y: e.clientY - idea.y,
      });
    }
  };

  const handleIdeaDrag = (e: React.MouseEvent) => {
    if (draggedIdea) {
      updateIdea(draggedIdea, {
        x: e.clientX - dragOffset.x - canvasPan.x,
        y: e.clientY - dragOffset.y - canvasPan.y,
      });
    }
  };

  const handleIdeaDragEnd = () => {
    setDraggedIdea(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDraggingCanvas(true);
      setDragOffset({ x: e.clientX - canvasPan.x, y: e.clientY - canvasPan.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setCanvasPan({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    } else if (draggedIdea) {
      handleIdeaDrag(e);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingCanvas(false);
    handleIdeaDragEnd();
  };

  const handleCanvasDoubleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        addIdea(
          e.clientX - rect.left - canvasPan.x,
          e.clientY - rect.top - canvasPan.y
        );
      }
    }
  };

  useEffect(() => {
    // Sample ideas for demonstration
    if (ideas.length === 0) {
      setIdeas([
        {
          id: '1',
          title: 'Mobile App Feature',
          description: 'Add dark mode toggle to improve user experience',
          x: 100,
          y: 100,
          priority: 'high',
          color: '#ffeb3b',
        },
        {
          id: '2',
          title: 'Performance Optimization',
          description: 'Investigate slow loading times on dashboard',
          x: 350,
          y: 200,
          priority: 'medium',
          color: '#4caf50',
        },
        {
          id: '3',
          title: 'User Feedback',
          description: 'Implement rating system for completed tasks',
          x: 200,
          y: 350,
          priority: 'low',
          color: '#2196f3',
        },
      ]);
    }
  }, [ideas.length]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text className={classes.title}>Brainstorm</Text>
      </div>

      <div className={classes.viewport}>
        <div
          ref={canvasRef}
          className={`${classes.canvas} ${isDraggingCanvas ? 'dragging' : ''}`}
          style={{
            transform: `translate(${canvasPan.x}px, ${canvasPan.y}px)`,
          }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onDoubleClick={handleCanvasDoubleClick}
        >
          {ideas.map(idea => (
            <Card
              key={idea.id}
              className={`${classes.ideaCard} ${draggedIdea === idea.id ? 'dragging' : ''}`}
              style={{
                left: idea.x,
                top: idea.y,
                backgroundColor: idea.color,
              }}
              onMouseDown={(e) => handleIdeaDragStart(e, idea.id)}
            >
              <Input
                className={classes.ideaInput}
                value={idea.title}
                onChange={(e) => updateIdea(idea.id, { title: e.target.value })}
                placeholder="Idea title..."
              />
              <textarea
                className={classes.ideaDescription}
                value={idea.description}
                onChange={(e) => updateIdea(idea.id, { description: e.target.value })}
                placeholder="Add description..."
              />
              <div className={classes.ideaActions}>
                <div>
                  <Badge 
                    appearance="outline" 
                    className={classes.priorityBadge}
                    style={{
                      backgroundColor: 
                        idea.priority === 'high' ? '#ffebee' :
                        idea.priority === 'medium' ? '#fff3e0' : '#f3f9f1',
                      color:
                        idea.priority === 'high' ? '#d13438' :
                        idea.priority === 'medium' ? '#ff8c00' : '#107c10',
                    }}
                  >
                    {idea.priority.toUpperCase()}
                  </Badge>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    size="small"
                    appearance="primary"
                    onClick={() => convertToTask(idea)}
                  >
                    Create Task
                  </Button>
                  <Button
                    size="small"
                    appearance="subtle"
                    icon={<Delete20Regular />}
                    onClick={() => deleteIdea(idea.id)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className={`${classes.quickAdd} ${showQuickAdd ? 'visible' : ''}`}>
        <Text style={{ marginBottom: '12px', fontWeight: '600' }}>Quick Add Idea</Text>
        <Input
          className={classes.quickAddInput}
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Enter idea title..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addIdea();
            }
          }}
        />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button appearance="subtle" onClick={() => setShowQuickAdd(false)}>
            Cancel
          </Button>
          <Button appearance="primary" onClick={() => addIdea()}>
            Add
          </Button>
        </div>
      </Card>

      <div className={classes.toolbar}>
        <Button
          appearance="primary"
          icon={<Add20Regular />}
          onClick={() => setShowQuickAdd(!showQuickAdd)}
        >
          Add Idea
        </Button>
        <Button
          appearance="outline"
          icon={<Navigation20Regular />}
          onClick={() => setCanvasPan({ x: 0, y: 0 })}
        >
          Reset View
        </Button>
      </div>
    </div>
  );
};

export default BrainstormView;