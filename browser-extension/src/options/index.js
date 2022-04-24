import renderWithProviders from "../lib/render/page";
import NumberInput, { NumberGroup } from "../lib/components/number";
import { Select } from "../lib/components/select";
import { Switch } from "../lib/components/switch";
import { useStoredValue } from "../lib/hooks";
import styles from "./styles.module.css";

function OptionsPage() {
  const [enabled, setEnabled] = useStoredValue("cc-resurface-enabled");
  const [minimap, setMinimap] = useStoredValue("cc-resurface-minimap");
  const [logging, setLogging] = useStoredValue("cc-resurface-logging");
  const [theme, setTheme] = useStoredValue("cc-resurface-theme");
  const [_pos, _setPos] = useStoredValue("cc-resurface-editor-position");
  const pos = _pos || {};
  const setPos = (newPos) => {
    _setPos((prevPos) => {
      return { ...prevPos, ...newPos };
    });
  };
  const [rememberSize, setRememberSize] = useStoredValue(
    "cc-resurface-remember-editor-size"
  );

  return (
    <div className={styles.container}>
      <h1>Options</h1>
      <p className="subtitle">Resurface by Code Cabana</p>
      <div className={styles.options}>
        <Select
          label="Editor theme"
          value={theme}
          setValue={setTheme}
          options={[
            { label: "Light", value: "vs" },
            { label: "Dark", value: "vs-dark" },
            { label: "High Contrast", value: "hc-black" },
          ]}
        />
        <Switch
          label="Enable"
          description="Allow Resurface to run on pages you visit"
          value={enabled}
          setValue={setEnabled}
        />
        <Switch
          label="Show minimap"
          description="Show/hide the minimap that appears next to the scrollbar within a Resurface editor"
          value={minimap}
          setValue={setMinimap}
        />
        <Switch
          label="Remember editor size"
          description="Store the size of the editor from before it was closed and restore it when re-opening a new editor"
          value={rememberSize}
          setValue={setRememberSize}
        />
        <NumberGroup
          label="Editor position"
          description="When the editor is opened, the amount of pixels from the left / top of the screen that the editor should appear. If blank, the opening window's position is used"
        >
          <NumberInput
            label="Left"
            value={pos.left}
            setValue={(newValue) => setPos({ left: newValue })}
          />
          <NumberInput
            label="Top"
            value={pos.top}
            setValue={(newValue) => setPos({ top: newValue })}
          />
        </NumberGroup>

        <Switch
          label="Log to console"
          description="Print debug information to the browser's developer console"
          value={logging}
          setValue={setLogging}
        />
      </div>
    </div>
  );
}

renderWithProviders(OptionsPage, "options");
