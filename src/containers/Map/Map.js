import React, { Component } from "react";
import fetchJsonp from "fetch-jsonp";
// https://react-leaflet.js.org/docs/en/context.html
import { Map as LeafletMap, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
// https://leafletjs.com/reference-1.3.0.html
import Leaflet from "leaflet";

import Yarmarka from "../../assets/icons/Yarmarka.svg";
import YarmarkaSelected from "../../assets/icons/Yarmarka_selected.svg";
import cn from "classnames";

import styles from "./Map.scss";

const apiUrl = "https://msp.everpoint.ru/";

const getIcon = selected => {
  const iconWidth = 40;
  const iconHeight = 49.6;

  return new Leaflet.Icon({
    iconUrl: selected ? YarmarkaSelected : Yarmarka,
    iconSize: new Leaflet.Point(iconWidth, iconHeight),
    className: "leaflet-div-icon",
    iconAnchor: [iconWidth / 2, iconHeight],
  });
};

export class Map extends Component {
  state = {
    lat: 51.505,
    lng: 52,
    zoom: 5,
    features: [],
  };

  selectedMarker = null;

  componentDidMount() {
    this.fetchData().then(data => {
      this.setState({
        features: data.features.features.slice(0, 444),
      });
    });
  }

  fetchData() {
    return fetchJsonp(`${apiUrl}static/fair.jsonp`, {
      timeout: 30000,
      jsonpCallbackFunction: "callback",
    })
      .then(res => res.json())
      .then(json => json)
      .catch(error => {
        console.info("--> error", error);
      });
  }

  onPopupClose = () => {
    console.info("--> onPopupClose");
    if (this.selectedMarker) {
      this.selectedMarker.setIcon(getIcon());
      this.selectedMarker = null;
    }
  };

  onLeafletMapRef = ref => {
    this.leafletMap = ref;
  };

  onZoomEnd = () => {
    // const featuresInView = this.getFeaturesInView();
    //
    // if (featuresInView.length < 300) {
    //   this.setState({
    //     clusterization: false,
    //   });
    // } else {
    //   this.setState({
    //     clusterization: true,
    //   });
    // }
  };

  onMarkerClick = e => {
    const marker = e.sourceTarget;

    if (this.selectedMarker) {
      this.selectedMarker.setIcon(getIcon());
    }
    marker.setIcon(getIcon(true));
    this.selectedMarker = marker;
  };

  render() {
    const position = [this.state.lat, this.state.lng];
    const { features } = this.state;
    const zoomNew = this.state.zoom ? this.state.zoom : 13;

    return (
      <LeafletMap
        onZoomEnd={this.onZoomEnd}
        key="map"
        ref={this.onLeafletMapRef}
        zoom={zoomNew}
        center={position}
        minZoom={4}
        maxZoom={18}
        zoomControl={false}
        className={cn("leaflet-container", styles.map)}
      >
        <ZoomControl position="topright" />
        <TileLayer
          subdomains={[0, 1, 2, 3]}
          attribution="Данные предоставлены &copy; <a target=&quot;_blank&quot; href=&quot;http://2gis.ru&quot;>2GIS</a>"
          url="https://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1&layerType=nc"
        />
        {features &&
          features.map(({ id, geometry: { coordinates }, properties }) => (
            <Marker
              properties={properties}
              key={id}
              icon={getIcon()}
              position={[coordinates[1], coordinates[0]]}
              onClick={this.onMarkerClick}
            >
              <Popup maxWidth={444} maxHeight={444} onClose={this.onPopupClose}>
                <div>
                  {properties.address}
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse fugiat labore
                  molestiae neque officia omnis quas. Ea ex iusto ratione. Architecto ipsam nesciunt
                  nobis numquam sunt temporibus veniam, veritatis voluptate!
                  <div className={styles.footer}>
                    <button onClick={this.changePopupContent}>ggwp</button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </LeafletMap>
    );
  }
}
