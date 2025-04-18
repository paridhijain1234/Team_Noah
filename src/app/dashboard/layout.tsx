import { Sidebar } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* <Sidebar /> */}
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">{children}</main>
    </div>
  );
}
