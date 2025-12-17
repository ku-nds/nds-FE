/* global kakao */
import React, { useEffect, useRef } from 'react';

const KakaoMap = ({ path, className, center, amenities, eventMarker }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao maps script not loaded.");
      return;
    }

    try {
      const container = mapContainer.current;
      const createdOverlays = [];
      const options = {
        center: center ? new kakao.maps.LatLng(center.lat, center.lng) : new kakao.maps.LatLng(37.566826, 126.9786567), // Default to Seoul
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
          createdOverlays.push(marker);

          const content = `<div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background-color:#d9534f;color:white;font-size:14px;font-weight:bold;">${index + 1}</div>`;

          const customOverlay = new kakao.maps.CustomOverlay({
              position: latlng,
              content: content,
              yAnchor: 3, // Position the overlay above the marker
          });

          customOverlay.setMap(map);
          createdOverlays.push(customOverlay);

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
        createdOverlays.push(polyline);
        map.setBounds(bounds);
      }
      // Render event marker if provided
      if (eventMarker && eventMarker.lat && eventMarker.lng) {
        const pos = new kakao.maps.LatLng(eventMarker.lat, eventMarker.lng);
        const marker = new kakao.maps.Marker({ position: pos, title: eventMarker.title || '행사 위치' });
        marker.setMap(map);
        createdOverlays.push(marker);
      }

      // Render amenities if provided
      if (amenities && typeof amenities === 'object') {
        const createAmenityMarker = (item, type) => {
          try {
            const lat = parseFloat(item.y || item.latitude || item.lat);
            const lng = parseFloat(item.x || item.longitude || item.lng);
            if (Number.isNaN(lat) || Number.isNaN(lng)) return;
            const position = new kakao.maps.LatLng(lat, lng);

            const color = type === 'subway' ? '#007bff' : type === 'restaurant' ? '#28a745' : '#6c757d';
            const content = `<div style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background-color:${color};color:white;font-size:12px;">${(type[0] || '').toUpperCase()}</div>`;

            const marker = new kakao.maps.CustomOverlay({ position, content, yAnchor: 0.5 });
            marker.setMap(map);
            createdOverlays.push(marker);

            const infoContent = `<div style="padding:6px 8px;max-width:220px;font-size:13px;"><strong>${item.place_name || ''}</strong><div style="font-size:12px;color:#666">거리: ${item.distance || ''}m</div></div>`;
            const infoOverlay = new kakao.maps.CustomOverlay({ content: infoContent, position, yAnchor: 1.2 });
            createdOverlays.push(infoOverlay);

            // attach listener to the overlay instance itself instead of marker.getContent()
            kakao.maps.event.addListener(marker, 'click', () => {
              infoOverlay.setMap(map);
            });
          } catch (err) {
            console.error('Error creating amenity marker', err, item);
          }
        };

        ['subway', 'restaurant', 'parking'].forEach((type) => {
          const list = amenities[type] || [];
          list.forEach(item => createAmenityMarker(item, type));
        });
      }

      // cleanup created overlays when effect re-runs or unmounts
      return () => {
        createdOverlays.forEach(o => {
          try { if (o && typeof o.setMap === 'function') o.setMap(null); } catch(e) { /* ignore */ }
        });
      };
    } catch (err) {
      console.error('KakaoMap init error', err);
    }
  }, [path, center, amenities, eventMarker]);

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
