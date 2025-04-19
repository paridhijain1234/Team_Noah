// pages/index.tsx
import AutoPipelineRunner from "@/components/AutoPipelineRunner";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">
        Automatic AI Agent Pipeline Demo
      </h1>
      <AutoPipelineRunner />
    </main>
  );
}
