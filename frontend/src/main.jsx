import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { MockNetworkProvider } from './contexts/MockNetworkContext'
import { GatewayProvider } from './contexts/GatewayContext'
import { I18nProvider } from './i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <I18nProvider>
        <GatewayProvider>
          <AuthProvider>
            <MockNetworkProvider>
              <App />
            </MockNetworkProvider>
          </AuthProvider>
        </GatewayProvider>
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
