import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app/App.tsx'
import Frame from './components/center-frame/CenterFrame.tsx'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Frame>
      <App/>
    </Frame>
  </React.StrictMode>,
)
