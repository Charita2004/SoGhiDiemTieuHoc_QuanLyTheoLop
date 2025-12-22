import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import FilterBar from './components/FilterBar';
import GradeTable from './components/GradeTable';
import PeriodicReviewTable from './components/PeriodicReviewTable';
import { ViewFilter } from './types';

const App: React.FC = () => {
  // Initialize collapsed state based on screen width
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default to collapsed to avoid flash
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [term, setTerm] = useState<string>('Cuối năm');
  const [activePage, setActivePage] = useState<string>('class_manager');
  const [selectedClass, setSelectedClass] = useState<string>('1A2');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // On mount, check width. If desktop, open sidebar.
    if (window.innerWidth >= 1024) {
      setIsSidebarCollapsed(false);
    }
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Prevent hydration mismatch or layout shift visualization if needed, 
  // though simple client-side rendering is fine here.
  if (!isMounted) return null; 

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden font-sans">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        activePage={activePage}
        setActivePage={setActivePage}
      />
      
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
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
              />
              <GradeTable viewFilter={viewFilter} term={term} selectedClass={selectedClass} />
            </>
          ) : activePage === 'periodic_review' ? (
             <PeriodicReviewTable selectedClass={selectedClass} />
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