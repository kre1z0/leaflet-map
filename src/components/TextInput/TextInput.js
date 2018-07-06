import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import styles from "./TextInput.scss";

export class TextInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    className: PropTypes.string,
    wrapperClassName: PropTypes.string,
    style: PropTypes.object,
    wrapperStyle: PropTypes.object,
    inputProps: PropTypes.object,
    wrapperProps: PropTypes.object,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    focus: PropTypes.bool,
    placeholder: PropTypes.string,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onRef: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.number,
  };

  onChange = ({ target }) => {
    const { onChange } = this.props;

    onChange && onChange(target.value, target.name);
  };

  onFocus = ({ target }) => {
    const { onFocus } = this.props;
    onFocus && onFocus(target.value);
  };

  onBlur = ({ target }) => {
    const { onBlur, id } = this.props;
    onBlur && onBlur(target.value, id);
  };

  onRef = input => {
    const { onRef, focus } = this.props;
    onRef && onRef(input);
    if (focus && input) {
      input.focus();
    }
  };
  render() {
    const {
      value,
      className,
      wrapperClassName,
      style,
      wrapperStyle,
      readOnly,
      placeholder,
      disabled,
      inputProps,
      wrapperProps,
      label,
      name,
    } = this.props;

    const mergedWrapperClassName = cn(styles.textInputWrapper, wrapperClassName);

    const mergedClassName = cn(styles.textInput, className);

    return (
      <div {...wrapperProps} className={mergedWrapperClassName} style={wrapperStyle}>
        {label && <span className={styles.label}>{label}</span>}

        <input
          {...inputProps}
          name={name}
          placeholder={placeholder}
          ref={input => this.onRef(input)}
          className={mergedClassName}
          style={style}
          type="text"
          value={value}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
          readOnly={readOnly}
          disabled={disabled}
        />
      </div>
    );
  }
}
