import DatePicker from "../DatePicker";

interface DateFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

export default function DateField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  required = false,
  error,
  helperText,
  disabled = false,
}: DateFieldProps) {
  return (
    <DatePicker
      id={id}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      min={min}
      max={max}
      required={required}
      error={error}
      helperText={helperText}
      disabled={disabled}
    />
  );
}