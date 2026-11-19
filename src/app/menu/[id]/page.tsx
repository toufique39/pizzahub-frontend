import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import MenuItemDetails from "@/features/menu/components/menu-item-details";

export const instant = false;

interface MenuDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MenuDetailsPage({
  params,
}: MenuDetailsPageProps) {
  const { id } = await params;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.isBlocked) {
    redirect("/account-blocked");
  }

  return (
    <MenuItemDetails
      itemId={id}
      userRole={session.user.role || "customer"}
    />
  );
}