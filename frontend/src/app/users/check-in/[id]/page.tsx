import CheckInPageClient from "@/components/user/check-in/CheckInPageClient";

interface CheckInPageProps {
params: Promise<{
id: string;
}>;
}

export default async function CheckInPage({
params,
}: CheckInPageProps) {
const { id } = await params;

return <CheckInPageClient bookingId={decodeURIComponent(id)} />;
}
