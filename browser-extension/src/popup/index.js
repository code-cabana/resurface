import renderWithProviders from "../lib/render/page";
import { goToOptionsPage, goToPage } from "../lib/util";
import { Switch } from "../lib/components/switch";
import { useStoredValue } from "../lib/hooks";
import { Button } from "shared/ui";
import styles from "./styles.module.css";

function Popup() {
  const [enabled, setEnabled] = useStoredValue("cc-resurface-enabled");
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Resurface</h1>
        <p className="subtitle">by Code Cabana</p>
        <p className={styles.description}>
          When enabled, CodeMirror editors on pages you visit will be marked
          with an "Open Resurface editor" button. Clicking one of those buttons
          will open a Resurface editor.
        </p>
        <div className={styles.buttons}>
          <Button onClick={goToOptionsPage}>Options</Button>
          <Button onClick={() => goToPage("assets/login.html")}>Login</Button>
        </div>
      </div>
      <div className={styles.footer}>
        {enabled !== null && (
          <Switch label="Enable" value={enabled} setValue={setEnabled} />
        )}
        <a
          className={styles.footerLink}
          href="https://codecabana.com.au"
          target="_blank"
        >
          codecabana.com.au
        </a>
      </div>
    </div>
  );
}

renderWithProviders(Popup, "popup");
