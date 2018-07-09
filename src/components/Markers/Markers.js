import Leaflet from "leaflet";

import { theme } from "../../assets/theme/theme";

import styles from "./Markers.scss";

const clusterTemplate = props => {
  const { count, size, color = "#FFFFFF", fillColor = "#FFFFFF" } = props;

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
                    fill="${theme.colors.mustard}"
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
  const style = getStyleById(featureStyles, properties.styleId);
  if (cluster) {
    const { size, count } = properties;
    return new Leaflet.divIcon({
      html: clusterTemplate({ size, count, ...style }),
      iconSize: new Leaflet.Point(size, size),
      className: "",
      iconAnchor: [size / 2, size / 2],
    });
  } else {
    const { iconUrl, iconSize, iconAnchor } = style;

    return new Leaflet.Icon({
      iconUrl,
      iconSize: new Leaflet.Point(iconSize[0], iconSize[1]),
      className: "leaflet-div-icon",
      iconAnchor: [iconAnchor[0], iconAnchor[1]],
    });
  }
};
