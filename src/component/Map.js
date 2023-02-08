import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import locationIcon from "../contants/icon";
import parkIcon from "../contants/parkicon";
import park from "../contants/parks.json";


export default function Map() {

  const currentPosition = [23.0208237, 72.5086395];
  const [parkPostion, setparkPostion] = useState(park["1000"]);

  function ParkMarker() {    
    return (
      parkPostion.map((val, index) => (
        <Marker key={index} position={val[0]} icon={parkIcon}>
          <Popup>
          <div dangerouslySetInnerHTML={{__html: val[1]}} />
          </Popup>            
        </Marker>
      ))
    );
  }  

  const LocationMarker = () => {
    const map = useMap();
    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        map.flyTo(currentPosition, map.getZoom());      
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
    setparkPostion(park[e.target.value]);
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
        center={ [23.0208237, 72.5086395] }
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
