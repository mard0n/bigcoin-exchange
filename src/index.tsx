import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Login from './components/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Trade from './pages/Trade';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trade" element={<ProtectedRoute />}>
            <Route index element={<Trade />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
