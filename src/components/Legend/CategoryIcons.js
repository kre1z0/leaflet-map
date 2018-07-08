import React from "react";

export const Icon = props => {
  const { iconUrl, iconSize, type } = props;
  return <img style={{ width: iconSize[0], height: iconSize[1] }} src={iconUrl} alt={type} />;
};

export const Cluster = props => {
  const { borderColor, fillColor, borderWidth } = props;
  return (
    <div
      style={{
        display: "inline-block",
        borderRadius: "500em",
        width: 21,
        height: 21,
        background: fillColor,
        border: `${borderWidth}px solid ${borderColor}`,
      }}
    />
  );
};

export const Square = props => {
  const { fillColor, fillOpacity, color, weight } = props;
  return (
    <div
      style={{
        display: "inline-block",
        width: 17,
        height: 17,
        background: fillColor,
        opacity: fillOpacity,
        border: `${weight}px solid ${color}`,
      }}
    />
  );
};
