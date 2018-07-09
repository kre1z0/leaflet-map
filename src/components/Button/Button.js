import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import styles from "./Button.scss";

export const Button = props => {
  const { children, className } = props;
  return (
    <button className={cn(styles.button, className)} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
};
