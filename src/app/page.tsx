"use client";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  BookOpen,
  FileText,
  Languages,
  HelpCircle,
  BookA,
} from "lucide-react";
import Navbar from "@/components/navbar";
import FeatureCard from "@/components/feature-card";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import Timeline from "@/components/Timeline";

export default function Home() {
  const features = [
    {
      title: "Text Reader",
      description: "Reads the text out loud using AI voice.",
      icon: <BookOpen className="h-10 w-10 text-yellow-500" />,
      delay: 0.1,
    },
    {
      title: "Summarizer",
      description: "Summarizes long text into key points.",
      icon: <FileText className="h-10 w-10 text-yellow-500" />,
      delay: 0.2,
    },
    {
      title: "Translator",
      description: "Translates text into different languages.",
      icon: <Languages className="h-10 w-10 text-yellow-500" />,
      delay: 0.3,
    },
    {
      title: "Q&A Generator",
      description: "Allows you to ask questions about the text.",
      icon: <HelpCircle className="h-10 w-10 text-yellow-500" />,
      delay: 0.4,
    },
    {
      title: "Simplifier",
      description: "Makes complex language easier to understand.",
      icon: <BookA className="h-10 w-10 text-yellow-500" />,
      delay: 0.5,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <motion.h1
              className="text-4xl md:text-6xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Your <span className="text-yellow-400">AI-Powered</span> Study
              Companion
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Padhai Buddy helps you study smarter, not harder. Our AI tools
              make learning more efficient, engaging, and accessible for students of all ages.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-lg px-8 py-6 rounded-full">
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <img
              src="/hero.png"
              alt="Students studying with Padhai Buddy"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-gray-900 py-24 md:py-28 rounded-[3rem] mt-12"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-yellow-400">AI-Powered</span> Features
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover how Padhai Buddy can transform your study experience with
              these powerful tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                delay={feature.delay}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Add spacing before footer */}
      <div className="h-12 md:h-20" />
      <Timeline />
      <Footer />
    </main>
  );
}
