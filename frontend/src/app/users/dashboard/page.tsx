
import DashboardHero from "@/components/user/dashboard/DashboardHero";
import DashboardStats from "@/components/user/dashboard/DashboardStats";
import QuickActions from "@/components/user/dashboard/QuickActions";
import RecentBookings from "@/components/user/dashboard/RecentBookings";
import TravelSummary from "@/components/user/dashboard/TravelSummary";
import UpcomingTrip from "@/components/user/dashboard/UpcomingTrip";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:space-y-8 lg:px-8 lg:py-8">
        {/* Welcome / hero */}
        <DashboardHero />

        {/* Account statistics */}
        <DashboardStats />

        {/* Quick actions */}
        <QuickActions />

        {/* Upcoming trips */}
        <UpcomingTrip />

        {/* Recent bookings */}
        <RecentBookings />

        {/* Travel history and achievements */}
        <TravelSummary />
      </div>
    </main>
  );
}
