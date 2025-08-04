import React, { useState } from 'react';
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
  Edit20Regular,
} from '@fluentui/react-icons';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths, 
  subMonths,
  isToday,
  isSameMonth,
  parseISO,
  isSameDay,
} from 'date-fns';
import { useTodo } from '../../context/TodoContext';
import AddTodoDialog from '../../components/AddTodoDialog/AddTodoDialog';
import EditTodoDialog from '../../components/EditTodoDialog/EditTodoDialog';
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
  monthNavigation: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  monthYear: {
    fontSize: '24px',
    fontWeight: '600',
    minWidth: '200px',
    textAlign: 'center',
  },
  calendar: {
    backgroundColor: 'white',
    borderRadius: '8px',
    ...shorthands.padding('20px'),
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e1dfdd',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1px',
    backgroundColor: '#e1dfdd',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  weekdayHeader: {
    backgroundColor: '#f8f9fa',
    ...shorthands.padding('12px', '8px'),
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#605e5c',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  calendarDay: {
    backgroundColor: 'white',
    ...shorthands.padding('8px', '6px'),
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  dayNumber: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px',
    textAlign: 'left',
  },
  todayDay: {
    backgroundColor: '#e6f3ff',
    '& $dayNumber': {
      backgroundColor: '#0078d4',
      color: 'white',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  dayTodos: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  todoIndicator: {
    height: '4px',
    borderRadius: '2px',
    marginBottom: '1px',
    fontSize: '10px',
    ...shorthands.padding('2px', '4px'),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  highPriority: {
    backgroundColor: '#d13438',
  },
  mediumPriority: {
    backgroundColor: '#ff8c00',
  },
  lowPriority: {
    backgroundColor: '#107c10',
  },
  completedTodo: {
    opacity: 0.5,
    textDecoration: 'line-through',
  },
  moreIndicator: {
    fontSize: '9px',
    color: '#605e5c',
    textAlign: 'center',
    marginTop: '2px',
  },
});

const MonthView: React.FC = () => {
  const classes = useStyles();
  const { state } = useTodo();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
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

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return classes.highPriority;
      case 'medium': return classes.mediumPriority;
      case 'low': return classes.lowPriority;
      default: return classes.mediumPriority;
    }
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isCurrentMonth = () => {
    const now = new Date();
    return currentMonth.getMonth() === now.getMonth() && 
           currentMonth.getFullYear() === now.getFullYear();
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text className={classes.title}>Month View</Text>
      </div>

      <div className={classes.controls}>
        <div className={classes.monthNavigation}>
          <Button
            appearance="subtle"
            icon={<ChevronLeft20Regular />}
            onClick={() => navigateMonth('prev')}
          />
          <Text className={classes.monthYear}>
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
          <Button
            appearance="subtle"
            icon={<ChevronRight20Regular />}
            onClick={() => navigateMonth('next')}
          />
          {!isCurrentMonth() && (
            <Button appearance="outline" onClick={goToCurrentMonth}>
              This Month
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

      <Card className={classes.calendar}>
        <div className={classes.calendarGrid}>
          {weekdays.map(day => (
            <div key={day} className={classes.weekdayHeader}>
              {day}
            </div>
          ))}
          
          {calendarDays.map(day => {
            const dayTodos = getTodosForDay(day);
            const isCurrentDay = isToday(day);
            const isCurrentMonthDay = isSameMonth(day, currentMonth);
            
            let dayClasses = classes.calendarDay;
            if (isCurrentDay) dayClasses += ` ${classes.todayDay}`;
            if (!isCurrentMonthDay) dayClasses += ` ${classes.otherMonthDay}`;

            return (
              <div
                key={day.toISOString()}
                className={dayClasses}
                onClick={() => setSelectedDay(day)}
              >
                <Text className={classes.dayNumber}>
                  {format(day, 'd')}
                </Text>
                
                <div className={classes.dayTodos}>
                  {dayTodos.slice(0, 3).map(todo => {
                    const tooltipText = `${todo.title}\nPriority: ${(todo.priority || 'medium').toUpperCase()}\nStatus: ${(todo.status || 'pending').replace('_', ' ').toUpperCase()}\nCategory: ${todo.category || 'General'}${todo.description ? `\n\n${todo.description}` : ''}`;
                    
                    return (
                    <EditTodoDialog
                      key={todo.id}
                      todo={todo}
                      trigger={
                        <div
                          className={`${classes.todoIndicator} ${getPriorityClass(todo.priority)} ${
                            todo.status === 'completed' ? classes.completedTodo : ''
                          }`}
                          title={tooltipText}
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Text style={{ color: 'white', fontSize: '9px' }}>
                            {todo.title}
                          </Text>
                        </div>
                      }
                    />
                    );
                  })}
                  
                  {dayTodos.length > 3 && (
                    <Text className={classes.moreIndicator}>
                      +{dayTodos.length - 3} more
                    </Text>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
};

export default MonthView;