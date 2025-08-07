import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UnderwritingPage from './pages/UnderwritingPage';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/underwriting/:propertyId" element={<UnderwritingPage />} />
      </Routes>
    </Layout>
  );
}

export default App;