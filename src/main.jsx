import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// localStorage shim matching the window.storage async API
if (!window.storage) {
  window.storage = {
    async get(key) { const v = localStorage.getItem('op::' + key); if (v === null) throw new Error('not found'); return { key, value: v }; },
    async set(key, value) { localStorage.setItem('op::' + key, value); return { key, value }; },
    async delete(key) { localStorage.removeItem('op::' + key); return { key, deleted: true }; },
    async list() { return { keys: Object.keys(localStorage).filter(k => k.startsWith('op::')).map(k => k.slice(4)) }; },
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
