"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Zachte pagina-overgang. Alleen opacity: transforms zouden `position: fixed` in pagina's breken. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
