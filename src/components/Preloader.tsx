"use client"

import { useState, useEffect, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Preloader({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    const text = "Intelligent Codirefac"
    const letters = text.split("")

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setTimeout(() => setIsLoading(false), 500)
                    return 100
                }
                return prev + 2
            })
        }, 50)

        return () => clearInterval(interval)
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3,
            },
        },
    }

    const letterVariants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    }

    const progressVariants = {
        hidden: { width: 0 },
        visible: {
            width: `${progress}%`,
            transition: {
                duration: 0.3,
                ease: "easeOut",
            },
        },
    }

    return (
        isLoading ? <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                    style={{ backgroundColor: "#2a2a2a" }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Animated Text */}
                    <motion.div className="flex flex-wrap justify-center items-center gap-1 mb-12" variants={containerVariants}>
                        {letters.map((letter, index) => (
                            <motion.span
                                key={index}
                                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white"
                                variants={letterVariants}
                                style={{
                                    fontFamily: "system-ui, -apple-system, sans-serif",
                                }}
                            >
                                {letter === " " ? "\u00A0" : letter}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div
                        className="w-64 md:w-80 h-1 bg-gray-600 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.3 }}
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-red-600 via-purple-900 to-blue-800 rounded-full"
                            variants={progressVariants}
                            initial="hidden"
                            animate="visible"
                        />
                    </motion.div>

                    {/* Progress Percentage */}
                    <motion.div
                        className="mt-4 text-white text-lg font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.3 }}
                    >
                        {progress}%
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence> : <> {children}</>
    )
}
