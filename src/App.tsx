import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import DayView from './pages/DayView/DayView';
import WeekView from './pages/WeekView/WeekView';
import MonthView from './pages/MonthView/MonthView';
import YearView from './pages/YearView/YearView';
import BrainstormView from './pages/BrainstormView/BrainstormView';
import KanbanView from './pages/KanbanView/KanbanView';
import NotesView from './pages/NotesView/NotesView';
import RemindersView from './pages/RemindersView/RemindersView';
import { TodoProvider } from './context/TodoContext';
import { NotesProvider } from './context/NotesContext';
import { RemindersProvider } from './context/RemindersContext';

const App: React.FC = () => {
  return (
    <TodoProvider>
      <NotesProvider>
        <RemindersProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/day" element={<DayView />} />
              <Route path="/week" element={<WeekView />} />
              <Route path="/month" element={<MonthView />} />
              <Route path="/year" element={<YearView />} />
              <Route path="/brainstorm" element={<BrainstormView />} />
              <Route path="/kanban" element={<KanbanView />} />
              <Route path="/notes" element={<NotesView />} />
              <Route path="/reminders" element={<RemindersView />} />
            </Routes>
          </Layout>
        </RemindersProvider>
      </NotesProvider>
    </TodoProvider>
  );
};

export default App;