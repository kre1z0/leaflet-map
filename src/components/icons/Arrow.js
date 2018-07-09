import React from "react";
import PropTypes from "prop-types";

export const Arrow = ({ style }) => {
  return (
    <svg style={style} viewBox="0 0 7 4" height="4" width="7">
      <polygon points="3.5,4 0,0 7,0 " />
    </svg>
  );
};

Arrow.propTypes = {
  style: PropTypes.object,
};
