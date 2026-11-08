import styles from "./sketch.module.css";

type Props = {
  type: "checkbox" | "radio";
  name: string;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: () => void;
  children: React.ReactNode;
};

/** A real checkbox or radio styled as a chip: native keyboard and screen-reader behaviour. */
export function Chip({ type, name, value, checked, defaultChecked, onChange, children }: Props) {
  return (
    <label className={styles.chip}>
      <input type={type} name={name} value={value} checked={checked} defaultChecked={defaultChecked} onChange={onChange} />
      <span>{children}</span>
    </label>
  );
}
