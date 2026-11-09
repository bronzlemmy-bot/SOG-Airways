import { Armchair } from "lucide-react";
import Select from "../Select";

interface CabinClassSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export default function CabinClassSelector({
  value,
  onChange,
  label = "Cabin Class",
  error,
  disabled = false,
}: CabinClassSelectorProps) {
  const cabinClassOptions = [
    { label: "Economy", value: "economy" },
    { label: "Premium Economy", value: "premium-economy" },
    { label: "Business", value: "business" },
    { label: "First Class", value: "first" },
  ];

  return (
    <div className="relative">
      <Select
        id="cabin-class"
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        options={cabinClassOptions}
        error={error}
        disabled={disabled}
        className="pl-10"
      />

      <Armchair className="pointer-events-none absolute left-3 top-10.5 h-5 w-5 text-slate-400" />
    </div>
  );
}