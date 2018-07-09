import React from "react";
import numeral from "numeral";
import cn from "classnames";

import { isNumeric } from "../../utils/number";
import { replaceNbsps } from "../../utils/string";

import styles from "./FieldElement.scss";

const getFormattedValue = (value, name) => {
  if (value === ";" || !value) return "-";
  else if (isNumeric(value) && name !== "Телефон")
    return numeral(value)
      .format("0,0.[0]")
      .replace(",", ".");
  else return value;
};

const FieldRow = ({ children }) => <div className={styles.fieldRow}>{children}</div>;

const FieldName = ({ name }) => <div className={styles.name}>{name}</div>;

const Icon = ({ ico, tooltip }) => {
  return <img src={ico} title={tooltip} alt={tooltip} />;
};

const FieldValue = ({ value, element, icons }) => (
  <div className={styles.value}>
    {element ? element : getFormattedValue(replaceNbsps(value))}
    {icons && (
      <div>
        {icons.map(({ ico, tooltip }, index) => (
          <Icon key={`${ico}-${index}`} ico={ico} tooltip={tooltip} />
        ))}
      </div>
    )}
  </div>
);

const List = ({ list }) => <div>{list.map((item, index) => <div key={index}>{item}</div>)}</div>;

export const DefaultFieldElement = ({ name, value, icons }) => {
  return (
    <FieldRow>
      <FieldName name={name} />
      <FieldValue icons={icons} value={value} />
    </FieldRow>
  );
};

export const LinkFieldElement = ({ name, value, url, icons }) => {
  return (
    <FieldRow>
      <FieldName name={name} />
      <FieldValue
        icons={icons}
        element={
          <a href={url} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        }
      />
    </FieldRow>
  );
};

export const ListFieldElement = ({ name, list, icons }) => {
  return (
    <FieldRow>
      <FieldName name={name} />
      <FieldValue icons={icons} element={<List list={list} />} />
    </FieldRow>
  );
};
