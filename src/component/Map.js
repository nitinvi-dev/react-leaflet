import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import locationIcon from "../contants/icon";
import parkIcon from "../contants/parkicon";

export default function Map() {
  const [currentPosition, setcurrentPosition] = useState(null);
  const [parkPosition, setparkPosition] = useState(null);

  function ParkMarker() {
    return parkPosition === null
      ? null
      : parkPosition.map((val, index) => (
          <Marker key={index} position={val[0]} icon={parkIcon}>
            <Popup>
              <div dangerouslySetInnerHTML={{ __html: val[1] }} />
            </Popup>
          </Marker>
        ));
  }

  const LocationMarker = () => {
    const map = useMap();
    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setcurrentPosition([e.latlng.lat, e.latlng.lng]);
      });
    });

    return currentPosition === null ? null : (
      <>
        <Marker position={currentPosition} icon={locationIcon}>
          <Popup>You are here</Popup>
        </Marker>
        <ParkMarker />
      </>
    );
  };

  const findParks = async (e) => {
    let headers = new Headers();

    headers.append("Content-Type", "application/json");

    const body = JSON.stringify({
      radius: e.target.value,
      lat: String(currentPosition[0]),
      lng: String(currentPosition[1]),
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: body,
    };

    fetch("https://react-leaflet-backend.vercel.app/api/nearbyparks", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setparkPosition(result.data);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <>
      <header className="App-header">
        <div className="start">Find parks</div>
        <div className="end">
          <select className="custom-select" onChange={findParks}>
            <option value="" hidden disabled selected>
              Please Select Radius
            </option>
            <option value="1000">1 KM</option>
            <option value="3000">3 KM</option>
            <option value="5000">5 KM</option>
          </select>
        </div>
      </header>

      <MapContainer
        center={[23.0208237, 72.5086395]}
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
