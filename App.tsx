import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import FilterBar from './components/FilterBar';
import GradeTable from './components/GradeTable';
import { ViewFilter } from './types';

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden font-sans">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      
      {/* Updated margin-left to lg:ml-72 to match new sidebar width */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-72">
        <TopHeader toggleSidebar={toggleSidebar} />
        
        <div className="flex flex-col h-full overflow-hidden p-4 md:p-6">
          <FilterBar viewFilter={viewFilter} setViewFilter={setViewFilter} />
          <GradeTable viewFilter={viewFilter} />
        </div>
      </main>
    </div>
  );
};

export default App;