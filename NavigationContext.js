import { React, html } from './runtime.js';

const NavigationContext = React.createContext(undefined);

export const NavigationProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState('');
  const [activeId, setActiveId] = React.useState(null);
  const [interactionCount, setInteractionCount] = React.useState(0);
  const [showSupportPopup, setShowSupportPopup] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const thresholdRef = React.useRef(Math.floor(Math.random() * 7) + 4);
  const hasShownRef = React.useRef(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  return html`<${NavigationContext.Provider}
    value=${{
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
    }}
  >
    ${children}
  <//>`;
};

export const useNavigation = () => {
  const context = React.useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
