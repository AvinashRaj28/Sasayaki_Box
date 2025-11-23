"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const NavbarWrapper = () => {
  const pathname = usePathname();

  // hide navbar on certain paths (like dashboard, sign-in)
  const hideNavbar = pathname.startsWith("/dashboard") || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up") || pathname.startsWith("/verify");
  

  if (hideNavbar) return null;
  return <Navbar />;
};

export default NavbarWrapper;
