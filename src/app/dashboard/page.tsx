import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          New Report
        </button>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Total Users" />
        <Card title="Monthly Sales" />
        <Card title="Active Sessions" />
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
