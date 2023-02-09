import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import locationIcon from "../contants/icon";
import parkIcon from "../contants/parkicon";
import park from "../contants/parks.json";
import L from "leaflet";

export default function Map() {

  const [positions, setPosition] = useState(park["1000"]);

  const [currentPosition, setCurrentPosition] = useState(['33.8670522', '151.1957362']);

  function ParkMarker() {    
    return (
      positions.map((val, index) => (
        <Marker key={index} position={val[0]} icon={parkIcon}>
          <Popup>
          <div dangerouslySetInnerHTML={{__html: val[1]}} />
          </Popup>            
        </Marker>
      ))
    );
  }  

  function LocationMarker() {    
    const [box, setBbox] = useState([]);

    const map = useMap();

    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setCurrentPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        const radius = e.accuracy;
        const circle = L.circle(e.latlng, radius);
        circle.addTo(map);
        setBbox(e.bounds.toBBoxString().split(","));
      });
    }, [map]);

    return currentPosition === null ? null : (
      <>
        <Marker position={currentPosition} icon={locationIcon}>
          <Popup>
            You are here
          </Popup>
        </Marker>
        <ParkMarker />
      </>
    );
  }

  const findParks = async (e) => {
    try {
      const radius = e.target.value;
      const lat = currentPosition.lat;
      const lng = currentPosition.lng;
      const baseUrl = `https://react-leaflet-backend.vercel.app/api/nearbyparks/`;

      const response = await fetch(baseUrl, {
        method: 'POST',
        data: {
          'radius': radius,
          'lat': lat,
          'lng': lng
        },
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': 'application/json'
        }
      }).then(res => {
        return res.json();
      });
      console.log('response', response.data);
      setPosition(response.data);
    } catch (error) {
      console.log('=======error', error);
      setPosition(park[e.target.value]);
    }
  };

  return (
    <>
      <header className="App-header">
        <div className="start">Find parks</div>
        <div className="end">
          <select className="custom-select" onChange={findParks}>
            <option value="1000">1 KM</option>
            <option value="5000">5 KM</option>
            <option value="10000">10 KM</option>
          </select>
        </div>
      </header>

      <MapContainer
        center={ currentPosition }
        zoom={13}
        scrollWheelZoom
        style={{ height: "100vh" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </>
  );
}
