import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { MockNetworkProvider } from './contexts/MockNetworkContext'
import { GatewayProvider } from './contexts/GatewayContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GatewayProvider>
        <AuthProvider>
          <MockNetworkProvider>
            <App />
          </MockNetworkProvider>
        </AuthProvider>
      </GatewayProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
