import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CulturalEventCuration from './pages/CulturalEventCuration';
import RecommendationEvents from './pages/RecommendationEvents';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CulturalEventCuration />} />
        <Route path="/events/:type" element={<RecommendationEvents />} />
      </Routes>
    </Router>
  );
}

export default App;
