import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CulturalEventCuration from './pages/CulturalEventCuration';
import RecommendationEvents from './pages/PlaceEvents';
import LocationEvents from './pages/LocationEvents';
import CategoryEvents from './pages/CategoryEvents';
import './App.css';
import { AppProvider } from './context/AppContext';

import ShortestPathPage from './pages/ShortestPathPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CulturalEventCuration />} />
          <Route path="/events/place-type" element={<RecommendationEvents />} />
          <Route path="/events/location" element={<LocationEvents />} />
          <Route path="/events/category" element={<CategoryEvents />} />
          <Route path="/events/shortest-path" element={<ShortestPathPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
