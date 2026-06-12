import { motion } from "motion/react";

const DecorativeRings = () => (
  <div className="z-(--z-background) absolute inset-0 flex justify-center items-center overflow-hidden pointer-events-none">
    <motion.div
      className="absolute flex justify-center items-center"
      animate={{ scale: [0.85, 1.15, 0.85] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="absolute opacity-20 border rounded-full"
          style={{
            width: `${i * 140 + 80}px`,
            height: `${i * 140 + 80}px`,
            boxShadow: `0 0 ${8 + i * 4}px ${2 + i}px rgba(255, 255, 255, 0.15)`,
            filter: `blur(${i * 0.3}px)`,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{
            duration: 20 + i * 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
    <div className="absolute opacity-50 blur-2xl rounded-full w-32 h-32 glass" />
  </div>
);

export default DecorativeRings;
