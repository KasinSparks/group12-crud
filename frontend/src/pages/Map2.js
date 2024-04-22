import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '95vw',
  height: '80vh',
};
const center = {
  lat: 41.603221, // default latitude
  lng: -73.087749, // default longitude
};



export default function Map2() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAyFEVcVEl0oW0USK0d7kuNfQNuGn4k6Q0',
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className='Map2'>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};
