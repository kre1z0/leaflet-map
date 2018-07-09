import React, { Component } from "react";
// https://leafletjs.com/reference-1.3.0.html
import Leaflet from "leaflet";
// https://react-leaflet.js.org/docs/en/context.html
import { Map as LeafletMap, TileLayer, Marker, ZoomControl } from "react-leaflet";
import debounce from "lodash/debounce";

import cn from "classnames";

import { Error } from "../../components/Error/Error";
import { FilteringControlBlock } from "../../components/FilteringControlBlock/FilteringControlBlock";
import { Legend } from "../../components/Legend/Legend";
import { Popup } from "../../components/Popup/Popup";
import { getIcon } from "../../components/Markers/Markers";
import { fetchFilters, fetchCities, fetchFeatures } from "../../utils/api";

import styles from "./Map.scss";

export class Map extends Component {
  constructor() {
    super();
    // Debounce
    this.getFeatures = debounce(this.getFeatures, 300);
  }
  state = {
    center: [55.753215, 37.622504],
    bounds: [[55.1422, 36.803101], [56.021223, 37.967427]],
    zoom: 16,
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
    fetchFilters({ city: selectedCity.id })
      .then(({ data }) => {
        const selectedFilters = {};
        data.forEach(({ name, value }) => (selectedFilters[name] = value));
        this.setState(
          {
            error: false,
            filters: data,
            selectedFilters,
          },
          this.getFeatures(),
        );
      })
      .catch(error => this.setState({ error: true }));
    fetchCities()
      .then(({ data }) => {
        this.GGWPNORE(data.features, selectedCity.id);
        this.setState({
          cities: data.features,
        });
      })
      .catch(error => this.setState({ error: true }));
  }

  componentDidCatch(error) {
    this.setState({
      error: true,
    });
  }

  GGWPNORE = (cities, selectedCityId) => {
    const city = cities.find(item => item.id === selectedCityId);
    const centerCoordinates = city.properties.center.coordinates;
    const bbox = city.bbox;

    this.setState({
      center: [centerCoordinates[1], centerCoordinates[0]],
      bounds: [[bbox[1], bbox[0]], [bbox[3], bbox[2]]],
    });
  };

  onLeafletMapRef = ref => {
    this.leafletMap = ref;
  };

  getFeatures = () => {
    const {
      selectedCity: { id },
      filters,
    } = this.state;

    const selectedFilters = {};
    filters.forEach(({ name, value }) => (selectedFilters[name] = value));

    const precision = 6;
    const map = this.leafletMap.leafletElement;
    const bb = map.getBounds();
    const sw = bb.getSouthWest();
    const ne = bb.getNorthEast();

    const bbox = [
      [parseFloat(sw.lat.toFixed(precision)), parseFloat(sw.lng.toFixed(precision))],
      [parseFloat(ne.lat.toFixed(precision)), parseFloat(ne.lng.toFixed(precision))],
    ];

    const geometryTemplate =
      "POLYGON(({lon1} {lat1}, {lon1} {lat2}, {lon2} {lat2}, {lon2} {lat1}, {lon1} {lat1}))";

    const geom = Leaflet.Util.template(geometryTemplate, {
      lat1: bbox[0][0],
      lon1: bbox[0][1],
      lat2: bbox[1][0],
      lon2: bbox[1][1],
    });
    const zoom = map.getZoom();

    const params = {
      ...selectedFilters,
      city: id,
      geom,
      zoom,
    };

    fetchFeatures(params)
      .then(({ data }) => {
        this.setState({
          error: false,
          features: data.features ? data.features.features : [],
          featureStyles: data.styles ? data.styles : [],
          clusters: data.clusters ? data.clusters.features : [],
        });
      })
      .catch(error => this.setState({ error: true }));
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
      this.setState(
        { selectedCity: { id, name: selectedCity.properties.name } },
        this.GGWPNORE(cities, id),
      );
    } else {
      this.setState({ selectedCity: this.state.selectedCity });
    }
  };

  onFilterSubmit = () => {
    const { filters, selectedFilters } = this.state;

    if (selectedFilters) {
      const copyFilters = filters.slice();
      Object.keys(selectedFilters).forEach(item => {
        const filter = copyFilters.find(({ name }) => name === item);
        filter.value = selectedFilters[item];
      });
      this.setState(
        {
          filters: copyFilters,
        },
        this.getFeatures(),
      );
    }
  };

  render() {
    const {
      features,
      clusters,
      featureStyles,
      filters,
      selectedFilters,
      cities,
      selectedCity,
      error,
      center,
      bounds,
    } = this.state;

    const zoomNew = this.state.zoom ? this.state.zoom : 13;

    return (
      <LeafletMap
        animate={false}
        bounds={bounds}
        onMoveEnd={this.getFeatures}
        onZoomEnd={this.getFeatures}
        key="map"
        ref={this.onLeafletMapRef}
        zoom={zoomNew}
        center={center}
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
            <Popup {...properties} />
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
