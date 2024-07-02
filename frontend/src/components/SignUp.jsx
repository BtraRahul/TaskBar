// src/components/SignUp.js
import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => (
  <div>
    <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
  </div>
);

export default SignUpPage;
