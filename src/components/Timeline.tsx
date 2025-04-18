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
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                How Padhai Buddy Works
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">Simple, intuitive, and designed for the way you study.</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-yellow-500 via-amber-500 to-yellow-400"></div>

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex items-center justify-center md:justify-end md:pr-8 lg:pr-12">
                  <div className="w-full md:w-1/2 rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <div className="mb-4 flex items-center">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-900 text-yellow-400">
                        1
                      </div>
                      <h3 className="text-xl font-bold">Upload Your Study Material</h3>
                    </div>
                    <p className="text-gray-400">
                      Simply upload your lecture notes, textbook chapters, or any study material you want to work with.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 top-6 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex items-center justify-center md:justify-start md:pl-8 lg:pl-12">
                  <div className="w-full md:w-1/2 rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <div className="mb-4 flex items-center">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-900 text-amber-400">
                        2
                      </div>
                      <h3 className="text-xl font-bold">Choose Your Tool</h3>
                    </div>
                    <p className="text-gray-400">
                      Select whether you want to summarize, generate Q&A, enhance your reading, or chat with your AI
                      study buddy.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 top-6 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex items-center justify-center md:justify-end md:pr-8 lg:pr-12">
                  <div className="w-full md:w-1/2 rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <div className="mb-4 flex items-center">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-900 text-yellow-400">
                        3
                      </div>
                      <h3 className="text-xl font-bold">Get Instant Results</h3>
                    </div>
                    <p className="text-gray-400">
                      Our AI processes your request in seconds, delivering high-quality summaries, questions, or
                      responses.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 top-6 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="flex items-center justify-center md:justify-start md:pl-8 lg:pl-12">
                  <div className="w-full md:w-1/2 rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <div className="mb-4 flex items-center">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-900 text-amber-400">
                        4
                      </div>
                      <h3 className="text-xl font-bold">Study Smarter</h3>
                    </div>
                    <p className="text-gray-400">
                      Use the AI-generated content to enhance your understanding, test your knowledge, and improve your
                      grades.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 top-6 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-gray-950 to-gray-950"></div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                What Students Say
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Join thousands of students who are transforming their study habits with Padhai Buddy.
            </p>
          </div>
    </section>
  );
};

export default Timeline;
