"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  link: {
    url: String;
    title: String;
  };
}

const NavLink = ({ link }: NavLinkProps) => {
  const pathname = usePathname();

  return (
    <Link
      className={`rounded p-1 ${
        pathname === link.url && "bg-black text-white"
      }`}
      href={link.url}
    >
      {link.title}
    </Link>
  );
};

export default NavLink;
