import React, { useState, useEffect } from 'react';
import {
  Text,
  Card,
  Button,
  Input,
  Badge,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import {
  Add20Regular,
  MoreHorizontal20Regular,
  ChevronRight20Regular,
  ChevronDown20Regular,
} from '@fluentui/react-icons';
import { useTodo } from '../../context/TodoContext';
import { Todo } from '../../types/Todo';
import TaskDetailModal from '../../components/TaskDetailModal/TaskDetailModal';
import EditTodoDialog from '../../components/EditTodoDialog/EditTodoDialog';

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('0'),
    height: 'calc(100vh - 100px)',
  },
  header: {
    marginBottom: '24px',
    ...shorthands.padding('0', '0', '16px', '0'),
    borderBottom: '1px solid #e1dfdd',
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
  kanbanBoard: {
    display: 'flex',
    gap: '24px',
    height: 'calc(100% - 120px)',
    overflowX: 'auto',
  },
  column: {
    minWidth: '320px',
    maxWidth: '320px',
    backgroundColor: '#f8f9fa',
    ...shorthands.borderRadius('8px'),
    ...shorthands.padding('16px'),
    display: 'flex',
    flexDirection: 'column',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    ...shorthands.padding('8px', '0'),
  },
  columnTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#323130',
  },
  taskCount: {
    fontSize: '12px',
    color: '#605e5c',
    backgroundColor: '#e1dfdd',
    ...shorthands.borderRadius('12px'),
    ...shorthands.padding('4px', '8px'),
  },
  taskList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto',
    minHeight: '200px',
  },
  taskCard: {
    ...shorthands.padding('12px'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
  },
  parentTask: {
    borderLeft: '4px solid #0078d4',
    backgroundColor: '#ffffff',
  },
  childTask: {
    marginLeft: '16px',
    borderLeft: '2px solid #e1dfdd',
    backgroundColor: '#fafafa',
  },
  taskHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  taskTitle: {
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1.3',
    flex: 1,
    marginRight: '8px',
  },
  taskMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  priorityBadge: {
    fontSize: '10px',
    '&.high': {
      backgroundColor: '#fef7f7',
      color: '#d13438',
      ...shorthands.border('1px', 'solid', '#f7d4d6'),
    },
    '&.medium': {
      backgroundColor: '#fff8f0',
      color: '#ff8c00',
      ...shorthands.border('1px', 'solid', '#fde7cc'),
    },
    '&.low': {
      backgroundColor: '#f3f9f1',
      color: '#107c10',
      ...shorthands.border('1px', 'solid', '#d1e7d1'),
    },
  },
  addButton: {
    width: '100%',
    ...shorthands.margin('8px', '0'),
  },
  expandButton: {
    minWidth: '20px',
    width: '20px',
    height: '20px',
    ...shorthands.padding('0'),
    marginRight: '8px',
  },
  childrenContainer: {
    marginTop: '8px',
    ...shorthands.borderRadius('4px'),
  },
  quickAddInput: {
    width: '100%',
    marginBottom: '8px',
  },
});

interface TaskGroup {
  parent: Todo;
  children: Todo[];
  expanded: boolean;
}

