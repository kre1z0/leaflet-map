import React from "react";
import PropTypes from "prop-types";
import { Popup as LeafletPopup } from "react-leaflet";

import { GetFieldByProperty } from "../../components/PopupFieldElements/GetFieldByProperty";

import styles from "./Popup.scss";

export const Popup = ({ fields, name }) => {
  return (
    <LeafletPopup maxWidth={444} maxHeight={444}>
      <div>
        <h1>{name}</h1>
        {fields &&
          fields.map((field, index) => (
            <GetFieldByProperty key={`${index}-${field.name}`} {...field} />
          ))}
      </div>
    </LeafletPopup>
  );
};

Popup.propTypes = {
  onClose: PropTypes.func,
};
