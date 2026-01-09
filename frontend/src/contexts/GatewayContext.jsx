import { createContext, useContext, useState, useEffect } from 'react';

const GatewayContext = createContext(null);

const defaultStatus = {
  mode: 'loading',
  base_url: '',
  has_credentials: false,
  available_apis: [],
};

export function GatewayProvider({ children }) {
  const [status, setStatus] = useState(defaultStatus);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGatewayStatus();
  }, []);

  const fetchGatewayStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/opengateway/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setError(null);
      } else {
        // API not available, assume mock mode
        setStatus({
          mode: 'mock',
          base_url: '',
          has_credentials: false,
          available_apis: [],
        });
      }
    } catch (err) {
      console.warn('Failed to fetch gateway status:', err);
      setStatus({
        mode: 'mock',
        base_url: '',
        has_credentials: false,
        available_apis: [],
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isRealApi = status.mode === 'sandbox' || status.mode === 'production';
  const isMockMode = status.mode === 'mock';

  return (
    <GatewayContext.Provider value={{ 
      status, 
      loading, 
      error, 
      isRealApi, 
      isMockMode,
      refreshStatus: fetchGatewayStatus 
    }}>
      {children}
    </GatewayContext.Provider>
  );
}

export function useGateway() {
  const context = useContext(GatewayContext);
  if (!context) {
    throw new Error('useGateway must be used within a GatewayProvider');
  }
  return context;
}
