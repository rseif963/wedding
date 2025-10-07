"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();

  // Split path and remove empty strings
  const parts = pathname.split("/").filter(Boolean);

  return (
    <nav className="bg-gray-50 py-3 px-1 text-sm text-gray-600">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:underline font-medium text-[#311970]">
            Wedpine
          </Link>
        </li>
        {parts.map((part, index) => {
          const href = "/" + parts.slice(0, index + 1).join("/");
          const isLast = index === parts.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              <span className="mx-1">›</span>
              {isLast ? (
                <span className="text-[#f4b400] font-medium capitalize">
                  {part.replace(/-/g, " ")}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:underline font-medium capitalize"
                >
                  {part.replace(/-/g, " ")}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
