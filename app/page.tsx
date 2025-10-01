"use client";

import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const correctPassword = "akhenaton"; // You can change this to any password you want

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase().trim() === correctPassword) {
      window.location.href = "/home";
    } else {
      alert("Incorrect password. Try again.");
      setPassword("");
    }
  };
  return (
    <div className={styles.page}>
      <div className={styles.header} />
      <div className={styles.content}>
          <div className={styles.passwordContainer}>
            <div className={styles.passwordPrompt}>
              <Image src="/user.jpeg" alt="locked" width={150} height={150} />
              <h2>User</h2>
              <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={styles.passwordInput}
                  autoFocus
                />
                {/* <button type="submit" className={styles.submitButton}>
                  SUBMIT
                </button> */}
              </form>
            </div>
          </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.turnOffContainer}>
          <Link href="/off">
            <Image src="/power.webp" alt="turn-off" width={35} height={35} />
          </Link>
          <h2>Turn off laptop</h2>
        </div>
        <p>
          Windows 7 ULTRA
        </p>
      </div>
    </div>
  );
}
