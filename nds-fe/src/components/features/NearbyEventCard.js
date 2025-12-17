import React from 'react';

const NearbyEventCard = ({ event, onCardClick }) => (
  <div className="event-card border rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-200 cursor-pointer overflow-hidden"
    onClick={() => onCardClick(event)}>
    <div className="relative h-40">
      <img src={event.main_image || "https://via.placeholder.com/600x400.png?text=No+Image"} alt={event.event_name} className="w-full h-full object-cover" />
      {event.distance && (
        <span className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs font-semibold px-2 py-0.5 rounded">
          {event.distance}km
        </span>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold">{event.event_name}</h3>
      <p className="text-xs text-gray-700">{event.place}</p>
    </div>
  </div>
);

export default NearbyEventCard;
