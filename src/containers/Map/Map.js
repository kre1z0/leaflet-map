import React, { Component } from "react";
// https://leafletjs.com/reference-1.3.0.html
// https://react-leaflet.js.org/docs/en/context.html
import { Map as LeafletMap, TileLayer, Marker, ZoomControl } from "react-leaflet";

import cn from "classnames";

import { Error } from "../../components/Error/Error";
import { FilteringControlBlock } from "../../components/FilteringControlBlock/FilteringControlBlock";
import { Legend } from "../../components/Legend/Legend";
import { Popup } from "../../components/Popup/Popup";
import { getIcon } from "../../components/Markers/Markers";
import { fetchFilters, fetchCities, fetchFeatures } from "../../utils/api";

import styles from "./Map.scss";

export class Map extends Component {
  state = {
    lat: 51.505,
    lng: 52,
    zoom: 5,
    features: [],
    clusters: [],
    featureStyles: [],
    filters: [],
    selectedFilters: null,
    selectedCity: {
      id: 13,
      name: "Москва",
    },
    cities: [],
    error: false,
  };

  leafletMap = null;

  componentDidMount() {
    const { selectedCity } = this.state;
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
        this.setState({
          features: data.features.features,
          featureStyles: data.styles,
          clusters: data.clusters.features,
        });
        console.info("--> fetchFeatures", data);
      })
      .catch(error => this.setState({ error: true }));
  }

  componentDidCatch(error) {
    console.info("--> componentDidCatch", error);
  }

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
    const {
      features,
      clusters,
      featureStyles,
      filters,
      selectedFilters,
      cities,
      selectedCity,
      error,
    } = this.state;
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
        <Legend featureStyles={featureStyles} />
        <ZoomControl position="topright" />
        <TileLayer
          subdomains={[0, 1, 2, 3]}
          attribution="Данные предоставлены &copy; <a target=&quot;_blank&quot; href=&quot;http://2gis.ru&quot;>2GIS</a>"
          url="https://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1&layerType=nc"
        />
        {features.map(({ id, geometry: { coordinates }, properties }) => (
          <Marker
            properties={properties}
            key={id}
            icon={getIcon({
              properties,
              featureStyles,
            })}
            position={[coordinates[1], coordinates[0]]}
          >
            <Popup id={id} properties={properties} />
          </Marker>
        ))}
        {clusters.map(({ id, geometry: { coordinates }, properties }) => (
          <Marker
            key={id}
            icon={getIcon({
              cluster: true,
              properties,
              featureStyles,
            })}
            position={[coordinates[1], coordinates[0]]}
          />
        ))}
      </LeafletMap>
    );
  }
}
