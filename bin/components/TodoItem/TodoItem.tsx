import React from 'react';
import {
  Card,
  Text,
  Button,
  Checkbox,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import {
  MoreHorizontal20Regular,
  Edit20Regular,
  Delete20Regular,
} from '@fluentui/react-icons';
import { Todo } from '../../types/Todo';
import { useTodo } from '../../context/TodoContext';
import { format, parseISO } from 'date-fns';
import EditTodoDialog from '../EditTodoDialog/EditTodoDialog';

const useStyles = makeStyles({
  todoCard: {
    marginBottom: '12px',
    ...shorthands.padding('16px'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
  },
  todoHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  todoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  todoMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  dueDate: {
    fontSize: '12px',
    color: '#605e5c',
  },
  completedCard: {
    opacity: '0.7',
    '& $todoTitle': {
      textDecoration: 'line-through',
    },
  },
  priorityIndicator: {
    width: '4px',
    height: '100%',
    position: 'absolute',
    left: '0',
    top: '0',
    borderRadius: '4px 0 0 4px',
    '&.high': {
      backgroundColor: '#d13438',
    },
    '&.medium': {
      backgroundColor: '#ff8c00',
    },
    '&.low': {
      backgroundColor: '#107c10',
    },
  },
});

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const classes = useStyles();
  const { actions } = useTodo();

  const handleStatusChange = async (checked: boolean) => {
    const newStatus = checked ? 'completed' : 'pending';
    await actions.updateTodo(todo.id, { status: newStatus });
  };

  const handleDelete = async () => {
    await actions.deleteTodo(todo.id);
  };

  const formatDueDate = (dateString: string) => {
    try {
      if (!dateString || dateString.trim() === '') {
        return 'No due date';
      }
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#d13438';
      case 'medium': return '#ff8c00';
      case 'low': return '#107c10';
      default: return '#605e5c';
    }
  };

  return (
    <Card 
      className={`${classes.todoCard} ${(todo.status || 'pending') === 'completed' ? classes.completedCard : ''}`}
      style={{ position: 'relative' }}
    >
      <div 
        className={`${classes.priorityIndicator} ${todo.priority || 'medium'}`}
        style={{ backgroundColor: getPriorityColor(todo.priority || 'medium') }}
      />
      
      <div className={classes.todoHeader}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Checkbox
              checked={(todo.status || 'pending') === 'completed'}
              onChange={(_, data) => handleStatusChange(data.checked === true)}
            />
            <Text className={classes.todoTitle}>{todo.title || 'Untitled Task'}</Text>
          </div>
          
          <div className={classes.todoMeta}>
            <Text style={{ fontSize: '12px', color: '#605e5c' }}>
              {(todo.priority || 'medium')} • {(todo.status || 'pending').replace('_', ' ')} • {todo.category || 'General'}
            </Text>
            
            {todo.due_date && todo.due_date.trim() !== '' && (
              <Text className={classes.dueDate}>
                Due: {formatDueDate(todo.due_date)}
              </Text>
            )}
          </div>
        </div>
        
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="subtle"
              icon={<MoreHorizontal20Regular />}
              size="small"
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <EditTodoDialog
                todo={todo}
                trigger={
                  <MenuItem icon={<Edit20Regular />}>
                    Edit
                  </MenuItem>
                }
              />
              <MenuItem 
                icon={<Delete20Regular />}
                onClick={handleDelete}
              >
                Delete
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </Card>
  );
};

export default TodoItem;