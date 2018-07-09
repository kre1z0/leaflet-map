import React from "react";
import PropTypes from "prop-types";

import { DropDown } from "../DropDown/DropDown";
import { AutoComplete } from "../AutoComplete/AutoComplete";
import { Button } from "../../components/Button/Button";
import { disableLeafletEventPropagation } from "../../utils/utils";

import styles from "./FilteringControlBlock.scss";

const FilterSelect = props => {
  const { name_ru, value, values, id, name, onFilterChange } = props;

  const allElement = { id: -1, value: "Все" };

  const items = values
    ? values.map(item => ({
        id: Number(Object.keys(item)[0]),
        value: item[Object.keys(item)[0]],
      }))
    : [];

  const valueName = items.filter(item => item.id === value)[0];

  const onSelect = (itemId, item) => {
    onFilterChange({ id, name })(itemId === -1 ? null : itemId);
  };

  return (
    <div>
      <h4>{name_ru}</h4>
      <DropDown
        onChange={onSelect}
        value={valueName ? valueName.id : allElement.id}
        values={items ? [allElement].concat(items) : []}
      />
    </div>
  );
};

const FilterBlock = props => {
  const { type } = props;
  switch (type) {
    case "select":
      return <FilterSelect {...props} />;
    default:
      return <div>Такой фильтр {type} не реализован</div>;
  }
};

export const FilteringControlBlock = ({
  selectedCity,
  cities,
  filters,
  selectedFilters,
  onFilterChange,
  onFilterSubmit,
  onCityChange,
}) => {
  return (
    <div ref={disableLeafletEventPropagation} className={styles.filteringControlBlock}>
      <h2>Коммерческая недвижимость</h2>
      <AutoComplete
        className={styles.cityAutoComplete}
        placeholder="Выберите город"
        value={selectedCity && selectedCity.name}
        onChange={onCityChange}
        values={cities.map(({ id, properties: { name } }) => ({
          id,
          value: name,
        }))}
      />
      {filters.map(filter => (
        <FilterBlock
          key={filter.id + filter.type + filter.name_ru}
          onFilterChange={onFilterChange}
          {...filter}
          value={
            selectedFilters && selectedFilters.hasOwnProperty(filter.name)
              ? selectedFilters[filter.name]
              : filter.value
          }
        />
      ))}
      <div className={styles.submitBtnContainer}>
        <Button onClick={onFilterSubmit}>Применить</Button>
      </div>
    </div>
  );
};

FilteringControlBlock.propTypes = {
  selectedCity: PropTypes.object,
  filters: PropTypes.array,
  cities: PropTypes.array,
  selectedFilters: PropTypes.object,
  onFilterSubmit: PropTypes.func,
  onFilterChange: PropTypes.func,
  onCityChange: PropTypes.func,
};
