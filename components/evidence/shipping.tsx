"use client";
import { useRef, useState, useEffect } from "react";

import styles from "./shipping.module.css";
import Image from "next/image";
import { useZIndex } from "@/contexts/ZIndexContext";

export default function Shipping({ onClose }: { onClose: () => void }) {
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
                <h2 className={styles.title}>shipping_manifest.txt</h2>
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
                    <h2>Manifest: Alexandria Port</h2>
                    <p className={styles.role}>Date: 14/09/2025</p>
                    <p>Shipment #3492:</p>
                    <p>Declared Cargo: "Construction Equipment"</p>
                    <p>Destination: Private Warehouse, Giza</p>
                    <p>Consignee: Mahmoud Aziz</p>
                    <p>Notes: Multiple sealed crates. Customs flagged for inspection, then cleared by police credentials.</p>
                </div>
            </div>
        </div>
    );
}
