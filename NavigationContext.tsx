
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

interface NavigationContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearchQuery: string;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  incrementInteraction: () => void;
  showSupportPopup: boolean;
  closeSupportPopup: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Random threshold between 4 and 10 interactions before showing popup
  const thresholdRef = useRef(Math.floor(Math.random() * 7) + 4);
  const hasShownRef = useRef(false);

  // Debounce Search Logic (1 second delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Interaction Tracking
  const incrementInteraction = () => {
    if (hasShownRef.current) return;
    
    setInteractionCount(prev => {
      const newVal = prev + 1;
      if (newVal >= thresholdRef.current) {
        setShowSupportPopup(true);
        hasShownRef.current = true;
      }
      return newVal;
    });
  };

  const closeSupportPopup = () => {
    setShowSupportPopup(false);
  };

  return (
    <NavigationContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      debouncedSearchQuery,
      activeId, 
      setActiveId,
      incrementInteraction,
      showSupportPopup,
      closeSupportPopup,
      isMobileMenuOpen,
      setIsMobileMenuOpen
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
