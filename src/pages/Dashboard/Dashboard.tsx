import React, { useEffect, useState } from 'react';
import {
  Text,
  Card,
  CardHeader,
  Button,
  makeStyles,
  shorthands,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  Field,
} from '@fluentui/react-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useTodo } from '../../context/TodoContext';
import { format, subDays, parseISO } from 'date-fns';
import TodoItem from '../../components/TodoItem/TodoItem';
import AddTodoDialog from '../../components/AddTodoDialog/AddTodoDialog';
import { 
  Add24Filled,
  Filter20Regular,
  CalendarLtr20Regular,
  Settings20Regular,
  ArrowDownload20Regular,
  Lightbulb20Regular,
  ChevronUp20Regular,
} from '@fluentui/react-icons';

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
  subtitle: {
    fontSize: '16px',
    color: '#605e5c',
    textAlign: 'center',
    opacity: 0.8,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  statCard: {
    ...shorthands.padding('24px'),
    textAlign: 'center',
    backgroundColor: '#ffffff',
    ...shorthands.borderRadius('12px'),
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#0078d4',
    marginBottom: '8px',
    lineHeight: '1.2',
    display: 'inline-block',
    paddingBottom: '2px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#605e5c',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
  },
  chartCard: {
    ...shorthands.padding('28px'),
    backgroundColor: '#ffffff',
    ...shorthands.borderRadius('12px'),
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
  },
  chartTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#323130',
    marginBottom: '20px',
    textAlign: 'center',
  },
  todosSection: {
    marginTop: '32px',
  },
  todosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginTop: '16px',
  },
  todoColumn: {
    ...shorthands.padding('24px'),
    maxHeight: '600px',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    ...shorthands.borderRadius('12px'),
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  todoColumnHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    ...shorthands.padding('0', '0', '12px', '0'),
    borderBottom: '1px solid #e1dfdd',
  },
  todoColumnTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#323130',
  },
  todoCount: {
    fontSize: '14px',
    color: '#0078d4',
    backgroundColor: '#f3f2f1',
    ...shorthands.padding('4px', '8px'),
    borderRadius: '12px',
    fontWeight: '600',
  },
  todoList: {
    maxHeight: '400px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f3f2f1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c8c6c4',
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: '#a19f9d',
      },
    },
  },
  todoListExpanded: {
    maxHeight: '400px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f3f2f1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c8c6c4',
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: '#a19f9d',
      },
    },
  },
  showMoreButton: {
    marginTop: '12px',
    width: '100%',
    textAlign: 'center',
    fontSize: '12px',
    color: '#0078d4',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f3f2f1',
      borderRadius: '4px',
    },
  },
  fab: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    zIndex: 1000,
  },
  emptyState: {
    textAlign: 'center',
    color: '#605e5c',
    fontStyle: 'italic',
    ...shorthands.padding('20px'),
  },
  advancedControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    ...shorthands.padding('16px', '20px'),
    backgroundColor: '#ffffff',
    ...shorthands.borderRadius('12px'),
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
  },
  controlGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  timeSelector: {
    backgroundColor: '#ffffff',
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
    ...shorthands.borderRadius('8px'),
    color: '#323130',
    ...shorthands.padding('8px', '12px'),
    minWidth: '120px',
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
  },
  insightsCard: {
    ...shorthands.padding('20px'),
    backgroundColor: '#ffffff',
    ...shorthands.borderRadius('12px'),
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
    marginBottom: '24px',
  },
  insightsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  insightsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#323130',
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  insightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    ...shorthands.padding('12px'),
    backgroundColor: '#f3f2f1',
    ...shorthands.borderRadius('8px'),
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
  },
  insightIcon: {
    color: '#0078d4',
  },
  insightText: {
    color: '#605e5c',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  activityFeed: {
    ...shorthands.padding('20px'),
    backgroundColor: '#ffffff',
    ...shorthands.borderRadius('12px'),
    ...shorthands.border('1px', 'solid', '#e1dfdd'),
    maxHeight: '400px',
    overflowY: 'auto',
  },
  activityHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  activityTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#323130',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    ...shorthands.padding('12px', '0'),
    borderBottom: '1px solid #e1dfdd',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  activityTime: {
    fontSize: '12px',
    color: '#0078d4',
    minWidth: '60px',
  },
  activityDescription: {
    fontSize: '14px',
    color: '#605e5c',
    flex: 1,
  },
  customizeModal: {
    width: '500px',
  },
  cardOption: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('12px', '0'),
    borderBottom: '1px solid #e1dfdd',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#323130',
  },
  cardDescription: {
    fontSize: '12px',
    color: '#605e5c',
  },
});

