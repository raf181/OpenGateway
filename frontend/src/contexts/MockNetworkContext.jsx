import { createContext, useContext, useState } from 'react';

const MockNetworkContext = createContext(null);

const defaultMockState = {
  claimed_phone: '+34600000003',
  network_phone: '+34600000003',
  network_lat: 40.4168,
  network_lon: -3.7038,
  sim_swap_recent: false,
  device_swap_recent: false,
};

export function MockNetworkProvider({ children }) {
  const [mockContext, setMockContext] = useState(defaultMockState);
  const [panelOpen, setPanelOpen] = useState(false);

  const updateMockContext = (updates) => {
    setMockContext(prev => ({ ...prev, ...updates }));
  };

  const resetMockContext = () => {
    setMockContext(defaultMockState);
  };

  return (
    <MockNetworkContext.Provider value={{ 
      mockContext, 
      updateMockContext, 
      resetMockContext,
      panelOpen,
      setPanelOpen 
    }}>
      {children}
    </MockNetworkContext.Provider>
  );
}

export function useMockNetwork() {
  const context = useContext(MockNetworkContext);
  if (!context) {
    throw new Error('useMockNetwork must be used within a MockNetworkProvider');
  }
  return context;
}
