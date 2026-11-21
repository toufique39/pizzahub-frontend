
import Link from "next/link";
import {
  XCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#fffaf5] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          You cancelled the Premium checkout process. No Premium
          subscription has been activated by this checkout.
        </p>

        <div className="mt-6 rounded-xl bg-orange-50 p-4 text-sm text-orange-800">
          You can return to your subscription page and try again whenever
          you are ready.
        </div>

        <div className="mt-7 grid gap-3">
          <Button  className="bg-orange-600 hover:bg-orange-700">
            <Link href="/vendor/dashboard/subscription">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </Button>

          <Button  variant="outline">
            <Link href="/vendor/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
