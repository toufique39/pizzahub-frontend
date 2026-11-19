import CustomerDashboard from "@/features/customers/components/customer-dashboard";

export default function CustomerDashboardPage() {
  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <CustomerDashboard />
      </div>
    </main>
  );
}