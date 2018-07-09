import React, { Component } from "react";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import PropTypes from "prop-types";
import cn from "classnames";

import { Arrow } from "../../components/icons/Arrow";
import { Portal } from "../../components/Portal/Portal";

import styles from "./DropDown.scss";

export class DropDown extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    values: PropTypes.array,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    maxHeightItemsList: PropTypes.number,
    itemMinHeight: PropTypes.number,
  };

  static defaultProps = {
    placeholder: "Выберите элемент из списка",
    values: [],
    maxHeightItemsList: 210,
    itemMinHeight: 36,
  };

  state = {
    open: false,
    keyDown: false,
    selectItemIndex: -1,

    marginTop: -1,
    left: 0,
    top: 0,
    y: 0,
    x: 0,
    width: 0,
    position: "bottom",
    newPosition: "bottom",
  };

  items = [];

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  componentDidUpdate() {
    const { open } = this.state;
    if (open) {
      this.getScrollValue(this.state.selectItemIndex);
    }
  }

  onResize = () => {
    if (!this.el) return;

    const { maxHeightItemsList } = this.props;

    const { position } = this.state;

    const { width, height, top, left } = this.el.getBoundingClientRect();

    let newPosition = position;

    const diff = top + maxHeightItemsList + height;

    const windowHeight = Math.ceil(document.documentElement.clientHeight, window.innerHeight || 0);

    if (diff > windowHeight) {
      newPosition = "top";
    }

    let y = 0;
    let x = 0;
    let newTop = 0;
    let newLeft = 0;

    if (newPosition === "top") {
      y = `-50%`;
      x = `-100%`;
      newTop = top;
      newLeft = left + width / 2;
    } else {
      y = `-50%`;
      x = `0`;
      newTop = top + height;
      newLeft = left + width / 2;
    }

    this.setState({
      newPosition,
      width,
      y,
      x,
      top: newTop,
      left: newLeft,
    });
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

  open = () => {
    const { values, value } = this.props;

    const findIndex = values.findIndex(item => item.id === value);
    this.setState({
      selectItemIndex: findIndex,
      open: !this.state.open,
    });
    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("click", this.handleDocumentClick);
    document.addEventListener("touchend", this.handleDocumentClick);
  };

  selectItem = ({ id, value }) => {
    const { onChange } = this.props;

    onChange && onChange(id, value);
    this.setState({
      open: false,
      keyDown: false,
    });
    document.removeEventListener("keydown", this.keyDown);
    document.removeEventListener("click", this.handleDocumentClick);
    document.removeEventListener("touchend", this.handleDocumentClick);
  };

  componentWillUnmount() {
    document.removeEventListener("click", this.handleDocumentClick);
    document.removeEventListener("touchend", this.handleDocumentClick);
    document.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("resize", this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    const { value, values } = this.props;
    if (value !== nextProps.value) {
      const findIndex = nextProps.values.findIndex(item => item.value === nextProps.value);
      if (findIndex !== -1) {
        this.setState({
          value: nextProps.value,
          selectItemIndex: findIndex,
        });
      }
    }
    if (values.length !== nextProps.values.length) {
      this.items = [];
    }
  }

  handleDocumentClick = e => {
    const inside = this.el.contains(e.target);
    if (!inside) {
      this.setState({
        open: false,
      });
      document.removeEventListener("keydown", this.keyDown);
      document.removeEventListener("click", this.handleDocumentClick);
      document.removeEventListener("touchend", this.handleDocumentClick);
    }
  };

  keyDown = e => {
    const code = e.keyCode;
    const { selectItemIndex } = this.state;
    const { values } = this.props;

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
      if (selectItemIndex === values.length - 1 || selectItemIndex === values.length) return;
      this.setState({
        keyDown: true,
        selectItemIndex: selectItemIndex + 1,
      });
      return;
    } else if (code === 13) {
      // ENTER
      e.preventDefault();
      values[selectItemIndex] && this.selectItem(values[selectItemIndex]);
    } else if (code === 27) {
      // ESC
      e.preventDefault();
      this.setState({
        keyDown: false,
        open: false,
      });
    } else {
      this.setState({
        selectItemIndex: -1,
      });
    }
  };

  onItemsRef = item => {
    const { values } = this.props;

    if (item !== null && this.items.length !== values.length) {
      this.items.push(item.offsetHeight);
    }
  };

  onDropDownRef = ref => {
    this.el = ref;
  };

  render() {
    const { open, selectItemIndex, keyDown, top, left, y, x, width, newPosition } = this.state;
    const { value, values, placeholder, className, itemMinHeight } = this.props;
    const find = values && values.find(item => item.id === value);

    return (
      <div
        className={cn(styles.dropDown, className, {
          [styles.open]: open,
          [styles.newPositionTopContainer]: newPosition === "top",
          [styles.disabled]: values.length === 0,
        })}
        ref={this.onDropDownRef}
      >
        <div onClick={this.open} className={styles.selectField}>
          <span className={styles.value}>{find ? find.value : placeholder}</span>
          <Arrow
            style={{
              fill: "rgba(0, 0, 0, 0.87)",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: 10,
            }}
          />
        </div>
        <CSSTransitionGroup
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
          transitionName="sgis-slide-animation"
        >
          {open && (
            <Portal>
              <div
                style={{
                  width,
                  top,
                  left,
                  transformOrigin: "center",
                  transform: `translate(${y}, ${x})`,
                }}
                ref={el => (this.itemList = el)}
                className={cn(styles.itemsList, {
                  [styles.newPositionTop]: newPosition === "top",
                })}
              >
                {values.map((item, index) => {
                  const selected = keyDown ? selectItemIndex === index : value === item.id;
                  return (
                    <div
                      style={{
                        minHeight: itemMinHeight,
                      }}
                      ref={this.onItemsRef}
                      key={`${index}-${item.id}`}
                      onClick={() => {
                        this.selectItem(item);
                      }}
                      className={cn(styles.item, {
                        [styles.selected]: selected,
                      })}
                    >
                      {item.value}
                    </div>
                  );
                })}
              </div>
            </Portal>
          )}
        </CSSTransitionGroup>
      </div>
    );
  }
}
