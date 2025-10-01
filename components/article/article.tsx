"use client";
import { useRef, useState, useEffect } from "react";

import styles from "./article.module.css";
import Image from "next/image";
import { useZIndex } from "@/contexts/ZIndexContext";

export default function Article() {
    const boxRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [visible, setVisible] = useState(false);
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
            setVisible(false);
            setIsClosing(false);
        }, 200); // Match the animation duration
    };

    return (
        <div>
            <div className={styles.icon} onClick={() => setVisible(true)}>
                <Image src={"/txt.webp"} alt="Logo" width={45} height={45} />
                <h2>article_draft.docx</h2>
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
                        <Image src={"/txt.webp"} alt="Logo" width={20} height={20} />
                        <h2 className={styles.title}>article_draft.txt</h2>
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
                            <h2>Wlwoh: Vkdgrzv Ehqhdwk wkh Qloh</h2>
                            <p className={styles.role}>Eb: Rpdub Nkdklo</p>
                            <p>L kdyh iroorzhg wkh wkuhdgv ri wklv vwrub iru prqwkv, dqg wkh wuxwk lv gdunhu wkdq L ihduhg.</p>
                            <p>Gu. Vdopd Qdjaxle, hvwhhphg surihvvr, pdb qrw eh dv lqqrfhqw dv vkh vhhpv. Khu zrun rq dufkdhrorjlfdo hadfdydwlrqv kdyh jlyhq khu dffhvv wr frxqwohvv sulfhohvv duwlidfwv. Uxpruv vxjjhvw vkh kdyh wlhv wr dq lohjdo hadfdydwlrq vpxjjolqj ulqj.</p>
                            <p>Brxvvhi Idurxn, wkh brxqj whfk prjxo, lv klglqj vhfuhwv ehlqg klv vklqb riilfhv dqg frusrudwh vorrjrv. QlohVriw Vroxwlrqv lv pruh wkdq d vwduwxs; lw lv d frqgxlw iru prylqj loolflw ixqgv dqg surwhfwlqj fulplqdov zlwk fbehu vkdgrzv.</p>
                            <p>OdBod Kdvvdq, pb iruphU oryhu, kdyh khu rzq sdvvlrqdo prwlyhv. KhU frqqhfwlrq wr ph pdnhv lw kdug wr eh remhfwlyh, exw L fdqqrw glvplvv wkh zklvshuv wkdw vkh kdyh ehhq lq frqwdfw zlwk wkrvh zkr zdqw ph vlohqfhg.</p>
                            <p>Exw lw lv Frorqho Pdkprxg Dclb zkr dodupv ph wkh prvw. Klv qdph dsshduv djdlq dqg djdlq lq vklsplqj pdqlihvwv, sulydwh vhfxulwb frqwudfwv, dqg erughU uhsrvwv. Wkh Frorqho’v lqioxhqfh uxqv ghs, dqg L ihdu pb lqyhvwljdwlrq pdb kdyh xqfrYhuhg pruh wkdq L fdq kdqgoh.</p>
                            <p>Wkh wuxwk lv dozdbv exulhg lq wkh vwuhhw ri wkh ghdg.</p>
                            <p>- R.N.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
