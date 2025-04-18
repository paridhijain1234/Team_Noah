import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/agent">
            <button className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">
              AI Agents
            </button>
          </Link>
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            New Report
          </button>
        </div>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Total Users" />
        <Card title="Monthly Sales" />
        <Card title="Active Sessions" />
      </section>

      {/* Featured section */}
      <section className="grid grid-cols-1 gap-4">
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Master AI Agent System</h2>
          <p className="mb-4">
            Access our powerful AI system that combines multiple specialized
            agents for tasks like summarization, translation, Q&A, analysis, and
            creative content generation.
          </p>
          <Link href="/dashboard/agent">
            <button className="px-4 py-2 rounded bg-white text-purple-800 hover:bg-gray-100">
              Try It Now
            </button>
          </Link>
        </div>
      </section>

      {/* Main panels */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Traffic Overview">{/* <Chart /> */}</Card>
        <Card title="Recent Activity">
          <ul className="divide-y">
            <li className="py-2">User Jane signed up</li>
            <li className="py-2">Order #1234 completed</li>
            <li className="py-2">Server CPU at 75%</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
