import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import styles from "./AutoComplete.scss";

import { TextInput } from "../TextInput/TextInput";

export class AutoComplete extends Component {
  static propTypes = {
    values: PropTypes.array,
    value: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    maxHeightItemsList: PropTypes.number,
    itemMinHeight: PropTypes.number,
  };

  static defaultProps = {
    values: [],
    value: "",
    selectedItem: null,
    maxHeightItemsList: 210,
    itemMinHeight: 36,
  };

  state = {
    items: [],
    selectItemIndex: -1,
    value: this.props.value,
    keyDown: false,
  };

  items = [];

  componentWillUnmount() {
    document.removeEventListener("click", this.handleDocumentClick);
    document.removeEventListener("touchend", this.handleDocumentClick);
    document.removeEventListener("keydown", this.keyDown);
  }

  componentWillReceiveProps(nextProps) {
    const { value, values } = this.props;
    if (value !== nextProps.value) {
      const findIndex = nextProps.values.findIndex(item => item.value === nextProps.value);
      if (findIndex !== -1) {
        this.setState({
          items: [],
          value: nextProps.value,
          selectItemIndex: findIndex,
        });
      } else {
        this.setState({
          value: "",
        });
      }
    }

    if (values.length !== nextProps.values.length) {
      this.setState({
        items: [],
      });
      this.items = [];
    }
  }

  componentDidUpdate() {
    this.getScrollValue(this.state.selectItemIndex);
  }

  onSelect = ({ id, value }) => {
    const { onChange } = this.props;
    onChange && onChange(id, value);
    this.autoCompleteInput.focus();
    this.setState({
      value,
      keyDown: false,
      items: [],
    });
    document.removeEventListener("keydown", this.keyDown);
    document.removeEventListener("click", this.handleDocumentClick);
    document.removeEventListener("touchend", this.handleDocumentClick);
  };

  onChange = value => {
    const { values } = this.props;
    if (value.length > 0) {
      this.setState({
        value,
        items: value
          ? values
              .filter(item => item && item.value.toLowerCase().search(value.toLowerCase()) !== -1)
              .map(item => ({
                id: item.id,
                value: item.value,
                text: item.value.replace(value, `<b>${value}</b>`),
              }))
          : [],
      });
    } else {
      this.setState({
        value,
        items: values.map(item => ({
          id: item.id,
          value: item.value,
          text: item.value,
        })),
      });
    }
    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("click", this.handleDocumentClick);
    document.addEventListener("touchend", this.handleDocumentClick);
  };

  getScrollValue = selectedItemIndex => {
    const { maxHeightItemsList } = this.props;
    let sumHeight = 0;
    this.items.forEach((height, i) => {
      if (i <= selectedItemIndex) {
        sumHeight += height;
      }
    });
    if (sumHeight > maxHeightItemsList) {
      this.itemList.scrollTop = sumHeight - maxHeightItemsList;
    } else {
      this.itemList.scrollTop = 0;
    }
  };

  keyDown = e => {
    const { onChange } = this.props;
    const code = e.keyCode;
    const { selectItemIndex, items, value } = this.state;

    const selectedItem = items.find(item => item.value === value);

    if (code === 38) {
      // UP
      e.preventDefault();
      if (selectItemIndex === 0) return;
      this.setState({
        keyDown: true,
        selectItemIndex: selectItemIndex - 1,
      });
      return;
    } else if (code === 40) {
      // DOWN
      e.preventDefault();
      if (selectItemIndex === items.length - 1 || selectItemIndex === items.length) return;
      this.setState({
        keyDown: true,
        selectItemIndex: selectItemIndex + 1,
      });
      return;
    } else if (code === 13) {
      // ENTER
      e.preventDefault();
      items[selectItemIndex] && this.onSelect(items[selectItemIndex]);
    } else if (code === 27 || code === 9) {
      // ESC and TAB
      onChange && onChange(selectedItem.id, value);
      document.removeEventListener("keydown", this.keyDown);
      document.removeEventListener("click", this.handleDocumentClick);
      document.removeEventListener("touchend", this.handleDocumentClick);
      this.setState({
        items: [],
        keyDown: false,
      });
      e.preventDefault();
      this.autoCompleteInput.blur();
    } else {
      this.setState({
        selectItemIndex: -1,
      });
    }
  };

  handleDocumentClick = e => {
    const { items } = this.state;
    const { onChange, value } = this.props;
    const selectedItem = items.find(item => item.value === value);

    const inside = this.el.contains(e.target);
    if (!inside) {
      onChange && onChange(selectedItem.id, this.state.value);
      this.setState({
        items: [],
      });
      document.removeEventListener("keydown", this.keyDown);
      document.removeEventListener("click", this.handleDocumentClick);
      document.removeEventListener("touchend", this.handleDocumentClick);
    }
  };

  onFocus = () => {
    const { value, values } = this.props;

    const findIndex = values.findIndex(item => item.value === value);

    this.setState({
      selectItemIndex: findIndex,
      items: values.map(item => ({
        id: item.id,
        value: item.value,
        text: item.value,
      })),
    });

    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("click", this.handleDocumentClick);
    document.addEventListener("touchend", this.handleDocumentClick);
  };

  onRef = inputFilter => {
    if (inputFilter !== null) {
      this.autoCompleteInput = inputFilter;
    }
  };

  onItemsRef = item => {
    const { values } = this.props;

    if (item !== null && this.items.length !== values.length) {
      this.items.push(item.offsetHeight);
    }
  };

  render() {
    const { className, placeholder, maxHeightItemsList, itemMinHeight } = this.props;
    const { items, selectItemIndex, value, keyDown } = this.state;
    const mergedClassName = cn(
      styles.autoComplete,
      className,
      items.length === 0 && styles.emptyList,
      items.length > 0 && styles.open,
    );

    const selectedItem = items.find(item => item.value === value);

    return (
      <div ref={el => (this.el = el)} className={mergedClassName}>
        <TextInput
          id={selectedItem && selectedItem.id}
          className={styles.textInput}
          onRef={this.onRef}
          placeholder={placeholder}
          style={{ width: "100%" }}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
          value={this.state.value}
        />
        <div
          ref={el => (this.itemList = el)}
          style={{
            maxHeight: maxHeightItemsList,
          }}
          className={styles.itemsList}
        >
          {items.map((item, index) => {
            const selected = keyDown ? selectItemIndex === index : value === item.value;
            return (
              <div
                style={{
                  minHeight: itemMinHeight,
                }}
                ref={this.onItemsRef}
                key={`${item.id}-${index}`}
                onClick={() => {
                  this.onSelect(item);
                }}
                className={cn(styles.item, {
                  [styles.selected]: selected,
                })}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
