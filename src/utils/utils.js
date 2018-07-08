import Leaflet from "leaflet";

export const disableLeafletEventPropagation = ref =>
  ref &&
  Leaflet.DomEvent.disableClickPropagation(ref) &&
  Leaflet.DomEvent.disableScrollPropagation(ref);
