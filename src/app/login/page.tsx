import { Suspense } from "react";
import LoginPage from "@/components/LoginPage";

export default function Login() {
  return (
    <Suspense fallback={<div className="text-center mt-40">Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
