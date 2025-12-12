import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default async function LoginPage() {
  const user = await getCurrentUser();

  // If already logged in, redirect based on role
  if (user) {
    if (user.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/account");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
