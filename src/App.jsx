import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ErrorBoundary fallbackTitle="Ứng dụng gặp sự cố" fallbackMessage="Đã xảy ra lỗi không mong muốn. Vui lòng tải lại trang.">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={
            <ErrorBoundary fallbackTitle="Lỗi Dashboard" fallbackMessage="Không thể tải Dashboard.">
              <Dashboard />
            </ErrorBoundary>
          } />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
