import React, { useState, useEffect } from 'react';
import {
  Text,
  Card,
  Button,
  Input,
  Dropdown,
  Option,
  Switch,
  Badge,
  makeStyles,
  shorthands,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  Add24Filled,
  Clock20Regular,
  Delete20Regular,
  Edit20Regular,
  MoreHorizontal20Regular,
  Checkmark20Regular,
  ArrowRepeatAll20Regular,
} from '@fluentui/react-icons';
import { format, parseISO, isToday, isFuture, isPast } from 'date-fns';
import { Reminder } from '../../types/Todo';

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('0'),
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    color: '#323130',
  },
  header: {
    marginBottom: '32px',
    ...shorthands.padding('24px', '0'),
    backgroundColor: '#ffffff',
    ...shorthands.borderRadius('16px'),
    ...shorthands.margin('0', '0', '24px', '0'),
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#323130',
    marginBottom: '8px',
    textAlign: 'center',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    ...shorthands.padding('16px', '20px'),
    backgroundColor: '#ffffff',
    ...shorthands.borderRadius('12px'),
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
  },
  filterGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: 'transparent',
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
    ...shorthands.borderRadius('8px'),
    color: '#605e5c',
    '&:hover': {
      backgroundColor: '#f3f2f1',
      color: '#323130',
    },
    '&.active': {
      backgroundColor: '#0078d4',
      color: '#ffffff',
      ...shorthands.border('1px', 'solid', '#0078d4'),
    },
  },
  addButton: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    zIndex: 1000,
  },
  remindersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  reminderCard: {
    ...shorthands.padding('16px'),
    backgroundColor: '#ffffff',
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
    ...shorthands.borderRadius('12px'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
    '&.overdue': {
      ...shorthands.border('1px', 'solid', '#d13438'),
      backgroundColor: '#fef7f7',
    },
    '&.today': {
      ...shorthands.border('1px', 'solid', '#ff8c00'),
      backgroundColor: '#fff8f0',
    },
    '&.completed': {
      opacity: 0.7,
      backgroundColor: '#f3f9f1',
    },
  },
  reminderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  reminderTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#323130',
    marginBottom: '8px',
    flex: 1,
    marginRight: '8px',
  },
  reminderContent: {
    fontSize: '14px',
    color: '#605e5c',
    lineHeight: '1.4',
    marginBottom: '12px',
  },
  reminderMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  timeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#605e5c',
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
  quickAddForm: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '12px',
    marginBottom: '24px',
    ...shorthands.padding('16px'),
    backgroundColor: '#ffffff',
    ...shorthands.borderRadius('12px'),
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
  },
  quickAddInput: {
    gridColumn: '1 / -1',
    marginBottom: '12px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr auto',
    gap: '12px',
    alignItems: 'end',
  },
  emptyState: {
    textAlign: 'center',
    color: '#605e5c',
    fontStyle: 'italic',
    ...shorthands.padding('60px', '20px'),
    gridColumn: '1 / -1',
  },
});

