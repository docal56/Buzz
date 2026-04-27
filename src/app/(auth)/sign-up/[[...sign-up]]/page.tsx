import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return <SignUp fallbackRedirectUrl="/issues" signInUrl="/sign-in" />;
}
