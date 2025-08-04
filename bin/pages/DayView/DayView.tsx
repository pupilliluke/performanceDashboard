import React, { useState, useEffect } from 'react';
import {
  Text,
  Card,
  Button,
  Dropdown,
  Option,
  Input,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
  Search20Regular,
} from '@fluentui/react-icons';
import { format, addDays, subDays, isToday, parseISO, isEqual, startOfDay } from 'date-fns';
import { useTodo } from '../../context/TodoContext';
import TodoItem from '../../components/TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import AddTodoDialog from '../../components/AddTodoDialog/AddTodoDialog';
import { Add20Regular } from '@fluentui/react-icons';

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
    flexWrap: 'wrap',
    gap: '16px',
  },
  dateNavigation: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  currentDate: {
    fontSize: '18px',
    fontWeight: '600',
    minWidth: '200px',
    textAlign: 'center',
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  searchInput: {
    minWidth: '250px',
  },
  todosContainer: {
    display: 'grid',
    gap: '12px',
  },
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding('40px'),
    color: '#605e5c',
  },
  todayBadge: {
    backgroundColor: '#0078d4',
    color: 'white',
    ...shorthands.padding('4px', '8px'),
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    marginLeft: '8px',
  },
});

const DayView: React.FC = () => {
  const classes = useStyles();
  const { state } = useTodo();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'next' ? addDays(prev, 1) : subDays(prev, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const filteredTodos = state.todos.filter(todo => {
    const todoDate = (todo.due_date && todo.due_date.trim() !== '') 
      ? parseISO(todo.due_date) 
      : parseISO(todo.created_at);
    const isSameDate = isEqual(startOfDay(todoDate), startOfDay(currentDate));
    
    const matchesSearch = !searchTerm || 
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || todo.status === statusFilter;

    return isSameDate && matchesSearch && matchesPriority && matchesStatus;
  });

  const todaysTodos = filteredTodos.filter(todo => {
    if (todo.due_date && todo.due_date.trim() !== '') {
      return isEqual(startOfDay(parseISO(todo.due_date)), startOfDay(currentDate));
    }
    return isEqual(startOfDay(parseISO(todo.created_at)), startOfDay(currentDate));
  });

  const overdueTodos = state.todos.filter(todo => {
    if (!todo.due_date || todo.due_date.trim() === '') return false;
    const dueDate = parseISO(todo.due_date);
    return dueDate < startOfDay(currentDate) && todo.status !== 'completed';
  });

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text className={classes.title}>Day View</Text>
      </div>

      <div className={classes.controls}>
        <div className={classes.dateNavigation}>
          <Button
            appearance="subtle"
            icon={<ChevronLeft20Regular />}
            onClick={() => navigateDate('prev')}
          />
          <Text className={classes.currentDate}>
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
            {isToday(currentDate) && (
              <span className={classes.todayBadge}>Today</span>
            )}
          </Text>
          <Button
            appearance="subtle"
            icon={<ChevronRight20Regular />}
            onClick={() => navigateDate('next')}
          />
          {!isToday(currentDate) && (
            <Button appearance="outline" onClick={goToToday}>
              Today
            </Button>
          )}
        </div>

        <div className={classes.filters}>
          <Input
            className={classes.searchInput}
            placeholder="Search todos..."
            contentBefore={<Search20Regular />}
            value={searchTerm}
            onChange={(_, data) => setSearchTerm(data.value)}
          />
          
          <Dropdown
            placeholder="Priority"
            value={priorityFilter}
            selectedOptions={[priorityFilter]}
            onOptionSelect={(_, data) => setPriorityFilter(data.optionValue as string)}
          >
            <Option value="all">All Priorities</Option>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Dropdown>

          <Dropdown
            placeholder="Status"
            value={statusFilter}
            selectedOptions={[statusFilter]}
            onOptionSelect={(_, data) => setStatusFilter(data.optionValue as string)}
          >
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="in_progress">In Progress</Option>
            <Option value="completed">Completed</Option>
          </Dropdown>

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
      </div>

      {overdueTodos.length > 0 && (
        <Card style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fef7f7', borderColor: '#f7d4d6' }}>
          <Text style={{ color: '#d13438', fontWeight: '600', marginBottom: '12px' }}>
            Overdue Tasks ({overdueTodos.length})
          </Text>
          <div className={classes.todosContainer}>
            {overdueTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
              />
            ))}
          </div>
        </Card>
      )}

      <div className={classes.todosContainer}>
        {todaysTodos.length === 0 ? (
          <Card className={classes.emptyState}>
            <Text>No tasks scheduled for this day</Text>
            <Text style={{ fontSize: '14px', marginTop: '8px' }}>
              Create a new task to get started!
            </Text>
          </Card>
        ) : (
          todaysTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default DayView;