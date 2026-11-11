import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];

/** Fades + slides children in when they scroll into view (once). */
export function Reveal({ children, delay = 0, y = 24, as = "div", ...rest }) {
  const Comp = motion[as];
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.6, ease, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Container that staggers its <StaggerItem> children as they enter the viewport. */
export function Stagger({ children, gap = 0.06, ...rest }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...rest }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease } },
      }}
      style={{ height: "100%" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Route-level enter animation. */
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