const RemindersView: React.FC = () => {
  const classes = useStyles();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today' | 'overdue' | 'completed'>('all');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddData, setQuickAddData] = useState({
    title: '',
    description: '',
    reminder_date: new Date().toISOString().split('T')[0],
    reminder_time: '09:00',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'General',
    is_recurring: false,
    recurrence_type: 'daily' as 'daily' | 'weekly' | 'monthly' | 'yearly',
  });

  useEffect(() => {
    // Initialize with sample reminders
    const sampleReminders: Reminder[] = [
      {
        id: '1',
        title: 'Team standup meeting',
        description: 'Daily standup with the development team',
        reminder_date: new Date().toISOString().split('T')[0],
        reminder_time: '10:00',
        priority: 'high',
        category: 'Work',
        is_recurring: true,
        recurrence_type: 'daily',
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Doctor appointment',
        description: 'Annual checkup with Dr. Smith',
        reminder_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reminder_time: '14:30',
        priority: 'high',
        category: 'Health',
        is_recurring: false,
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Call mom',
        description: 'Weekly check-in call',
        reminder_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reminder_time: '19:00',
        priority: 'medium',
        category: 'Family',
        is_recurring: true,
        recurrence_type: 'weekly',
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    setReminders(sampleReminders);
  }, []);

  const filteredReminders = reminders.filter(reminder => {
    if (filter === 'completed') return reminder.is_completed;
    if (filter === 'today') return isToday(parseISO(reminder.reminder_date)) && !reminder.is_completed;
    if (filter === 'upcoming') return isFuture(parseISO(reminder.reminder_date)) && !reminder.is_completed;
    if (filter === 'overdue') return isPast(parseISO(reminder.reminder_date)) && !isToday(parseISO(reminder.reminder_date)) && !reminder.is_completed;
    return true; // 'all'
  });

  const handleAddReminder = () => {
    if (!quickAddData.title.trim()) return;

    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: quickAddData.title.trim(),
      description: quickAddData.description.trim(),
      reminder_date: quickAddData.reminder_date,
      reminder_time: quickAddData.reminder_time,
      priority: quickAddData.priority,
      category: quickAddData.category,
      is_recurring: quickAddData.is_recurring,
      recurrence_type: quickAddData.is_recurring ? quickAddData.recurrence_type : undefined,
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setReminders(prev => [newReminder, ...prev]);
    setQuickAddData({
      title: '',
      description: '',
      reminder_date: new Date().toISOString().split('T')[0],
      reminder_time: '09:00',
      priority: 'medium',
      category: 'General',
      is_recurring: false,
      recurrence_type: 'daily',
    });
    setShowQuickAdd(false);
  };

  const handleCompleteReminder = (reminderId: string) => {
    setReminders(prev => prev.map(reminder =>
      reminder.id === reminderId
        ? { ...reminder, is_completed: !reminder.is_completed, updated_at: new Date().toISOString() }
        : reminder
    ));
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
  };

  const getReminderStatus = (reminder: Reminder) => {
    if (reminder.is_completed) return 'completed';
    if (isToday(parseISO(reminder.reminder_date))) return 'today';
    if (isPast(parseISO(reminder.reminder_date))) return 'overdue';
    return 'upcoming';
  };

  const formatReminderTime = (reminder: Reminder) => {
    const date = parseISO(reminder.reminder_date);
    const time = reminder.reminder_time;
    return `${format(date, 'MMM dd, yyyy')} at ${time}`;
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text className={classes.title}>Reminders</Text>
      </div>

      <div className={classes.controls}>
        <div className={classes.filterGroup}>
          {[
            { key: 'all', label: 'All' },
            { key: 'today', label: 'Today' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'overdue', label: 'Overdue' },
            { key: 'completed', label: 'Completed' },
          ].map(filterOption => (
            <Button
              key={filterOption.key}
              className={`${classes.filterButton} ${filter === filterOption.key ? 'active' : ''}`}
              appearance="subtle"
              onClick={() => setFilter(filterOption.key as any)}
            >
              {filterOption.label}
            </Button>
          ))}
        </div>
        
        <Button
          appearance="primary"
          onClick={() => setShowQuickAdd(!showQuickAdd)}
        >
          {showQuickAdd ? 'Cancel' : 'Add Reminder'}
        </Button>
      </div>

      {showQuickAdd && (
        <div className={classes.quickAddForm}>
          <Input
            className={classes.quickAddInput}
            placeholder="Reminder title..."
            value={quickAddData.title}
            onChange={(_, data) => setQuickAddData(prev => ({ ...prev, title: data.value }))}
          />
          
          <div className={classes.formRow}>
            <Input
              type="date"
              value={quickAddData.reminder_date}
              onChange={(_, data) => setQuickAddData(prev => ({ ...prev, reminder_date: data.value }))}
            />
            <Input
              type="time"
              value={quickAddData.reminder_time}
              onChange={(_, data) => setQuickAddData(prev => ({ ...prev, reminder_time: data.value }))}
            />
            <Dropdown
              value={quickAddData.priority}
              selectedOptions={[quickAddData.priority]}
              onOptionSelect={(_, data) => setQuickAddData(prev => ({ ...prev, priority: data.optionValue as any }))}
            >
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Dropdown>
            <Button
              appearance="primary"
              onClick={handleAddReminder}
              disabled={!quickAddData.title.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      <div className={classes.remindersGrid}>
        {filteredReminders.length === 0 ? (
          <div className={classes.emptyState}>
            No reminders found for the selected filter.
          </div>
        ) : (
          filteredReminders.map(reminder => (
            <Card
              key={reminder.id}
              className={`${classes.reminderCard} ${getReminderStatus(reminder)}`}
            >
              <div className={classes.reminderHeader}>
                <Text className={classes.reminderTitle}>
                  {reminder.title}
                </Text>
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
                      <MenuItem
                        icon={<Checkmark20Regular />}
                        onClick={() => handleCompleteReminder(reminder.id)}
                      >
                        {reminder.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
                      </MenuItem>
                      <MenuItem
                        icon={<Delete20Regular />}
                        onClick={() => handleDeleteReminder(reminder.id)}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </MenuPopover>
                </Menu>
              </div>

              {reminder.description && (
                <Text className={classes.reminderContent}>
                  {reminder.description}
                </Text>
              )}

              <div className={classes.reminderMeta}>
                <div className={classes.timeInfo}>
                  <Clock20Regular />
                  <span>{formatReminderTime(reminder)}</span>
                </div>
                
                {reminder.is_recurring && (
                  <div className={classes.timeInfo}>
                    <ArrowRepeatAll20Regular />
                    <span>{reminder.recurrence_type}</span>
                  </div>
                )}

                <Badge 
                  appearance="outline" 
                  className={`${classes.priorityBadge} ${reminder.priority}`}
                >
                  {reminder.priority.toUpperCase()}
                </Badge>

                <Badge appearance="outline" size="small">
                  {reminder.category}
                </Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RemindersView;