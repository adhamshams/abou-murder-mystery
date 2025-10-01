"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import styles from "./murderer.module.css";
import Image from "next/image";
import { useZIndex } from "@/contexts/ZIndexContext";

export default function Murderer() {
    const boxRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [visible, setVisible] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isClosing, setIsClosing] = useState(false);
    const { getNextZIndex } = useZIndex();
    const router = useRouter();

    const suspects = [
        {
            id: "salma",
            name: "Dr. Salma Naguib",
            occupation: "Archaeology Professor",
            avatar: "/salma.jpeg",
            isCorrect: false
        },
        {
            id: "youssef",
            name: "Youssef Farouk",
            occupation: "CEO, NileSoft Solutions",
            avatar: "/youssef.jpeg",
            isCorrect: false
        },
        {
            id: "layla",
            name: "Layla Hassan",
            occupation: "Lawyer",
            avatar: "/layla.jpeg",
            isCorrect: false
        },
        {
            id: "mahmoud",
            name: "Colonel Mahmoud Aziz (Ret.)",
            occupation: "Retired Police Officer",
            avatar: "/aziz.jpg",
            isCorrect: true
        }
    ];

    const handleSuspectSelect = (suspect: typeof suspects[0]) => {
        if (suspect.isCorrect) {
            router.push('/wheel');
        } else {
            alert(`❌ Incorrect! ${suspect.name} is not the murderer. Try again!`);
        }
    };

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
            setVisible(false);
            setIsClosing(false);
        }, 200); // Match the animation duration
    };

    return (
        <div>
            <div className={styles.icon} onClick={() => setVisible(true)}>
                <Image src={"/murderer.png"} alt="Logo" width={45} height={45} />
                <h2>Choose Suspect</h2>
            </div>
            {visible && (
                <div ref={boxRef} onMouseDown={() => {
                    // Bring this component to front
                    const newZIndex = getNextZIndex();
                    boxRef.current && (boxRef.current.style.zIndex = newZIndex.toString());
                }} className={`${styles.container} ${isClosing ? styles.closing : ''}`}>
                    <div
                        onMouseDown={handleMouseDown}
                        className={`${styles.nav} ${isDragging ? styles.grabbing : ""}`}
                    >
                        <Image src={"/murderer.png"} alt="Logo" width={20} height={20} />
                        <h2 className={styles.title}>Choose Suspect</h2>
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
                        <div className={styles.suspectsGrid}>
                            {suspects.map((suspect) => (
                                <div 
                                    key={suspect.id}
                                    className={styles.suspectCard}
                                    onClick={() => handleSuspectSelect(suspect)}
                                >
                                    <div className={styles.suspectImage}>
                                        <Image src={`${suspect.avatar}`} alt={suspect.name} width={100} height={100} className={styles.avatar} />
                                    </div>
                                    <div className={styles.suspectInfo}>
                                        <h3 className={styles.suspectName}>{suspect.name}</h3>
                                        <p className={styles.suspectOccupation}>{suspect.occupation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.instructions}>
                            <p>🔍 Click on a suspect to make your accusation</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
