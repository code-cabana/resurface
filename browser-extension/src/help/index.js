import renderWithProviders from "../lib/render/page";
import { goToOptionsPage, goToPage } from "../lib/util";
import { Button } from "shared/ui";
import styles from "./styles.module.css";

function Help() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Resurface</h1>
        <p className="subtitle">by Code Cabana</p>

        <div className={styles.content}>
          <h2>Usage</h2>
          <p>Using the Resurface editor is as simple as:</p>
          <ol>
            <li>
              Clicking the extension icon to highlight all compatible input
              fields on the current page
            </li>
            <li>
              Clicking a highlighted page element to open a connected Resurface
              editor
            </li>
          </ol>
          <p>
            Now you can use the Resurface editor to edit the contents of your
            chosen page element!
          </p>
          <h2>Features/Tips</h2>
          <ul>
            <li>
              Resurface supports many of the same features as{" "}
              <a href="https://code.visualstudio.com/">VS Code</a>
            </li>
            <li>
              Changes are saved automatically & instantly right into the chosen
              page element
            </li>
            <li>
              Clicking the extension icon a second time will close all currently
              opened editors
            </li>
          </ul>
        </div>
        <div className={styles.buttons}>
          <Button onClick={goToOptionsPage}>Options</Button>
          <Button onClick={() => goToPage("assets/login.html")}>Login</Button>
        </div>
      </div>
      <div className={styles.footer}>
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

renderWithProviders(Help, "help");
