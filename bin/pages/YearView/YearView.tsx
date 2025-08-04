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
  startOfYear, 
  endOfYear, 
  eachMonthOfInterval,
  addYears, 
  subYears,
  parseISO,
  isSameMonth,
  isSameYear,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDaysInMonth,
} from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTodo } from '../../context/TodoContext';
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
  },
  yearNavigation: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  yearText: {
    fontSize: '24px',
    fontWeight: '600',
    minWidth: '100px',
    textAlign: 'center',
  },
  yearSummary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  summaryCard: {
    textAlign: 'center',
    ...shorthands.padding('20px'),
  },
  summaryNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0078d4',
    marginBottom: '8px',
  },
  summaryLabel: {
    fontSize: '14px',
    color: '#605e5c',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  chartsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  chartCard: {
    ...shorthands.padding('20px'),
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  monthsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  monthCard: {
    ...shorthands.padding('16px'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
  },
  monthHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  monthName: {
    fontSize: '18px',
    fontWeight: '600',
  },
  monthStats: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#605e5c',
  },
  completionBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#f3f2f1',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  completionFill: {
    height: '100%',
    backgroundColor: '#107c10',
    transition: 'width 0.3s ease',
  },
});

const COLORS = ['#0078d4', '#d13438', '#107c10', '#ff8c00', '#8764b8'];

const YearView: React.FC = () => {
  const classes = useStyles();
  const { state } = useTodo();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [yearData, setYearData] = useState<any>({
    monthlyData: [],
    categoryData: [],
    priorityData: [],
    completionTrend: [],
  });

  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 0, 1));
  const yearMonths = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  useEffect(() => {
    const processYearData = () => {
      const yearTodos = state.todos.filter(todo => {
        const todoDate = parseISO(todo.created_at);
        return isSameYear(todoDate, new Date(currentYear, 0, 1));
      });

      const monthlyData = yearMonths.map(month => {
        const monthTodos = yearTodos.filter(todo => {
          const todoDate = parseISO(todo.created_at);
          return isSameMonth(todoDate, month);
        });
        
        const completed = monthTodos.filter(todo => todo.status === 'completed').length;
        const total = monthTodos.length;
        
        return {
          month: format(month, 'MMM'),
          total,
          completed,
          pending: monthTodos.filter(todo => todo.status === 'pending').length,
          in_progress: monthTodos.filter(todo => todo.status === 'in_progress').length,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      });

      const categoryData = yearTodos.reduce((acc, todo) => {
        acc[todo.category] = (acc[todo.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const priorityData = yearTodos.reduce((acc, todo) => {
        acc[todo.priority] = (acc[todo.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const completionTrend = monthlyData.map(month => ({
        month: month.month,
        completionRate: month.completionRate,
      }));

      setYearData({
        monthlyData,
        categoryData: Object.entries(categoryData).map(([name, value]) => ({ name, value })),
        priorityData: Object.entries(priorityData).map(([name, value]) => ({ name, value })),
        completionTrend,
      });
    };

    if (state.todos.length > 0) {
      processYearData();
    }
  }, [state.todos, currentYear, yearMonths]);

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  const goToCurrentYear = () => {
    setCurrentYear(new Date().getFullYear());
  };

  const yearTodos = state.todos.filter(todo => {
    const todoDate = parseISO(todo.created_at);
    return isSameYear(todoDate, new Date(currentYear, 0, 1));
  });

  const totalTodos = yearTodos.length;
  const completedTodos = yearTodos.filter(todo => todo.status === 'completed').length;
  const yearCompletionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  
  const averageMonthlyTodos = Math.round(totalTodos / 12);
  const mostProductiveMonth = yearData.monthlyData.reduce((max: any, month: any) => 
    month.total > (max?.total || 0) ? month : max, null);

  const isCurrentYear = currentYear === new Date().getFullYear();

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text className={classes.title}>Year View</Text>
      </div>

      <div className={classes.controls}>
        <div className={classes.yearNavigation}>
          <Button
            appearance="subtle"
            icon={<ChevronLeft20Regular />}
            onClick={() => navigateYear('prev')}
          />
          <Text className={classes.yearText}>
            {currentYear}
          </Text>
          <Button
            appearance="subtle"
            icon={<ChevronRight20Regular />}
            onClick={() => navigateYear('next')}
          />
          {!isCurrentYear && (
            <Button appearance="outline" onClick={goToCurrentYear}>
              This Year
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

      <div className={classes.yearSummary}>
        <Card className={classes.summaryCard}>
          <div className={classes.summaryNumber}>{totalTodos}</div>
          <div className={classes.summaryLabel}>Total Tasks</div>
        </Card>
        <Card className={classes.summaryCard}>
          <div className={classes.summaryNumber}>{completedTodos}</div>
          <div className={classes.summaryLabel}>Completed</div>
        </Card>
        <Card className={classes.summaryCard}>
          <div className={classes.summaryNumber}>{yearCompletionRate}%</div>
          <div className={classes.summaryLabel}>Completion Rate</div>
        </Card>
        <Card className={classes.summaryCard}>
          <div className={classes.summaryNumber}>{averageMonthlyTodos}</div>
          <div className={classes.summaryLabel}>Avg Monthly Tasks</div>
        </Card>
        <Card className={classes.summaryCard}>
          <div className={classes.summaryNumber}>
            {mostProductiveMonth?.month || 'N/A'}
          </div>
          <div className={classes.summaryLabel}>Most Productive</div>
        </Card>
      </div>

      <div className={classes.chartsSection}>
        <Card className={classes.chartCard}>
          <Text className={classes.chartTitle}>Monthly Task Distribution</Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#107c10" name="Completed" />
              <Bar dataKey="in_progress" stackId="a" fill="#ff8c00" name="In Progress" />
              <Bar dataKey="pending" stackId="a" fill="#605e5c" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className={classes.chartCard}>
          <Text className={classes.chartTitle}>Completion Rate Trend</Text>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearData.completionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
              <Line 
                type="monotone" 
                dataKey="completionRate" 
                stroke="#0078d4" 
                strokeWidth={3}
                dot={{ fill: '#0078d4', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className={classes.chartCard}>
          <Text className={classes.chartTitle}>Category Distribution</Text>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={yearData.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {yearData.categoryData.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className={classes.chartCard}>
          <Text className={classes.chartTitle}>Priority Distribution</Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearData.priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0078d4" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className={classes.monthsGrid}>
        {yearData.monthlyData.map((monthData: any, index: number) => {
          const month = yearMonths[index];
          const completionPercentage = monthData.completionRate;
          
          return (
            <Card key={monthData.month} className={classes.monthCard}>
              <div className={classes.monthHeader}>
                <Text className={classes.monthName}>{monthData.month}</Text>
                <div className={classes.monthStats}>
                  <span>{monthData.completed}/{monthData.total} completed</span>
                </div>
              </div>
              
              <div className={classes.completionBar}>
                <div 
                  className={classes.completionFill}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              
              <div className={classes.monthStats}>
                <span>Pending: {monthData.pending}</span>
                <span>In Progress: {monthData.in_progress}</span>
                <span>Rate: {completionPercentage}%</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default YearView;