const COLORS = ['rgba(0, 120, 212, 0.8)', 'rgba(16, 124, 16, 0.8)', 'rgba(255, 140, 0, 0.8)', 'rgba(209, 52, 56, 0.8)', 'rgba(139, 102, 204, 0.8)', 'rgba(255, 185, 0, 0.8)', 'rgba(0, 183, 195, 0.8)'];

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const { state, actions } = useTodo();
  const [chartData, setChartData] = useState<any>({
    statusData: [],
    priorityData: [],
    categoryData: [],
    trendData: [],
    performanceData: [],
    deadlineData: [],
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [visibleCards, setVisibleCards] = useState({
    priorityDistribution: true,
    categoryDistribution: true,
    taskCreationTrend: true,
    categoryPerformance: true,
    deadlineAnalysis: true,
    productivityRadar: true,
    upcomingReminders: true,
    recentActivity: true,
    activityHeatmap: false, // Hidden by default
    taskStatusDistribution: false, // Commented out card, hidden by default
  });
  const [activityData] = useState([
    { time: '2m ago', description: 'Completed "Design user interface" task', type: 'completed' },
    { time: '15m ago', description: 'Created new task "Write documentation"', type: 'created' },
    { time: '1h ago', description: 'Updated priority for "Project setup" to High', type: 'updated' },
    { time: '2h ago', description: 'Added new category "Development"', type: 'category' },
    { time: '3h ago', description: 'Completed "Research competitors" subtask', type: 'completed' },
  ]);
  const [expandedTasks, setExpandedTasks] = useState({
    openTasks: false,
    completedTasks: false,
  });

  useEffect(() => {
    const processData = () => {
      const todos = state.todos.filter(todo => todo && todo.id && todo.title);

      const statusCounts = todos.reduce((acc, todo) => {
        const status = todo.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const priorityCounts = todos.reduce((acc, todo) => {
        const priority = todo.priority || 'medium';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const categoryCounts = todos.reduce((acc, todo) => {
        const category = todo.category || 'General';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const count = todos.filter(todo => {
          try {
            return todo.created_at && format(parseISO(todo.created_at), 'yyyy-MM-dd') === dateStr;
          } catch {
            return false;
          }
        }).length;
        return {
          date: format(date, 'MMM dd'),
          count,
        };
      }).reverse();

      // Performance/Ranking Data - Tasks by completion rate per category
      const performanceData = Object.entries(categoryCounts).map(([category, total]) => {
        const completed = todos.filter(t => (t.category || 'General') === category && t.status === 'completed').length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          category,
          total,
          completed,
          rate,
          remaining: total - completed
        };
      }).sort((a, b) => b.rate - a.rate);

      // Deadline Analysis Data - Tasks by days until deadline
      const deadlineData = todos
        .filter(todo => todo.due_date && todo.due_date.trim() !== '' && todo.status !== 'completed')
        .map(todo => {
          try {
            const dueDate = parseISO(todo.due_date!);
            const now = new Date();
            const diffTime = dueDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let category = 'Future';
            if (diffDays < 0) category = 'Overdue';
            else if (diffDays === 0) category = 'Due Today';
            else if (diffDays <= 3) category = 'Due Soon (≤3 days)';
            else if (diffDays <= 7) category = 'Due This Week';
            
            return { category, days: diffDays, title: todo.title, priority: todo.priority };
          } catch {
            return null;
          }
        })
        .filter(item => item !== null)
        .reduce((acc: any[], item: any) => {
          const existing = acc.find(a => a.category === item.category);
          if (existing) {
            existing.count++;
            existing.tasks.push({ title: item.title, days: item.days, priority: item.priority });
          } else {
            acc.push({ 
              category: item.category, 
              count: 1, 
              tasks: [{ title: item.title, days: item.days, priority: item.priority }]
            });
          }
          return acc;
        }, []);

      setChartData({
        statusData: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
        priorityData: Object.entries(priorityCounts).map(([name, value]) => ({ name, value })),
        categoryData: Object.entries(categoryCounts).map(([name, value]) => ({ name, value })),
        trendData: last7Days,
        performanceData,
        deadlineData,
        heatmapData: (() => {
          const today = new Date();
          const days = [];
          for (let i = 0; i < 35; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayTasks = todos.filter(todo => {
              try {
                return todo.created_at && format(parseISO(todo.created_at), 'yyyy-MM-dd') === dateStr;
              } catch {
                return false;
              }
            });
            
            days.push({
              date: dateStr,
              day: format(date, 'MMM dd'),
              weekday: format(date, 'EEE'),
              value: dayTasks.length,
              completed: dayTasks.filter(t => t.status === 'completed').length,
              intensity: Math.min(dayTasks.length / 3, 1), // Normalize to 0-1
            });
          }
          return days.reverse();
        })(),
        burndownData: (() => {
          const today = new Date();
          const days = [];
          let remainingTasks = todos.filter(t => t.status !== 'completed').length;
          let totalTasks = todos.length;
          
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = format(date, 'MMM dd');
            
            // Simulate task completion over time (in real app, this would be historical data)
            const dailyCompleted = Math.floor(Math.random() * 3) + 1;
            remainingTasks = Math.max(0, remainingTasks - dailyCompleted);
            
            days.push({
              date: dateStr,
              remaining: remainingTasks,
              ideal: Math.max(0, totalTasks - ((totalTasks / 7) * (7 - i))),
              completed: totalTasks - remainingTasks,
            });
          }
          return days;
        })(),
        radarData: [
          {
            metric: 'Task Creation',
            value: Math.min(todos.length * 10, 100),
            fullMark: 100,
          },
          {
            metric: 'Completion Rate',
            value: todos.length > 0 ? Math.round((todos.filter(t => t.status === 'completed').length / todos.length) * 100) : 0,
            fullMark: 100,
          },
          {
            metric: 'Priority Focus',
            value: Math.min(todos.filter(t => t.priority === 'high').length * 20, 100),
            fullMark: 100,
          },
          {
            metric: 'Category Balance',
            value: Math.min(Object.keys(categoryCounts).length * 25, 100),
            fullMark: 100,
          },
          {
            metric: 'Deadline Adherence',
            value: Math.max(100 - (deadlineData.filter(d => d.category === 'Overdue').reduce((sum, d) => sum + d.count, 0) * 25), 0),
            fullMark: 100,
          },
          {
            metric: 'Recent Activity',
            value: Math.min(todos.filter(t => {
              const createdDate = new Date(t.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return createdDate > weekAgo;
            }).length * 15, 100),
            fullMark: 100,
          },
        ],
      });
    };

    if (state.todos.length > 0) {
      processData();
    }
  }, [state.todos]);

  const generateInsights = () => {
    const todos = state.todos.filter(todo => todo && todo.id && todo.title);
    const completedTodos = todos.filter(todo => todo.status === 'completed');
    const pendingTodos = todos.filter(todo => todo.status === 'pending');
    const highPriorityTodos = todos.filter(todo => todo.priority === 'high');
    
    const insights = [];
    
    // Completion rate insight
    const completionRate = todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0;
    if (completionRate > 80) {
      insights.push('🎉 Excellent! You have an 80%+ completion rate. Keep up the great work!');
    } else if (completionRate < 50) {
      insights.push('⚡ Focus opportunity: Consider breaking down large tasks into smaller, manageable ones.');
    }
    
    // Priority focus insight
    if (highPriorityTodos.length > 5) {
      insights.push('🎯 You have many high-priority tasks. Consider tackling 2-3 at a time for better focus.');
    }
    
    // Productivity pattern insight
    const recentlyCompleted = completedTodos.filter(todo => {
      if (!todo.completed_at) return false;
      const completedDate = new Date(todo.completed_at);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return completedDate > threeDaysAgo;
    });
    
    if (recentlyCompleted.length > 3) {
      insights.push('🚀 You\'re on fire! You\'ve completed multiple tasks in the last 3 days.');
    }
    
    // Category balance insight
    const categoryCount = todos.reduce((acc, todo) => {
      const category = todo.category || 'General';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryEntries = Object.entries(categoryCount);
    if (categoryEntries.length > 1) {
      const dominantCategory = categoryEntries.reduce((a, b) => a[1] > b[1] ? a : b);
      if (dominantCategory[1] > todos.length * 0.6) {
        insights.push(`📊 Most tasks are in "${dominantCategory[0]}". Consider diversifying your focus areas.`);
      }
    }
    
    return insights.slice(0, 3); // Show max 3 insights
  };

  const handleFilter = () => {
    setShowFilterModal(true);
    // Filter functionality would go here
    console.log('Filter clicked - Time range:', timeRange, 'Categories:', selectedCategories);
  };

  const cardDefinitions = {
    priorityDistribution: {
      title: 'Priority Distribution',
      description: 'Shows the distribution of tasks by priority level'
    },
    categoryDistribution: {
      title: 'Category Distribution', 
      description: 'Pie chart showing tasks grouped by category'
    },
    taskCreationTrend: {
      title: 'Task Creation Trend',
      description: 'Line chart showing task creation over the last 7 days'
    },
    categoryPerformance: {
      title: 'Category Performance Ranking',
      description: 'Combined chart showing completion rates by category'
    },
    deadlineAnalysis: {
      title: 'Deadline Analysis',
      description: 'Area chart showing tasks by deadline status'
    },
    productivityRadar: {
      title: 'Productivity Radar',
      description: 'Radar chart showing overall productivity metrics'
    },
    upcomingReminders: {
      title: 'Upcoming Reminders',
      description: 'List of upcoming reminders and alerts'
    },
    recentActivity: {
      title: 'Recent Activity',
      description: 'Feed showing recent task and system activities'
    },
    activityHeatmap: {
      title: 'Activity Heatmap',
      description: 'GitHub-style heatmap showing task creation over time'
    },
    taskStatusDistribution: {
      title: 'Task Status Distribution',
      description: 'Pie chart showing the distribution of task statuses'
    },
  };

  const handleCustomize = () => {
    setShowCustomizeModal(true);
  };

  const handleCardToggle = (cardKey: string, enabled: boolean) => {
    setVisibleCards(prev => ({
      ...prev,
      [cardKey]: enabled
    }));
  };

  const handleToggleExpandTasks = (taskType: 'openTasks' | 'completedTasks') => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskType]: !prev[taskType]
    }));
  };

  const handleExport = () => {
    // Export only tasks, reminders, and notes
    const exportData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportedBy: 'TodoPro Dashboard',
        version: '1.0.0'
      },
      tasks: validTodos.map(todo => ({
        id: todo.id,
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority,
        status: todo.status,
        category: todo.category,
        due_date: todo.due_date || '',
        created_at: todo.created_at,
        updated_at: todo.updated_at,
        completed_at: todo.completed_at || ''
      })),
      reminders: [
        // Sample reminders data - in a real app this would come from a reminders state/context
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
          updated_at: new Date().toISOString()
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
          updated_at: new Date().toISOString()
        }
      ],
      notes: [
        // Sample notes data - in a real app this would come from notes context
        {
          id: '1',
          title: 'Project Ideas',
          content: 'Build a task manager\nCreate a weather app\nDevelop a music player\nDesign a portfolio website',
          color: '#f3f9f1',
          isPinned: true,
          labels: ['development', 'ideas'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Meeting Notes',
          content: 'Discussed Q4 goals\n- Increase productivity by 20%\n- Launch new feature\n- Improve user experience\n\nAction items:\n- Research competitors\n- Create mockups\n- Schedule user testing',
          color: '#e6f7ff',
          isPinned: false,
          labels: ['work', 'meetings'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `todopro-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const validTodos = state.todos.filter(todo => todo && todo.id && todo.title);
  const totalTodos = validTodos.length;
  const completedTodos = validTodos.filter(todo => todo.status === 'completed').length;
  const pendingTodos = validTodos.filter(todo => todo.status === 'pending').length;
  const inProgressTodos = validTodos.filter(todo => todo.status === 'in_progress').length;
  const openTodos = validTodos.filter(todo => (todo.status || 'pending') !== 'completed');
  const completedTodosList = validTodos.filter(todo => (todo.status || 'pending') === 'completed');
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  if (state.loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text className={classes.title}>Dashboard</Text>
      </div>

      <div className={classes.advancedControls}>
        <div className={classes.controlGroup}>
          <CalendarLtr20Regular style={{ color: '#605e5c' }} />
          <select 
            className={classes.timeSelector}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button 
            className={classes.filterButton}
            icon={<Filter20Regular />}
            appearance="subtle"
            onClick={handleFilter}
          >
            Filters
          </Button>
        </div>
        
        <div className={classes.controlGroup}>
          <Dialog open={showCustomizeModal} onOpenChange={(_, data) => setShowCustomizeModal(data.open)}>
            <DialogTrigger disableButtonEnhancement>
              <Button 
                className={classes.filterButton}
                icon={<Settings20Regular />}
                appearance="subtle"
              >
                Customize
              </Button>
            </DialogTrigger>
            <DialogSurface className={classes.customizeModal}>
              <DialogTitle>Customize Dashboard</DialogTitle>
              <DialogContent>
                <Text style={{ marginBottom: '16px', color: '#605e5c' }}>
                  Choose which cards to display on your dashboard:
                </Text>
                
                {Object.entries(cardDefinitions).map(([key, card]) => (
                  <div key={key} className={classes.cardOption}>
                    <div className={classes.cardInfo}>
                      <Text className={classes.cardTitle}>{card.title}</Text>
                      <Text className={classes.cardDescription}>{card.description}</Text>
                    </div>
                    <Switch
                      checked={visibleCards[key as keyof typeof visibleCards]}
                      onChange={(_, data) => handleCardToggle(key, data.checked)}
                    />
                  </div>
                ))}
              </DialogContent>
              <DialogActions>
                <Button appearance="secondary" onClick={() => setShowCustomizeModal(false)}>
                  Close
                </Button>
                <Button 
                  appearance="primary" 
                  onClick={() => {
                    setShowCustomizeModal(false);
                    // Optionally save to localStorage
                    localStorage.setItem('dashboardCards', JSON.stringify(visibleCards));
                  }}
                >
                  Save Changes
                </Button>
              </DialogActions>
            </DialogSurface>
          </Dialog>
          
          <Button 
            className={classes.filterButton}
            icon={<ArrowDownload20Regular />}
            appearance="subtle"
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>

      <div className={classes.insightsCard}>
        <div className={classes.insightsHeader}>
          <Lightbulb20Regular className={classes.insightIcon} />
          <Text className={classes.insightsTitle}>AI-Powered Insights</Text>
        </div>
        <div className={classes.insightsList}>
          {generateInsights().map((insight, index) => (
            <div key={index} className={classes.insightItem}>
              <ChevronUp20Regular className={classes.insightIcon} />
              <Text className={classes.insightText}>{insight}</Text>
            </div>
          ))}
        </div>
      </div>

      <div className={classes.statsGrid}>
        <Card className={classes.statCard}>
          <div className={classes.statNumber}>{totalTodos}</div>
          <div className={classes.statLabel}>Total Tasks</div>
        </Card>
        <Card className={classes.statCard}>
          <div className={classes.statNumber}>{completedTodos}</div>
          <div className={classes.statLabel}>Completed</div>
        </Card>
        <Card className={classes.statCard}>
          <div className={classes.statNumber}>{pendingTodos}</div>
          <div className={classes.statLabel}>Pending</div>
        </Card>
        <Card className={classes.statCard}>
          <div className={classes.statNumber}>{inProgressTodos}</div>
          <div className={classes.statLabel}>In Progress</div>
        </Card>
        <Card className={classes.statCard}>
          <div className={classes.statNumber}>{completionRate}%</div>
          <div className={classes.statLabel}>Completion Rate</div>
        </Card>
      </div>

      <div className={classes.todosSection}>
        <Text className={classes.title}>Tasks</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '16px' }}>
          <Card className={classes.todoColumn}>
            <div className={classes.todoColumnHeader}>
              <Text className={classes.todoColumnTitle}>Open Tasks</Text>
              <div className={classes.todoCount}>{openTodos.length}</div>
            </div>
            {openTodos.length === 0 ? (
              <div className={classes.emptyState}>No open tasks</div>
            ) : (
              <div className={expandedTasks.openTasks ? classes.todoListExpanded : classes.todoList}>
                {(expandedTasks.openTasks ? openTodos : openTodos.slice(0, 5)).map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}
            {openTodos.length > 5 && (
              <button 
                className={classes.showMoreButton}
                onClick={() => handleToggleExpandTasks('openTasks')}
              >
                {expandedTasks.openTasks ? `Show Less (${openTodos.length - 5} hidden)` : `Show More (${openTodos.length - 5} more)`}
              </button>
            )}
          </Card>

          <Card className={classes.todoColumn}>
            <div className={classes.todoColumnHeader}>
              <Text className={classes.todoColumnTitle}>Completed Tasks</Text>
              <div className={classes.todoCount}>{completedTodosList.length}</div>
            </div>
            {completedTodosList.length === 0 ? (
              <div className={classes.emptyState}>No completed tasks</div>
            ) : (
              <div className={expandedTasks.completedTasks ? classes.todoListExpanded : classes.todoList}>
                {(expandedTasks.completedTasks ? completedTodosList : completedTodosList.slice(0, 5)).map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}
            {completedTodosList.length > 5 && (
              <button 
                className={classes.showMoreButton}
                onClick={() => handleToggleExpandTasks('completedTasks')}
              >
                {expandedTasks.completedTasks ? `Show Less (${completedTodosList.length - 5} hidden)` : `Show More (${completedTodosList.length - 5} more)`}
              </button>
            )}
          </Card>

          <Card className={classes.todoColumn}>
            <div className={classes.todoColumnHeader}>
              <Text className={classes.todoColumnTitle}>Task Categories</Text>
              <div className={classes.todoCount}>{Object.keys(validTodos.reduce((acc, todo) => {
                const category = todo.category || 'General';
                acc[category] = true;
                return acc;
              }, {} as Record<string, boolean>)).length}</div>
            </div>
            <div style={{ padding: '16px 0' }}>
              {Object.entries(validTodos.reduce((acc, todo) => {
                const category = todo.category || 'General';
                acc[category] = (acc[category] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)).map(([category, count]) => (
                <div key={category} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #f3f2f1'
                }}>
                  <Text style={{ color: '#323130', fontWeight: '500' }}>{category}</Text>
                  <div style={{
                    backgroundColor: '#0078d4',
                    color: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className={classes.chartsGrid}>
        {visibleCards.taskStatusDistribution && (
          <Card className={classes.chartCard}>
            <CardHeader>
              <Text className={classes.chartTitle}>Task Status Distribution</Text>
            </CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#0f0f23"
                  strokeWidth={2}
                >
                  {chartData.statusData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1e3f', 
                    border: '1px solid #333366',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {visibleCards.priorityDistribution && (
          <Card className={classes.chartCard}>
            <CardHeader>
              <Text className={classes.chartTitle}>Priority Distribution</Text>
            </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.priorityData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(0, 120, 212, 0.8)" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="rgba(0, 120, 212, 0.3)" stopOpacity={0.6}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="1 3" stroke="rgba(0, 120, 212, 0.2)" strokeWidth={1} />
              <XAxis dataKey="name" tick={{ fill: '#605e5c', fontSize: 12 }} axisLine={{ stroke: 'rgba(0, 120, 212, 0.3)' }} />
              <YAxis tick={{ fill: '#605e5c', fontSize: 12 }} axisLine={{ stroke: 'rgba(0, 120, 212, 0.3)' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid rgba(0, 120, 212, 0.3)',
                  borderRadius: '8px',
                  color: '#323130',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0, 120, 212, 0.2)'
                }} 
              />
              <Bar 
                dataKey="value" 
                fill="url(#barGradient)" 
                radius={[6, 6, 0, 0]} 
                filter="url(#glow)"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        )}

        {visibleCards.categoryDistribution && (
          <Card className={classes.chartCard}>
            <CardHeader>
              <Text className={classes.chartTitle}>Category Distribution</Text>
            </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                <filter id="pieGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <Pie
                data={chartData.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth={1}
                filter="url(#pieGlow)"
              >
                {chartData.categoryData.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid rgba(0, 120, 212, 0.3)',
                  borderRadius: '8px',
                  color: '#323130',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0, 120, 212, 0.2)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        )}

        {visibleCards.taskCreationTrend && (
          <Card className={classes.chartCard}>
            <CardHeader>
              <Text className={classes.chartTitle}>Task Creation Trend (Last 7 Days)</Text>
            </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.trendData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(0, 120, 212, 0.8)" />
                  <stop offset="100%" stopColor="rgba(0, 183, 195, 0.8)" />
                </linearGradient>
                <filter id="lineGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="1 3" stroke="rgba(0, 120, 212, 0.2)" strokeWidth={1} />
              <XAxis dataKey="date" tick={{ fill: '#605e5c', fontSize: 12 }} axisLine={{ stroke: 'rgba(0, 120, 212, 0.3)' }} />
              <YAxis tick={{ fill: '#605e5c', fontSize: 12 }} axisLine={{ stroke: 'rgba(0, 120, 212, 0.3)' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid rgba(0, 120, 212, 0.3)',
                  borderRadius: '8px',
                  color: '#323130',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0, 120, 212, 0.2)'
                }} 
              />
              <Legend wrapperStyle={{ color: '#605e5c' }} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="url(#lineGradient)" 
                strokeWidth={3} 
                dot={{ fill: 'rgba(0, 120, 212, 0.8)', strokeWidth: 2, r: 4, filter: 'url(#lineGlow)' }}
                activeDot={{ r: 6, fill: 'rgba(0, 183, 195, 0.9)', strokeWidth: 2, stroke: '#ffffff' }}
                filter="url(#lineGlow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        )}

        {visibleCards.categoryPerformance && (
          <Card className={classes.chartCard}>
            <CardHeader>
              <Text className={classes.chartTitle}>Category Performance Ranking</Text>
            </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData.performanceData}>
              <CartesianGrid strokeDasharray="1 3" stroke="rgba(0, 120, 212, 0.2)" strokeWidth={1} />
              <XAxis dataKey="category" tick={{ fill: '#605e5c', fontSize: 12 }} axisLine={{ stroke: 'rgba(0, 120, 212, 0.3)' }} />
              <YAxis yAxisId="left" tick={{ fill: '#605e5c', fontSize: 12 }} axisLine={{ stroke: 'rgba(0, 120, 212, 0.3)' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#605e5c', fontSize: 12 }} axisLine={{ stroke: 'rgba(0, 120, 212, 0.3)' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid rgba(0, 120, 212, 0.3)',
                  borderRadius: '8px',
                  color: '#323130',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0, 120, 212, 0.2)'
                }} 
                formatter={(value, name) => {
                  if (name === 'rate') return [`${value}%`, 'Completion Rate'];
                  return [value, name];
                }} 
              />
              <Legend wrapperStyle={{ color: '#605e5c' }} />
              <Bar yAxisId="left" dataKey="completed" fill="rgba(16, 124, 16, 0.8)" name="Completed" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="remaining" fill="rgba(0, 183, 195, 0.8)" name="Remaining" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="rgba(209, 52, 56, 0.8)" strokeWidth={3} name="Completion Rate %" dot={{ fill: 'rgba(209, 52, 56, 0.8)', strokeWidth: 2, r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        )}

        {visibleCards.deadlineAnalysis && (
          <Card className={classes.chartCard}>
            <CardHeader>
              <Text className={classes.chartTitle}>Deadline Analysis</Text>
            </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.deadlineData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(0, 183, 195, 0.8)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="rgba(0, 183, 195, 0.1)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="1 3" stroke="rgba(0, 120, 212, 0.2)" strokeWidth={1} />
              <XAxis dataKey="category" tick={{ fill: '#605e5c', fontSize: 12 }} axisLine={{ stroke: 'rgba(0, 120, 212, 0.3)' }} />
              <YAxis tick={{ fill: '#605e5c', fontSize: 12 }} axisLine={{ stroke: 'rgba(0, 120, 212, 0.3)' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid rgba(0, 120, 212, 0.3)',
                  borderRadius: '8px',
                  color: '#323130',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0, 120, 212, 0.2)'
                }} 
                formatter={(value, name) => {
                  if (name === 'count') return [value, 'Tasks'];
                  return [value, name];
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stackId="1"
                stroke="rgba(0, 183, 195, 0.8)" 
                fill="url(#areaGradient)" 
                name="Tasks"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        )}

        {visibleCards.productivityRadar && (
          <Card className={classes.chartCard}>
            <CardHeader>
              <Text className={classes.chartTitle}>Productivity Radar</Text>
            </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={chartData.radarData}>
              <PolarGrid stroke="rgba(0, 120, 212, 0.3)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#605e5c', fontSize: 12 }} />
              <PolarRadiusAxis 
                tick={{ fill: '#605e5c', fontSize: 10 }} 
                tickCount={5}
                domain={[0, 100]}
              />
              <Radar
                name="Productivity Score"
                dataKey="value"
                stroke="rgba(0, 120, 212, 0.8)"
                fill="rgba(0, 120, 212, 0.2)"
                strokeWidth={3}
                dot={{ fill: 'rgba(0, 120, 212, 0.8)', strokeWidth: 2, r: 4 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        )}

        {visibleCards.upcomingReminders && (
          <Card className={classes.chartCard}>
            <CardHeader>
              <Text className={classes.chartTitle}>Upcoming Reminders</Text>
            </CardHeader>
          <div style={{ padding: '0px', maxHeight: '300px', overflowY: 'auto' }}>
            {[
              { id: '1', title: 'Team standup meeting', time: 'Today at 10:00 AM', priority: 'high', category: 'Work' },
              { id: '2', title: 'Doctor appointment', time: 'Tomorrow at 2:30 PM', priority: 'high', category: 'Health' },
              { id: '3', title: 'Call mom', time: 'Yesterday at 7:00 PM', priority: 'medium', category: 'Family' },
              { id: '4', title: 'Submit monthly report', time: 'Friday at 5:00 PM', priority: 'high', category: 'Work' },
              { id: '5', title: 'Dentist appointment', time: 'Next week at 9:00 AM', priority: 'medium', category: 'Health' },
            ].map((reminder, index) => (
              <div 
                key={reminder.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: index < 4 ? '1px solid #e1dfdd' : 'none',
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: reminder.priority === 'high' ? '#d13438' : 
                                   reminder.priority === 'medium' ? '#ff8c00' : '#107c10',
                }} />
                <div style={{ flex: 1 }}>
                  <Text style={{ fontSize: '14px', fontWeight: '500', color: '#323130', display: 'block' }}>
                    {reminder.title}
                  </Text>
                  <Text style={{ fontSize: '12px', color: '#605e5c' }}>
                    {reminder.time} • {reminder.category}
                  </Text>
                </div>
              </div>
            ))}
            <div style={{ padding: '12px 0', textAlign: 'center' }}>
              <Button 
                appearance="subtle" 
                onClick={() => window.location.href = '/reminders'}
                style={{ fontSize: '12px' }}
              >
                View All Reminders
              </Button>
            </div>
          </div>
        </Card>
        )}

        {visibleCards.recentActivity && (
          <Card className={classes.chartCard}>
            <CardHeader>
              <Text className={classes.chartTitle}>Recent Activity</Text>
            </CardHeader>
          <div style={{ padding: '0px', maxHeight: '300px', overflowY: 'auto' }}>
            {activityData.map((activity, index) => (
              <div key={index} className={classes.activityItem}>
                <Text className={classes.activityTime}>{activity.time}</Text>
                <Text className={classes.activityDescription}>{activity.description}</Text>
              </div>
            ))}
          </div>
        </Card>
        )}

        {visibleCards.activityHeatmap && (
          <Card className={classes.chartCard}>
            <CardHeader>
              <Text className={classes.chartTitle}>Activity Heatmap (Last 35 Days)</Text>
            </CardHeader>
            <div style={{ padding: '20px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: '3px',
                maxWidth: '350px'
              }}>
                {chartData.heatmapData?.map((day: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: day.intensity === 0 ? '#f3f2f1' : 
                        day.intensity < 0.3 ? 'rgba(0, 120, 212, 0.3)' :
                        day.intensity < 0.7 ? 'rgba(0, 120, 212, 0.6)' : 'rgba(0, 120, 212, 0.9)',
                      borderRadius: '2px',
                      border: '1px solid #e1dfdd',
                    }}
                    title={`${day.day}: ${day.value} tasks created`}
                  />
                ))}
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginTop: '16px',
                fontSize: '12px',
                color: '#605e5c'
              }}>
                <span>Less</span>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[0, 0.25, 0.5, 0.75, 1].map(intensity => (
                    <div
                      key={intensity}
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: intensity === 0 ? '#f3f2f1' : `rgba(0, 120, 212, ${intensity})`,
                        borderRadius: '2px',
                        border: '1px solid #e1dfdd',
                      }}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      <AddTodoDialog
        trigger={
          <Button
            appearance="primary"
            className={classes.fab}
            icon={<Add24Filled />}
            size="large"
          />
        }
      />
    </div>
  );
};

export default Dashboard;