import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import styles from "./styles.module.css";

const defaultValue = `/* my_cool_styles.css */

body {
  color: var(--cc-colour-deepsea);

  /* Try uncommenting this! */
  /* color: blue; */
}

* {
  box-sizing: border-box;
}
`;

export default function Editor() {
  const [value, setValue] = useState(defaultValue);

  function onChange(value) {
    setValue(value);
  }

  return (
    <>
      <div className={styles.container}>
        <img
          src="/img/try.png"
          className={styles.img}
          alt="try the Resurface editor below"
        />
        <MonacoEditor
          theme="vs-dark"
          defaultLanguage="css"
          defaultValue={defaultValue}
          onChange={onChange}
          className={styles.editor}
        />
      </div>
      <style>{value}</style>
    </>
  );
}
