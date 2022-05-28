import { cloneElement, isValidElement, useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks";
import { cssJoin } from "../../util";
import { Button as _Button } from "../button";
import styles from "./styles.module.css";

export function Dropdown({ button: _button, items, ...rest }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef();

  function onClick(event) {
    event.preventDefault();
    setExpanded((previousVal) => !previousVal);
    if (typeof _button?.onClick === "function") button.onClick(event);
  }

  const button = isValidElement(_button) ? (
    cloneElement(_button, { onClick })
  ) : (
    <Button {...button} onClick={onClick} />
  );

  useOnClickOutside(ref, () => {
    if (expanded) setExpanded(false);
  });

  return (
    <div ref={ref} className={styles.dropdown}>
      {button}
      <Items
        {...rest}
        items={items}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    </div>
  );
}

function Button(props) {
  const { label, children, className, onClick, ...rest } = props;

  return (
    props && (
      <_Button
        {...rest}
        onClick={onClick}
        className={cssJoin(styles.button, className)}
      >
        {label || children}
      </_Button>
    )
  );
}

function Items({ items, expanded, setExpanded, ...rest }) {
  const hasItems = Array.isArray(items) && items.length > 0;
  function onClick() {
    setExpanded(false);
  }
  return (
    hasItems && (
      <ul
        {...rest}
        className={cssJoin(styles.items, expanded && styles.expanded)}
        onClick={onClick}
      >
        {items.map((props, index) => (
          <Item key={index} {...props} />
        ))}
      </ul>
    )
  );
}

function Item(props) {
  const { label, children, className, ...rest } = props;
  return (
    <li {...rest} className={cssJoin(styles.item, className)}>
      {label || children}
    </li>
  );
}
