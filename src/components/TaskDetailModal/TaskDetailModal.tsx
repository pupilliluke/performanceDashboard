import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Text,
  Badge,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import {
  Dismiss24Regular,
  Edit20Regular,
} from '@fluentui/react-icons';
import { Todo } from '../../types/Todo';
import { format, parseISO } from 'date-fns';
import EditTodoDialog from '../EditTodoDialog/EditTodoDialog';

const useStyles = makeStyles({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: '500px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#323130',
    lineHeight: '1.2',
    flex: 1,
  },
  description: {
    fontSize: '16px',
    color: '#605e5c',
    lineHeight: '1.4',
    ...shorthands.padding('12px', '16px'),
    backgroundColor: '#f8f9fa',
    ...shorthands.borderRadius('8px'),
  },
  metaSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  metaLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#323130',
    minWidth: '80px',
  },
  priorityBadge: {
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
  statusBadge: {
    '&.completed': {
      backgroundColor: '#f3f9f1',
      color: '#107c10',
      ...shorthands.border('1px', 'solid', '#d1e7d1'),
    },
    '&.in_progress': {
      backgroundColor: '#fff8f0',
      color: '#ff8c00',
      ...shorthands.border('1px', 'solid', '#fde7cc'),
    },
    '&.pending': {
      backgroundColor: '#f8f9fa',
      color: '#605e5c',
      ...shorthands.border('1px', 'solid', '#e1dfdd'),
    },
  },
  dateText: {
    fontSize: '14px',
    color: '#605e5c',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
});

interface TaskDetailModalProps {
  todo: Todo;
  trigger: React.ReactElement;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ todo, trigger }) => {
  const classes = useStyles();

  const formatDate = (dateString: string | undefined) => {
    if (!dateString || dateString.trim() === '') return 'Not set';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy \'at\' h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  const formatDueDate = (dateString: string | undefined) => {
    if (!dateString || dateString.trim() === '') return 'No due date';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        {trigger}
      </DialogTrigger>
      <DialogSurface>
        <DialogContent className={classes.dialogContent}>
          <div className={classes.header}>
            <DialogTitle className={classes.title}>
              {todo.title || 'Untitled Task'}
            </DialogTitle>
            <DialogTrigger disableButtonEnhancement>
              <Button
                appearance="subtle"
                aria-label="close"
                icon={<Dismiss24Regular />}
                size="small"
              />
            </DialogTrigger>
          </div>

          {todo.description && (
            <div>
              <Text className={classes.metaLabel}>Description</Text>
              <Text className={classes.description}>
                {todo.description}
              </Text>
            </div>
          )}

          <div className={classes.metaSection}>
            <div className={classes.metaRow}>
              <Text className={classes.metaLabel}>Priority:</Text>
              <Badge 
                appearance="outline" 
                className={`${classes.priorityBadge} ${todo.priority || 'medium'}`}
              >
                {(todo.priority || 'medium').toUpperCase()}
              </Badge>
            </div>

            <div className={classes.metaRow}>
              <Text className={classes.metaLabel}>Status:</Text>
              <Badge 
                appearance="outline"
                className={`${classes.statusBadge} ${todo.status || 'pending'}`}
              >
                {(todo.status || 'pending').replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            <div className={classes.metaRow}>
              <Text className={classes.metaLabel}>Category:</Text>
              <Badge appearance="outline">
                {todo.category || 'General'}
              </Badge>
            </div>

            <div className={classes.metaRow}>
              <Text className={classes.metaLabel}>Due Date:</Text>
              <Text className={classes.dateText}>
                {formatDueDate(todo.due_date)}
              </Text>
            </div>

            <div className={classes.metaRow}>
              <Text className={classes.metaLabel}>Created:</Text>
              <Text className={classes.dateText}>
                {formatDate(todo.created_at)}
              </Text>
            </div>

            <div className={classes.metaRow}>
              <Text className={classes.metaLabel}>Updated:</Text>
              <Text className={classes.dateText}>
                {formatDate(todo.updated_at)}
              </Text>
            </div>

            {todo.completed_at && (
              <div className={classes.metaRow}>
                <Text className={classes.metaLabel}>Completed:</Text>
                <Text className={classes.dateText}>
                  {formatDate(todo.completed_at)}
                </Text>
              </div>
            )}
          </div>

          <DialogActions className={classes.actions}>
            <EditTodoDialog
              todo={todo}
              trigger={
                <Button appearance="primary" icon={<Edit20Regular />}>
                  Edit Task
                </Button>
              }
            />
          </DialogActions>
        </DialogContent>
      </DialogSurface>
    </Dialog>
  );
};

export default TaskDetailModal;