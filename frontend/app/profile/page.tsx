import { PersonalInfoForm } from "./components/personal-info-form";

export default function ProfilePage() {
  const user = {
    fullName: "Nguyễn Văn A",
    email: "a@gmail.com",
    phone: "0123456789",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>
      <PersonalInfoForm user={user} />
    </div>
  );
}
