import React from "react";
import PropTypes from "prop-types";

import { DefaultFieldElement, LinkFieldElement, ListFieldElement } from "./FieldElement";

const isListValue = (value, name) => {
  if (name === "Телефон" && value.toString().includes(",")) return value.split(",");
  else if (value !== ";" && value.toString().includes(";")) return value.split(";");
  else return false;
};

const isLinkValue = (value, link) => {
  const isHref =
    !!link || (value && (value.toString().includes("http") || value.toString().includes("www")));

  const url =
    link ||
    (isHref && value.includes("www") && !value.includes("http") ? `http://${value}` : value);

  if (isHref) return url;
  else return false;
};

export const GetFieldByProperty = props => {
  const { link, value, name } = props;

  const getList = isListValue(value, name);
  const getLink = isLinkValue(value, link);

  if (getLink) return <LinkFieldElement {...props} url={getLink} />;
  else if (getList) return <ListFieldElement {...props} list={getList} />;
  else return <DefaultFieldElement {...props} />;
};

GetFieldByProperty.propTypes = {
  link: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
