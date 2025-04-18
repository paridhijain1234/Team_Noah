"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
  delay: number
}

export default function FeatureCard({ title, description, icon, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 group"
    >
      <div className="bg-gray-700 rounded-xl p-4 inline-block mb-4 group-hover:bg-yellow-400/10 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors duration-300">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  )
}
