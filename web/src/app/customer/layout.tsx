"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [customer, setCustomer] = useState<{ id: number; email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Don't check auth on login or register pages
  const isAuthPage = pathname === "/customer/login" || pathname === "/customer/register";

  useEffect(() => {
    if (isAuthPage) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("not authenticated");
        const data = await res.json();
        setCustomer(data.customer);
      })
      .catch(() => {
        router.push("/customer/login?redirect=" + encodeURIComponent(pathname));
      })
      .finally(() => setLoading(false));
  }, [pathname, isAuthPage, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    setCustomer(null);
    router.push("/");
    router.refresh();
  };

  // For auth pages, just render without the nav
  if (isAuthPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Customer nav */}
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-3 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-6">
          <Link
            href="/customer/orders"
            className={`text-sm font-medium transition-colors ${
              pathname === "/customer/orders"
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Mes commandes
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {customer.name || customer.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
