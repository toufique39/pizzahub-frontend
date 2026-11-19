import Link from "next/link";

export default function AccountBlockedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-orange-50 px-4">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-red-600">
          Account Blocked
        </h1>

        <p className="mt-4 text-gray-600">
          Your account has been temporarily blocked.
          Please contact PizzaHub support for assistance.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}