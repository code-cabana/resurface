import { useState } from "react";
import Img from "../img";
import tryImg from "../../public/img/try.png";
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
        <Img
          src={tryImg}
          alt="try the Resurface editor below"
          className={styles.img}
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
