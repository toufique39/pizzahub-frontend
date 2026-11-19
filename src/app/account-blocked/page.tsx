import Link from "next/link";

export default function AccountBlockedPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-orange-50 px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-lg sm:p-8">
        <h1 className="text-2xl font-bold text-red-600 sm:text-3xl">
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