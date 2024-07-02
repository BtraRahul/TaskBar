// import { Route, Routes } from "react-router-dom";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import DarkMode from "./buttons/DarkMode";
// import Nav from "./components/component/Nav";
import Dashboard from "./pages/Dashboard";
import {
  ClerkProvider,
  RedirectToSignIn,
  // RedirectToSignIn,
  // SignInButton,
  SignedIn,
  SignedOut,
  // UserButton,
} from "@clerk/clerk-react";
// import { Button } from "./components/ui/button";
import Nav from "./components/component/Nav";

// Import your publishable key

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const App = () => {
  return (
    <>
      {/* <Nav /> */}
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <header>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
          <SignedIn>
            <Nav loggedIn={"true"} />
            <Dashboard />
          </SignedIn>
        </header>
        {/* <BrowserRouter>
          <Routes>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route
              path="/"
              element={
                <SignedIn>
                  <Dashboard />
                </SignedIn>
              }
            />
            <Route
              path="*"
              element={
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              }
            />
          </Routes>
        </BrowserRouter> */}
      </ClerkProvider>
      {/* <div className="mx-auto p-3 justify-center pt-20">
        <Dashboard />
      </div> */}
    </>
  );
};

export default App;
