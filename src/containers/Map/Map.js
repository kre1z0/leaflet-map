import React, { Component } from "react";
import fetchJsonp from "fetch-jsonp";
// https://react-leaflet.js.org/docs/en/context.html
import { Map as LeafletMap, TileLayer, Marker, ZoomControl } from "react-leaflet";
// https://leafletjs.com/reference-1.3.0.html
import Leaflet from "leaflet";

import { Error } from "../../components/Error/Error";
import { FilteringControlBlock } from "../../components/FilteringControlBlock/FilteringControlBlock";
import { Legend } from "../../components/Legend/Legend";
import { Popup } from "../../components/Popup/Popup";
import Yarmarka from "../../assets/icons/Yarmarka.svg";
import YarmarkaSelected from "../../assets/icons/Yarmarka_selected.svg";
import cn from "classnames";
import { fetchFilters, fetchCities, fetchFeatures } from "../../utils/api";
import testFeatures from "../../assets/test-data/features";

import styles from "./Map.scss";

const apiUrl = "https://msp.everpoint.ru/";

const getIcon = selected => {
  const iconWidth = 40;
  const iconHeight = 49.6;

  // return new Leaflet.divIcon({
  //   html: `<span>4</span>`,
  //   iconSize: new Leaflet.Point(40, 40),
  //   className: styles.leafletClusterIcon,
  // });

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
    filters: [],
    selectedFilters: null,
    selectedCity: {
      id: 13,
      name: "Москва",
    },
    cities: [],
    error: false,
  };

  selectedMarker = null;
  leafletMap = null;

  componentDidMount() {
    const { selectedCity } = this.state;
    this.fetchData().then(data => {
      this.setState({
        features: data.features.features.slice(0, 444),
      });
    });
    fetchFilters({ city: selectedCity.id }).then(({ data }) => {
      this.setState({
        filters: data,
      });
    });
    fetchCities().then(({ data }) => {
      this.setState({
        cities: data.features,
      });
    });
    fetchFeatures({ city: selectedCity.id })
      .then(({ data }) => {
        console.info("--> fetchFeatures", data);
      })
      .catch(error => this.setState({ error: true }));
  }

  componentDidCatch(error) {
    console.info("--> componentDidCatch", error);
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

  onFilterChange = filter => value => {
    const { selectedFilters } = this.state;

    this.setState({
      selectedFilters: {
        ...selectedFilters,
        [filter.name]: value,
      },
    });
  };

  onCityChange = id => {
    const { cities } = this.state;

    const selectedCity = cities.find(item => item.id === id);

    if (selectedCity) {
      this.setState({ selectedCity: { id, name: selectedCity.properties.name } });
    } else {
      this.setState({ selectedCity: this.state.selectedCity });
    }
  };

  onFilterSubmit = () => {};

  render() {
    const position = [this.state.lat, this.state.lng];
    const { features, filters, selectedFilters, cities, selectedCity, error } = this.state;
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
        {error && <Error text="Произошла ошибка" />}
        <FilteringControlBlock
          selectedCity={selectedCity}
          cities={cities}
          filters={filters}
          onCityChange={this.onCityChange}
          onFilterChange={this.onFilterChange}
          onFilterSubmit={this.onFilterSubmit}
          selectedFilters={selectedFilters}
        />
        <Legend features={testFeatures} />
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
              <Popup properties={properties} onClose={this.onPopupClose} />
            </Marker>
          ))}
      </LeafletMap>
    );
  }
}
