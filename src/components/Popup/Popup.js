import React from "react";
import PropTypes from "prop-types";
import { Popup as LeafletPopup } from "react-leaflet";

import { GetFieldByProperty } from "../../components/PopupFieldElements/GetFieldByProperty";

import styles from "./Popup.scss";

export const Popup = ({ fields, name, description }) => {
  return (
    <LeafletPopup className={styles.popup} maxWidth={400}>
      <div className={styles.popupContainer}>
        <div className={styles.popupHeader}>
          <div className={styles.name}>{name}</div>
          <div className={styles.description}>{description}</div>
        </div>
        <div className={styles.fieldsContainer}>
          {fields &&
            fields.map((field, index) => (
              <GetFieldByProperty key={`${index}-${field.name}`} {...field} />
            ))}
        </div>
      </div>
    </LeafletPopup>
  );
};

Popup.propTypes = {
  onClose: PropTypes.func,
};
