import React from "react";

const steps = [
  {
    id: 1,
    title: "Upload Your Study Material",
    description:
      "Simply upload your lecture notes, textbook chapters, or any study material you want to work with.",
  },
  {
    id: 2,
    title: "Choose Your Tool",
    description:
      "Select whether you want to summarize, generate Q&A, enhance your reading, or chat with your AI study buddy.",
  },
  {
    id: 3,
    title: "Get Instant Results",
    description:
      "Our AI processes your request in seconds, delivering high-quality summaries, questions, or responses.",
  },
  {
    id: 4,
    title: "Study Smarter",
    description:
      "Use the AI-generated content to enhance your understanding, test your knowledge, and improve your grades.",
  },
];

const Timeline = () => {
  return (
    <section className="bg-black text-yellow-400 py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-4">
          How Padhai Buddy Works
        </h2>
        <p className="text-yellow-200 text-sm md:text-base mb-12">
          Simple, intuitive, and designed for the way you study.
        </p>

        <div className="space-y-10">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative border-l-4 pl-6 border-yellow-300 ${
                index % 2 === 0 ? "ml-4" : "mr-4"
              }`}
            >
              <div className="absolute -left-4 top-0 bg-yellow-300 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center">
                {step.id}
              </div>
              <h3 className="text-xl font-semibold text-yellow-200 mb-1">
                {step.title}
              </h3>
              <p className="text-yellow-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
