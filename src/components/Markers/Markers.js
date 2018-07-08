import React from "react";
import Leaflet from "leaflet";

import Yarmarka from "../../assets/icons/Yarmarka.svg";
import YarmarkaSelected from "../../assets/icons/Yarmarka_selected.svg";

import styles from "./Markers.scss";

const clusterTemplate = props => {
  const { count, size, borderColor = "#00A513", color = "#FFFFFF", fillColor = "#FFFFFF" } = props;

  const sizeStyle = `
      width: ${size}px; 
      height: ${size}px; 
    `;

  const strokeWidth = (38 / size) * 2;

  const labelStyle = `
      color: ${color}
    `;

  return `
        <div class="${styles.cluster}" style="${sizeStyle}">
            <svg viewBox="0 0 38 38" height="${size}px" width="${size}px"> 
                <circle 
                    fill="${borderColor}"
                    stroke="${fillColor}"
                    stroke-width="${strokeWidth}"
                    cx="19" 
                    cy="19" 
                    r="18"
                />
                <circle
                    fill="${fillColor}"
                    cx="19"
                    cy="19" 
                    r="12"
                />
            </svg>
            <span class="${styles.clusterLabel}" style="${labelStyle}">${count}</span> 
        </div>
    `;
};

const getStyleById = (styles, styleId) => {
  return styles ? styles.find(style => styleId === style.styleId) : null;
};

export const getIcon = ({ featureStyles, properties, cluster }) => {
  if (cluster) {
    const style = getStyleById(featureStyles, properties.styleId);
    console.info("-->style ggwp", style);
    const { size, count } = properties;
    return new Leaflet.divIcon({
      html: clusterTemplate({ size, count, ...style }),
      iconSize: new Leaflet.Point(size, size),
      className: "",
      iconAnchor: [size / 2, size / 2],
    });
  } else {
    const iconWidth = 40;
    const iconHeight = 49.6;

    return new Leaflet.Icon({
      // iconUrl: selected ? YarmarkaSelected : Yarmarka,
      iconSize: new Leaflet.Point(iconWidth, iconHeight),
      className: "leaflet-div-icon",
      iconAnchor: [iconWidth / 2, iconHeight],
    });
  }
};
