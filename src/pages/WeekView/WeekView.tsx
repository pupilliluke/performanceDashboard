import React, { useState, useEffect } from 'react';
import {
  Text,
  Card,
  Button,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
} from '@fluentui/react-icons';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addWeeks, 
  subWeeks,
  isToday,
  parseISO,
  isSameDay,
} from 'date-fns';
import { useTodo } from '../../context/TodoContext';
import TodoItem from '../../components/TodoItem/TodoItem';
import AddTodoDialog from '../../components/AddTodoDialog/AddTodoDialog';
import TaskDetailModal from '../../components/TaskDetailModal/TaskDetailModal';
import { Add20Regular } from '@fluentui/react-icons';
import { Todo } from '../../types/Todo';

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('0'),
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
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  weekNavigation: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  weekRange: {
    fontSize: '18px',
    fontWeight: '600',
    minWidth: '300px',
    textAlign: 'center',
  },
  weekGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  dayCard: {
    ...shorthands.padding('16px'),
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  dayHeader: {
    textAlign: 'center',
    marginBottom: '16px',
    ...shorthands.padding('0', '0', '12px', '0'),
    borderBottom: '1px solid #e1dfdd',
  },
  dayName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#323130',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dayDate: {
    fontSize: '20px',
    fontWeight: '700',
    marginTop: '4px',
  },
  todayCard: {
    backgroundColor: '#f8f9fa',
    ...shorthands.border('2px', 'solid', '#0078d4'),
  },
  todayDate: {
    color: '#0078d4',
  },
  dayTodos: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  todoCount: {
    fontSize: '12px',
    color: '#605e5c',
    textAlign: 'center',
    marginTop: '8px',
  },
  compactTodo: {
    ...shorthands.padding('8px'),
    fontSize: '12px',
    marginBottom: '4px',
  },
});

const WeekView: React.FC = () => {
  const classes = useStyles();
  const { state } = useTodo();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => 
      direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)
    );
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const getTodosForDay = (day: Date) => {
    return state.todos.filter(todo => {
      const todoDate = (todo.due_date && todo.due_date.trim() !== '') 
        ? parseISO(todo.due_date) 
        : parseISO(todo.created_at);
      return isSameDay(todoDate, day);
    }).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const isCurrentWeek = () => {
    const now = new Date();
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 0 });
    const currentWeekEnd = endOfWeek(now, { weekStartsOn: 0 });
    return weekStart.getTime() === currentWeekStart.getTime();
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text className={classes.title}>Week View</Text>
      </div>

      <div className={classes.controls}>
        <div className={classes.weekNavigation}>
          <Button
            appearance="subtle"
            icon={<ChevronLeft20Regular />}
            onClick={() => navigateWeek('prev')}
          />
          <Text className={classes.weekRange}>
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </Text>
          <Button
            appearance="subtle"
            icon={<ChevronRight20Regular />}
            onClick={() => navigateWeek('next')}
          />
          {!isCurrentWeek() && (
            <Button appearance="outline" onClick={goToCurrentWeek}>
              This Week
            </Button>
          )}
        </div>

        <AddTodoDialog
          trigger={
            <Button
              appearance="primary"
              icon={<Add20Regular />}
            >
              Add Task
            </Button>
          }
        />
      </div>

      <div className={classes.weekGrid}>
        {weekDays.map(day => {
          const dayTodos = getTodosForDay(day);
          const completedCount = dayTodos.filter(todo => todo.status === 'completed').length;
          const todayClass = isToday(day) ? classes.todayCard : '';
          const todayDateClass = isToday(day) ? classes.todayDate : '';

          return (
            <Card key={day.toISOString()} className={`${classes.dayCard} ${todayClass}`}>
              <div className={classes.dayHeader}>
                <Text className={classes.dayName}>
                  {format(day, 'EEE')}
                </Text>
                <Text className={`${classes.dayDate} ${todayDateClass}`}>
                  {format(day, 'd')}
                </Text>
              </div>

              <div className={classes.dayTodos}>
                {dayTodos.slice(0, 3).map(todo => (
                  <TaskDetailModal
                    key={todo.id}
                    todo={todo}
                    trigger={
                      <Card
                        className={classes.compactTodo}
                        style={{
                          borderLeft: `3px solid ${
                            todo.priority === 'high' ? '#d13438' :
                            todo.priority === 'medium' ? '#ff8c00' : '#107c10'
                          }`,
                          opacity: todo.status === 'completed' ? 0.7 : 1,
                          cursor: 'pointer',
                        }}
                      >
                        <Text style={{ 
                          fontSize: '12px',
                          textDecoration: todo.status === 'completed' ? 'line-through' : 'none'
                        }}>
                          {todo.title}
                        </Text>
                      </Card>
                    }
                  />
                ))}
                
                {dayTodos.length > 3 && (
                  <Text style={{ fontSize: '11px', color: '#605e5c', textAlign: 'center' }}>
                    +{dayTodos.length - 3} more
                  </Text>
                )}
              </div>

              <Text className={classes.todoCount}>
                {completedCount}/{dayTodos.length} completed
              </Text>
            </Card>
          );
        })}
      </div>

    </div>
  );
};

export default WeekView;