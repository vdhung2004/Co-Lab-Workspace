// components/admin/Navbar.tsx
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 p-4">
      <div className="text-lg font-semibold">Dashboard</div>
      <Button variant="outline">Logout</Button>
    </header>
  );
}
