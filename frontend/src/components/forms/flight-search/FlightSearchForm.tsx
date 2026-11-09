"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Input from "../Input";
import Select from "../Select";
import DatePicker from "../DatePicker";
import Radio from "../Radio";
import PrimaryButton from "../../buttons/PrimaryButton";

interface FlightSearchFormProps {
  onSearch?: (data: FlightSearchData) => void;
  loading?: boolean;
  className?: string;
}

export interface FlightSearchData {
  tripType: string;
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  passengers: string;
  cabinClass: string;
}

const cabinClassOptions = [
  { label: "Economy", value: "economy" },
  { label: "Premium Economy", value: "premium-economy" },
  { label: "Business", value: "business" },
  { label: "First Class", value: "first" },
];

export default function FlightSearchForm({
  onSearch,
  loading = false,
  className = "",
}: FlightSearchFormProps) {
  const [formData, setFormData] = useState<FlightSearchData>({
    tripType: "round-trip",
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
    cabinClass: "economy",
  });

  const updateField = (
    field: keyof FlightSearchData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSearch?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-lg md:p-6 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Search Flights
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Find flights and explore destinations around the world.
        </p>
      </div>

      <div className="mb-6">
        <Radio
          name="tripType"
          label="Trip Type"
          value={formData.tripType}
          onChange={(event) =>
            updateField("tripType", event.target.value)
          }
          options={[
            { label: "Round Trip", value: "round-trip" },
            { label: "One Way", value: "one-way" },
            { label: "Multi-City", value: "multi-city" },
          ]}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          id="flight-from"
          label="From"
          placeholder="Departure city or airport"
          value={formData.from}
          onChange={(event) =>
            updateField("from", event.target.value)
          }
          required
        />

        <Input
          id="flight-to"
          label="To"
          placeholder="Arrival city or airport"
          value={formData.to}
          onChange={(event) =>
            updateField("to", event.target.value)
          }
          required
        />

        <DatePicker
          id="departure-date"
          label="Departure Date"
          value={formData.departureDate}
          onChange={(event) =>
            updateField("departureDate", event.target.value)
          }
          required
        />

        {formData.tripType === "round-trip" && (
          <DatePicker
            id="return-date"
            label="Return Date"
            value={formData.returnDate}
            onChange={(event) =>
              updateField("returnDate", event.target.value)
            }
            min={formData.departureDate || undefined}
            required
          />
        )}

        <Select
          id="passengers"
          label="Passengers"
          value={formData.passengers}
          onChange={(event) =>
            updateField("passengers", event.target.value)
          }
          options={[
            { label: "1 Passenger", value: "1" },
            { label: "2 Passengers", value: "2" },
            { label: "3 Passengers", value: "3" },
            { label: "4 Passengers", value: "4" },
            { label: "5 Passengers", value: "5" },
            { label: "6+ Passengers", value: "6+" },
          ]}
        />

        <Select
          id="cabin-class"
          label="Cabin Class"
          value={formData.cabinClass}
          onChange={(event) =>
            updateField("cabinClass", event.target.value)
          }
          options={cabinClassOptions}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <PrimaryButton
          type="submit"
          loading={loading}
        >
          <Search className="mr-2 h-4 w-4" />
          Search Flights
        </PrimaryButton>
      </div>
    </form>
  );
}
