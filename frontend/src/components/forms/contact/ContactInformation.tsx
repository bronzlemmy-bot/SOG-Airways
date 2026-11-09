import {
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

interface ContactInformationProps {
  email?: string;
  phone?: string;
  address?: string;
  businessHours?: string;
  className?: string;
}

export default function ContactInformation({
  email = "support@sogairways.com",
  phone = "+1 (800) 555-0147",
  address = "SOG Airways International Airport, Worldwide",
  businessHours = "Monday - Sunday, 24 hours",
  className = "",
}: ContactInformationProps) {
  const contactItems = [
    {
      icon: Mail,
      title: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: Phone,
      title: "Phone",
      value: phone,
      href: `tel:${phone}`,
    },
    {
      icon: MapPin,
      title: "Address",
      value: address,
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: businessHours,
    },
  ];

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Contact Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Reach out to the SOG Airways team whenever you need
          assistance.
        </p>
      </div>

      <div className="space-y-5">
        {contactItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-start gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <Icon className="h-5 w-5 text-slate-700" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>

                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-1 block wrap-break-words text-sm font-semibold text-slate-900 transition hover:text-slate-600"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 wrap-break-words text-sm font-semibold text-slate-900">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}