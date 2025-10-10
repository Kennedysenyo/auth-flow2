"use client";

import Link from "next/link";
import styles from "./styles/Header.module.css";
import { useState } from "react";

export const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  return (
    <header className={`${styles.header}`}>
      <Link className={`${styles.logo}`} href="/">
        KSD
      </Link>
      <nav
        className={`${styles.navOverlay} ${isMobileNavOpen && styles.active}`}
      >
        <ul className={`${styles.navList}`}>
          <li>
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
          </li>
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
