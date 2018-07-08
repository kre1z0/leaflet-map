import React from "react";
import PropTypes from "prop-types";

import { disableLeafletEventPropagation } from "../../utils/utils";
import { Icon, Cluster, Square } from "./CategoryIcons";

import styles from "./Legend.scss";

const CategoryIcon = props => {
  const { type } = props;
  switch (type) {
    case "icon":
      return <Icon {...props} />;
    case "cluster":
      return <Cluster {...props} />;
    default:
      return <Square {...props} />;
  }
};

const Category = props => {
  const { legendLabel } = props;
  return (
    <div className={styles.category}>
      <CategoryIcon {...props} />
      {legendLabel}
    </div>
  );
};

export const Legend = ({ featureStyles = [] }) => {
  return (
    <div ref={disableLeafletEventPropagation} className={styles.legend}>
      {featureStyles.map(category => <Category key={category.styleId} {...category} />)}
    </div>
  );
};

Legend.propTypes = {
  featureStyles: PropTypes.arrayOf(PropTypes.object),
};
