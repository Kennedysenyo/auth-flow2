"use client";

import Link from "next/link";
import styles from "./styles/Header.module.css";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";

const ROUTES = [
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "About", url: "/about" },
  { name: "Contact", url: "/contact" },
  { name: "Login", url: "/login" },
];

export const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navUl = useRef<HTMLUListElement | null>(null);
  const path = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target !== navUl.current) {
      setIsMobileNavOpen((prev) => !prev);
    }
  };

  const navElements = ROUTES.map((route, i) => (
    <li key={i}>
      <Link
        className={path === route.url ? styles.active : ""}
        href={route.url}
      >
        {route.name}
      </Link>
    </li>
  ));

  return (
    <header className={`${styles.header}`}>
      <Link className={`${styles.logo}`} href="/">
        KSD
      </Link>
      <nav
        onClick={handleClick}
        className={`${styles.navOverlay} ${isMobileNavOpen && styles.active}`}
      >
        <ul ref={navUl} className={`${styles.navList}`}>
          {/* <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/login">Sign In</Link>
          </li> */}

          {navElements}
        </ul>
      </nav>
      <button
        onClick={() => setIsMobileNavOpen((prev) => !prev)}
        className={`${styles.toggleMenuBtn} ${
          isMobileNavOpen && styles.active
        }`}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
};
