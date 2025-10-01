"use client";
import { useRef, useState, useEffect } from "react";

import styles from "./audio.module.css";
import Image from "next/image";
import { useZIndex } from "@/contexts/ZIndexContext";

export default function About({ onClose }: { onClose: () => void }) {
    const boxRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isClosing, setIsClosing] = useState(false);
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
        if (boxRef.current) {
            const newZIndex = getNextZIndex();
            boxRef.current.style.zIndex = newZIndex.toString();
        }
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose?.();
            setIsClosing(false);
        }, 200); // Match the animation duration
    };

    return (
        <div ref={boxRef} onMouseDown={() => {
            // Bring this component to front
            const newZIndex = getNextZIndex();
            boxRef.current && (boxRef.current.style.zIndex = newZIndex.toString());
        }} className={`${styles.container} ${isClosing ? styles.closing : ''}`}>
            <div
                onMouseDown={handleMouseDown}
                className={`${styles.nav} ${isDragging ? styles.grabbing : ""}`}
            >
                <Image src={"/txt.webp"} alt="Logo" width={20} height={20} />
                <h2 className={styles.title}>audio_transcript.txt</h2>
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
                <div className={styles.about}>
                    <h2>[RECORDING – PARTIALLY CORRUPTED]</h2>
                    <p>Voice 1 (Male): "Meet me at the café near the ...[static]... 9:30 pm. Don’t be late." </p>
                    <p>Voice 2 (Unclear): "And what about the journalist?"  </p>
                    <p>Voice 1 (Male): "He’ll be taken care of. No one will know. – Aziz"</p>
                </div>
            </div>
        </div>
    );
}
