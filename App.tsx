import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import FilterBar from './components/FilterBar';
import GradeTable from './components/GradeTable';
import PeriodicReviewTable from './components/PeriodicReviewTable';
import { ViewFilter } from './types';

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [term, setTerm] = useState<string>('Cuối năm');
  const [activePage, setActivePage] = useState<string>('class_manager');

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden font-sans">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        activePage={activePage}
        setActivePage={setActivePage}
      />
      
      {/* Updated margin-left to be dynamic based on sidebar state */}
      <main 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-72'
        }`}
      >
        <TopHeader toggleSidebar={toggleSidebar} />
        
        <div className="flex flex-col h-full overflow-hidden p-4 md:p-6">
          {activePage === 'class_manager' ? (
            <>
              <FilterBar 
                viewFilter={viewFilter} 
                setViewFilter={setViewFilter} 
                term={term}
                setTerm={setTerm}
              />
              <GradeTable viewFilter={viewFilter} term={term} />
            </>
          ) : activePage === 'periodic_review' ? (
             <PeriodicReviewTable />
          ) : (
             <div className="flex items-center justify-center h-full text-gray-400">
               Tính năng đang phát triển
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;