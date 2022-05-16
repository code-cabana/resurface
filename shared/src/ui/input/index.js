import { cssJoin } from "../../util";
import styles from "./styles.module.css";

export function Input({
  label,
  value,
  setValue,
  type = "text",
  className,
  ...args
}) {
  return (
    <label className={cssJoin(styles.input, className)}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        {...args}
      />
    </label>
  );
}

export function Checkbox({
  label,
  labelPos = "start",
  value,
  setValue,
  disabled,
  className,
  ...args
}) {
  return (
    <label
      className={cssJoin(
        styles.checkbox,
        disabled && styles.disabled,
        className
      )}
    >
      {labelPos === "start" && label}
      <div>
        <input
          type="checkbox"
          checked={value}
          disabled={disabled}
          onChange={(event) => setValue(event.target.checked)}
          {...args}
        />
        <div className={styles.checkmarkBg}>
          <div className={styles.checkmark} />
        </div>
      </div>
      {labelPos === "end" && label}
    </label>
  );
}

export function Email(props) {
  return <Input label="Email" type="email" name="email" {...props} />;
}

export function Password(props) {
  return <Input label="Password" type="password" name="password" {...props} />;
}

export function FirstName(props) {
  return <Input label="First name" name="fname" {...props} />;
}

export function LastName(props) {
  return <Input label="Last name" name="lname" {...props} />;
}
