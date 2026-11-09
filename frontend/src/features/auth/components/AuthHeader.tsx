"use client";

import { motion } from "framer-motion";

interface AuthHeaderProps {
  title: string;
  description?: string;
}

export default function AuthHeader({
  title,
  description,
}: AuthHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="mb-8 text-center"
    >
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        {title}
      </h1>

      {description && (
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
          {description}
        </p>
      )}
    </motion.div>
  );
}