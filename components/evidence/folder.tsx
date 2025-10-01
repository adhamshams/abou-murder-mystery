"use client";
import { useRef, useState, useEffect } from "react";

import styles from "./folder.module.css";
import Image from "next/image";
import { useZIndex } from "@/contexts/ZIndexContext";
import Thumbnail from "./thumbnail";
import Audio from "./audio";
import Shipping from "./shipping";

export default function BrewBuzz() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { getNextZIndex } = useZIndex();

  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      if (isDragging && boxRef.current) {
        boxRef.current.style.left = `${e.clientX - offset.x}px`;
        boxRef.current.style.top = `${e.clientY - offset.y}px`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  const handleMouseDown = (e: { clientX: number; clientY: number }) => {
    const box = boxRef.current;
    if (!box) return;

    const rect = box.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    if (visible && boxRef.current) {
      const newZIndex = getNextZIndex();
      boxRef.current.style.zIndex = newZIndex.toString();
    }
  }, [visible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      setIsClosing(false);
      setIsAuthenticated(false);
      setPassword("");
      setPasswordError(false);
    }, 200); // Match the animation duration
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "22") {
      setIsAuthenticated(true);
      setShowPasswordPrompt(false);
      setVisible(true);
      setPasswordError(false);
      setPassword("");
    } else {
      setPasswordError(true);
      setPassword("");
    }
  };

  const handleFolderClick = () => {
    if (!isAuthenticated) {
      setShowPasswordPrompt(true);
    } else {
      setVisible(true);
    }
  };

  return (
    <div>
      <div className={styles.icon} onClick={handleFolderClick}>
        <Image src={"/folder.webp"} alt="Logo" width={45} height={45} />
        <h2>Evidence</h2>
      </div>
      
      {showPasswordPrompt && (
        <div className={styles.passwordOverlay}>
          <div className={styles.passwordPrompt}>
            <h3>Enter Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={styles.passwordInput}
                autoFocus
              />
              {passwordError && <p className={styles.error}>Incorrect password!</p>}
              <div className={styles.passwordButtons}>
                <button type="submit" className={styles.submitBtn}>OK</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setPassword("");
                    setPasswordError(false);
                  }}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {visible && isAuthenticated && (
        <div ref={boxRef} onMouseDown={() => {
          // Bring this component to front
          const newZIndex = getNextZIndex();
          boxRef.current && (boxRef.current.style.zIndex = newZIndex.toString());
        }} className={`${styles.container} ${isClosing ? styles.closing : ''}`}>
          <div
            onMouseDown={handleMouseDown}
            className={`${styles.nav} ${isDragging ? styles.grabbing : ""}`}
          >
            <Image src={"/folder.webp"} alt="Logo" width={20} height={20} />
            <h2 className={styles.title}>Evidence</h2>
            <div className={styles.close}
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <Image src={"/exit.webp"} alt="Close" width={25} height={25} />
            </div>
          </div>
          <div className={styles.canvas}>
            <div className={styles.subIcon}
              onClick={(e) => {
                e.stopPropagation();
                setShowThumbnail(true);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <Image src={"/image.webp"} alt="Logo" width={45} height={45} />
              <p>bank_receipt.jpg</p>
            </div>
            <div className={styles.subIcon}
              onClick={(e) => {
                e.stopPropagation();
                setShowAudio(true);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <Image src={"/txt.webp"} alt="Logo" width={45} height={45} />
              <p>audio_transcript.txt</p>
            </div>
            <div className={styles.subIcon}
              onClick={(e) => {
                e.stopPropagation();
                setShowShipping(true);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <Image src={"/txt.webp"} alt="Logo" width={45} height={45} />
              <p>shipping_manifest.txt</p>
            </div>
          </div>
        </div>
      )}
      {showThumbnail && <Thumbnail onClose={() => setShowThumbnail(false)} />}
      {showAudio && <Audio onClose={() => setShowAudio(false)} />}
      {showShipping && <Shipping onClose={() => setShowShipping(false)} />}
    </div>
  );
}
