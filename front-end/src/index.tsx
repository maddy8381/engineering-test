import 'index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import * as serviceWorker from 'shared/helpers/service-worker';
import { GlobalStyle } from 'shared/styles/global-style';
import StaffApp from 'staff-app/app';

const Home: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <p>Engineering Test</p>
        <Link to="staff/daily-care">Staff</Link>
      </header>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home>Engineering Test</Home>} />
        <Route path="staff/*" element={<StaffApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
)

serviceWorker.register()
