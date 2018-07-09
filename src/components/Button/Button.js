import React from "react";
import PropTypes from "prop-types";

import styles from "./Button.scss";

export const Button = props => {
  const { children } = props;
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.any,
};
