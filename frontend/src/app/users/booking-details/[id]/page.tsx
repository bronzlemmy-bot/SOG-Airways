import CustomerBookingDetails from "@/features/booking/components/CustomerBookingDetails";

interface BookingDetailsPageProps {
params: Promise<{
id: string;
}>;
}

export default async function BookingDetailsPage({
params,
}: BookingDetailsPageProps) {
const { id } = await params;

return <CustomerBookingDetails bookingId={id} />;
}
