/* global kakao */
import React, { useEffect, useRef } from 'react';

const KakaoMap = ({ path, className }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao maps script not loaded.");
      return;
    }

    const container = mapContainer.current;
    const options = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // Default to Seoul
      level: 8,
    };
    const map = new kakao.maps.Map(container, options);

    if (path && path.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      const linePath = [];

      path.forEach((point, index) => {
        const latlng = new kakao.maps.LatLng(point.latitude, point.longitude);
        linePath.push(latlng);
        
        const marker = new kakao.maps.Marker({
          position: latlng,
          title: point.event_name,
        });
        marker.setMap(map);

        const content = `<div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background-color:#d9534f;color:white;font-size:14px;font-weight:bold;">${index + 1}</div>`;

        const customOverlay = new kakao.maps.CustomOverlay({
            position: latlng,
            content: content,
            yAnchor: 3, // Position the overlay above the marker
        });

        customOverlay.setMap(map);

        bounds.extend(latlng);
      });

      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#FF0000',
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
      });

      polyline.setMap(map);
      map.setBounds(bounds);
    }
  }, [path]);

  return (
    <div 
      id="map" 
      ref={mapContainer} 
      className={className}
      style={{ width: '100%', height: '400px' }}
    ></div>
  );
};

export default KakaoMap;
