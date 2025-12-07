import { ProfileSidebar } from "./components/profile-sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <ProfileSidebar />

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
