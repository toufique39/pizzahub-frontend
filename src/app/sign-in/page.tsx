import Link from "next/link";
import SignInForm from "@/features/auth/components/sign-in-form";

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#fff8f2] px-4 py-8 sm:px-6 sm:py-12 lg:py-16">

      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-3xl lg:grid-cols-2">

        {/* Left Side */}
        <div className="flex flex-col justify-center bg-gradient-to-br from-red-700 to-orange-500 p-6 text-white sm:p-8 lg:p-12">

          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-xl font-extrabold sm:text-2xl lg:mb-10">
            PizzaHub 🍕
          </Link>

          <h1 className="text-2xl leading-tight font-extrabold sm:text-3xl lg:text-4xl">
            Welcome Back!
            <br />
            Your Pizza Awaits.
          </h1>

          <p className="mt-3 hidden text-sm leading-7 text-orange-50 sm:block lg:mt-5 lg:text-base">
            Sign in to explore delicious pizzas, discover local
            restaurants, and manage your orders.
          </p>

          <p className="mt-10 hidden text-sm text-orange-100 lg:block">
            Fresh flavors. Local restaurants. Delivered with care.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-5 sm:p-8 lg:p-12">

          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Sign In
          </h2>

          <p className="mt-2 mb-6 text-sm text-gray-500 sm:mb-8">
            Access your PizzaHub account.
          </p>

          <SignInForm />

        </div>
      </div>
    </main>
  );
}
