import { useRef, useState } from "react";
import { cssJoin } from "../../util";
import { Button } from "../button";
import styles from "./styles.module.css";

export function Modal({
  heading,
  button,
  content: __content,
  children,
  className,
  ...props
}) {
  const [opened, setOpened] = useState(false);
  const bgRef = useRef(null);

  function closeModalAnd(callback) {
    return () => {
      setOpened(false);
      if (typeof callback === "function") callback();
    };
  }

  function onButtonClick(event) {
    event.preventDefault();
    setOpened(true);
  }

  function onBgClick(event) {
    event.preventDefault();
    const clickedBg = event.target === bgRef.current;
    if (clickedBg) setOpened(false);
  }

  const _content = __content || children;
  const content =
    typeof _content === "function" ? _content({ closeModalAnd }) : _content;

  return (
    <>
      <Button
        {...button}
        onClick={onButtonClick}
        className={cssJoin(styles.button, button?.className)}
      />
      <div
        ref={bgRef}
        onClick={onBgClick}
        className={cssJoin(styles.modal, className, opened && styles.opened)}
        {...props}
      >
        <div className={styles.content}>
          {heading && <h2 className={styles.heading}>{heading}</h2>}
          {content}
        </div>
      </div>
    </>
  );
}
