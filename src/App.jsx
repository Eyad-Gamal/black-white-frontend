import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

const Storefront = lazy(() => import('./pages/Storefront'));

const App = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Storefront />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
