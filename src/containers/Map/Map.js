import React, { Component } from "react";
import fetchJsonp from "fetch-jsonp";
import { Map as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";
import Leaflet from "leaflet";
// https://github.com/YUzhva/react-leaflet-markercluster
// https://github.com/Leaflet/Leaflet.markercluster#all-options
import MarkerClusterGroup from "react-leaflet-markercluster";

import Yarmarka from "../../assets/icons/Yarmarka.svg";
import { data } from "../../assets/data/data";
import cn from "classnames";

import styles from "./Map.scss";

const apiUrl = "https://msp.everpoint.ru/";

const iconPerson = new Leaflet.Icon({
  iconUrl: Yarmarka,
  iconSize: new Leaflet.Point(50, 65),
  className: "leaflet-div-icon",
});

export class Map extends Component {
  state = {
    lat: 51.505,
    lng: 52,
    zoom: 5,
    features: [],
  };

  componentDidMount() {
    console.log("--> componentDidMount <--");
    this.fetchData().then(data => {
      this.setState({
        features: data.features.features,
      });
      console.info("--> data ggwp", data);
    });
  }

  fetchData() {
    return fetchJsonp(`${apiUrl}static/fair.jsonp`, {
      jsonpCallbackFunction: "callback",
    })
      .then(res => res.json())
      .then(json => json)
      .catch(error => {
        console.info("--> error", error);
      });
  }

  ggwp = e => {
    console.info("--> onMarkerClick e", e);
  };

  render() {
    const position = [this.state.lat, this.state.lng];
    const { features } = this.state;
    const zoomNew = this.state.zoom ? this.state.zoom : 13;

    return (
      <LeafletMap
        key="map"
        zoom={zoomNew}
        center={position}
        minZoom={4}
        maxZoom={18}
        zoomControl={false}
        className={cn(
          "leaflet-container leaflet-fade-anim step15 ",
          styles.map,
        )}
      >
        <TileLayer
          subdomains={[0, 1, 2, 3]}
          attribution="Данные предоставлены &copy; <a target=&quot;_blank&quot; href=&quot;http://2gis.ru&quot;>2GIS</a>"
          url="https://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1&layerType=nc"
        />
        <MarkerClusterGroup
          onClusterClick={this.ggwp}
          zoomToBoundsOnClick={false}
        >
          {features.map(({ id, geometry: { coordinates } }) => (
            <Marker
              key={id}
              icon={iconPerson}
              position={[coordinates[1], coordinates[0]]}
            >
              <Popup>
                <div>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </LeafletMap>
    );
  }
}
