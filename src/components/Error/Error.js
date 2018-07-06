import React from "react";
import PropTypes from "prop-types";

import styles from "./Error.scss";

export const Error = ({ text }) => {
  return <div className={styles.error}>{text}</div>;
};

Error.propTypes = {
  text: PropTypes.string,
};
