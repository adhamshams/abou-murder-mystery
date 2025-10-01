import styles from "./page.module.css";
import TaskBar from "@/components/task-bar/task-bar";
import Article from "@/components/article/article";
import Evidence from "@/components/evidence/folder";
import { ZIndexProvider } from "@/contexts/ZIndexContext";

import Image from "next/image";

export default function Desktop() {
    return (
        <ZIndexProvider>
            <div className={styles.page}>
                <Image
                    src="/background.jpg"
                    alt="Background"
                    className={styles.backgroundImage}
                    fill
                    loading="eager"
                />
                <Article />
                <Evidence />
                <TaskBar />
            </div>
        </ZIndexProvider>
    );
}
