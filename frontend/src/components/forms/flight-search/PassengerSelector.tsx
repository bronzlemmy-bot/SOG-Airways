import { Users } from "lucide-react";
import Select from "../Select";

interface PassengerSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export default function PassengerSelector({
  value,
  onChange,
  label = "Passengers",
  error,
  disabled = false,
}: PassengerSelectorProps) {
  const passengerOptions = [
    { label: "1 Passenger", value: "1" },
    { label: "2 Passengers", value: "2" },
    { label: "3 Passengers", value: "3" },
    { label: "4 Passengers", value: "4" },
    { label: "5 Passengers", value: "5" },
    { label: "6 Passengers", value: "6" },
    { label: "7 Passengers", value: "7" },
    { label: "8 Passengers", value: "8" },
    { label: "9 Passengers", value: "9" },
  ];

  return (
    <div className="relative">
      <Select
        id="passengers"
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        options={passengerOptions}
        error={error}
        disabled={disabled}
      />

      <Users className="pointer-events-none absolute right-3 top-10.5 h-5 w-5 text-slate-400" />
    </div>
  );
}