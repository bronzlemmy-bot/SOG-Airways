import { MapPin } from "lucide-react";
import Input from "../Input";

interface LocationFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export default function LocationField({
  id,
  label,
  value,
  placeholder = "City or airport",
  onChange,
  required = false,
  error,
  disabled = false,
}: LocationFieldProps) {
  return (
    <Input
      id={id}
      label={label}
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      required={required}
      error={error}
      disabled={disabled}
      leftIcon={<MapPin className="h-5 w-5" />}
      autoComplete="off"
    />
  );
}
