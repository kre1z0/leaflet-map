import React from "react";
import PropTypes from "prop-types";
import { Popup as LeafletPopup } from "react-leaflet";

import styles from "./Popup.scss";

export const Popup = ({ onClose, properties, id }) => {
  return (
    <LeafletPopup maxWidth={444} maxHeight={444} onClose={onClose}>
      <div>
        <h1>{id}</h1>
        {properties.description}
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse fugiat labore molestiae neque
        officia omnis quas. Ea ex iusto ratione. Architecto ipsam nesciunt nobis numquam sunt
        temporibus veniam, veritatis voluptate!
        <div className={styles.footer}>
          <button>ggwp</button>
        </div>
      </div>
    </LeafletPopup>
  );
};

Popup.propTypes = {
  onClose: PropTypes.func,
};
