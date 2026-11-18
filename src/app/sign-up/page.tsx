import Link from "next/link";
import SignUpForm from "@/features/auth/components/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8f2] px-4 py-12">

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        {/* Left Side */}
        <div className="flex flex-col justify-center bg-gradient-to-br from-red-700 to-orange-500 p-8 text-white md:p-12">

          <Link href="/" className="mb-10 text-2xl font-extrabold">
            PizzaHub 🍕
          </Link>

          <h1 className="text-4xl font-extrabold leading-tight">
            Good Pizza.
            <br />
            Great Community.
          </h1>

          <p className="mt-5 leading-7 text-orange-50">
            Join PizzaHub to discover amazing local pizza restaurants
            or bring your restaurant to more customers.
          </p>

          <p className="mt-10 text-sm text-orange-100">
            Your next favorite pizza is just a few clicks away.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-6 sm:p-10 md:p-12">

          <h2 className="text-3xl font-bold text-gray-900">
            Create Account
          </h2>

          <p className="mb-7 mt-2 text-sm text-gray-500">
            Get started with PizzaHub today.
          </p>

          <SignUpForm />

        </div>
      </div>
    </main>
  );
}