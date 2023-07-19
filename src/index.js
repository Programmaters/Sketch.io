import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Canvas from './Canvas'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Canvas />
  </React.StrictMode>
)

reportWebVitals()
