import Link from "next/link";
import SignUpForm from "@/features/auth/components/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#fff8f2] px-4 py-8 sm:px-6 sm:py-12 lg:py-16">

      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-3xl lg:grid-cols-2">

        {/* Left Side */}
        <div className="flex flex-col justify-center bg-gradient-to-br from-red-700 to-orange-500 p-6 text-white sm:p-8 lg:p-12">

          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-xl font-extrabold sm:text-2xl lg:mb-10">
            PizzaHub 🍕
          </Link>

          <h1 className="text-2xl leading-tight font-extrabold sm:text-3xl lg:text-4xl">
            Good Pizza.
            <br />
            Great Community.
          </h1>

          <p className="mt-3 hidden text-sm leading-7 text-orange-50 sm:block lg:mt-5 lg:text-base">
            Join PizzaHub to discover amazing local pizza restaurants
            or bring your restaurant to more customers.
          </p>

          <p className="mt-10 hidden text-sm text-orange-100 lg:block">
            Your next favorite pizza is just a few clicks away.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-5 sm:p-8 lg:p-12 [&_button]:h-11 [&_input]:h-10">

          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Create Account
          </h2>

          <p className="mt-2 mb-6 text-sm text-gray-500 sm:mb-7">
            Get started with PizzaHub today.
          </p>

          <SignUpForm />

        </div>
      </div>
    </main>
  );
}