const KanbanView: React.FC = () => {
  const classes = useStyles();
  const { state, actions } = useTodo();
  const [taskGroups, setTaskGroups] = useState<{ [status: string]: TaskGroup[] }>({});
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [showQuickAdd, setShowQuickAdd] = useState<{ [status: string]: boolean }>({});
  const [quickAddTitle, setQuickAddTitle] = useState<{ [status: string]: string }>({});

  const columns = [
    { status: 'pending', title: 'To Do', color: '#605e5c' },
    { status: 'in_progress', title: 'In Progress', color: '#ff8c00' },
    { status: 'completed', title: 'Done', color: '#107c10' },
  ];

  useEffect(() => {
    const groupTasks = () => {
      const todos = state.todos.filter(todo => todo && todo.id && todo.title);
      const groups: { [status: string]: TaskGroup[] } = {
        pending: [],
        in_progress: [],
        completed: [],
      };

      // First, get all parent tasks (tasks without parent_id)
      const parentTasks = todos.filter(todo => !todo.parent_id);
      
      // Then group them by status
      parentTasks.forEach(parent => {
        const children = todos
          .filter(todo => todo.parent_id === parent.id)
          .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

        const status = parent.status || 'pending';
        if (groups[status]) {
          groups[status].push({
            parent,
            children,
            expanded: expandedTasks.has(parent.id),
          });
        }
      });

      // Add orphaned child tasks as individual parent tasks
      const orphanedTasks = todos.filter(todo => 
        todo.parent_id && !todos.find(t => t.id === todo.parent_id)
      );
      
      orphanedTasks.forEach(orphan => {
        const status = orphan.status || 'pending';
        if (groups[status]) {
          groups[status].push({
            parent: { ...orphan, parent_id: undefined },
            children: [],
            expanded: false,
          });
        }
      });

      setTaskGroups(groups);
    };

    groupTasks();
  }, [state.todos, expandedTasks]);

  const toggleExpanded = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const addTask = async (status: string, parentId?: string) => {
    const title = quickAddTitle[status] || 'New Task';
    try {
      await actions.createTodo({
        title,
        status: status as any,
        parent_id: parentId,
        order_index: parentId ? 
          Math.max(0, ...state.todos.filter(t => t.parent_id === parentId).map(t => t.order_index || 0)) + 1 :
          0,
      });
      setQuickAddTitle(prev => ({ ...prev, [status]: '' }));
      setShowQuickAdd(prev => ({ ...prev, [status]: false }));
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const addSubtask = async (parentId: string) => {
    try {
      await actions.createTodo({
        title: 'New Subtask',
        parent_id: parentId,
        status: 'pending',
        order_index: Math.max(0, ...state.todos.filter(t => t.parent_id === parentId).map(t => t.order_index || 0)) + 1,
      });
      setExpandedTasks(prev => {
        const newSet = new Set(prev);
        newSet.add(parentId);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to create subtask:', error);
    }
  };

  const moveTask = async (taskId: string, newStatus: string) => {
    try {
      await actions.updateTodo(taskId, { status: newStatus as any });
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  const renderTask = (task: Todo, isChild: boolean = false) => (
    <Card 
      key={task.id}
      className={`${classes.taskCard} ${isChild ? classes.childTask : classes.parentTask}`}
    >
      <div className={classes.taskHeader}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {!isChild && (taskGroups[task.status || 'pending']?.find(g => g.parent.id === task.id)?.children.length || 0) > 0 && (
            <Button
              appearance="subtle"
              size="small"
              className={classes.expandButton}
              icon={expandedTasks.has(task.id) ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
              onClick={() => toggleExpanded(task.id)}
            />
          )}
          <TaskDetailModal
            todo={task}
            trigger={
              <Text className={classes.taskTitle}>
                {task.title}
              </Text>
            }
          />
        </div>
        <EditTodoDialog
          todo={task}
          trigger={
            <Button
              appearance="subtle"
              size="small"
              icon={<MoreHorizontal20Regular />}
            />
          }
        />
      </div>

      <div className={classes.taskMeta}>
        <Badge 
          appearance="outline" 
          className={`${classes.priorityBadge} ${task.priority || 'medium'}`}
        >
          {(task.priority || 'medium').toUpperCase()}
        </Badge>
        <Badge appearance="outline" size="small">
          {task.category || 'General'}
        </Badge>
      </div>

      {!isChild && (
        <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
          <Button 
            size="small" 
            appearance="subtle" 
            onClick={() => addSubtask(task.id)}
          >
            Add Subtask
          </Button>
          {columns.map(col => col.status !== (task.status || 'pending') && (
            <Button
              key={col.status}
              size="small"
              appearance="outline"
              onClick={() => moveTask(task.id, col.status)}
            >
              → {col.title}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text className={classes.title}>KanbanPro</Text>
      </div>

      <div className={classes.kanbanBoard}>
        {columns.map(column => {
          const tasks = taskGroups[column.status] || [];
          const totalTasks = tasks.length + tasks.reduce((sum, group) => sum + group.children.length, 0);

          return (
            <div key={column.status} className={classes.column}>
              <div className={classes.columnHeader}>
                <Text className={classes.columnTitle} style={{ color: column.color }}>
                  {column.title}
                </Text>
                <div className={classes.taskCount}>{totalTasks}</div>
              </div>

              <div className={classes.taskList}>
                {tasks.map(group => (
                  <div key={group.parent.id}>
                    {renderTask(group.parent)}
                    {group.expanded && group.children.length > 0 && (
                      <div className={classes.childrenContainer}>
                        {group.children.map(child => renderTask(child, true))}
                      </div>
                    )}
                  </div>
                ))}

                {showQuickAdd[column.status] ? (
                  <Card className={classes.taskCard}>
                    <Input
                      className={classes.quickAddInput}
                      value={quickAddTitle[column.status] || ''}
                      onChange={(e) => setQuickAddTitle(prev => ({ 
                        ...prev, 
                        [column.status]: e.target.value 
                      }))}
                      placeholder="Enter task title..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addTask(column.status);
                        }
                        if (e.key === 'Escape') {
                          setShowQuickAdd(prev => ({ ...prev, [column.status]: false }));
                        }
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Button 
                        size="small" 
                        appearance="subtle" 
                        onClick={() => setShowQuickAdd(prev => ({ ...prev, [column.status]: false }))}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="small" 
                        appearance="primary" 
                        onClick={() => addTask(column.status)}
                      >
                        Add
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Button
                    className={classes.addButton}
                    appearance="outline"
                    icon={<Add20Regular />}
                    onClick={() => setShowQuickAdd(prev => ({ ...prev, [column.status]: true }))}
                  >
                    Add Task
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanView;