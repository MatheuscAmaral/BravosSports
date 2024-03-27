import Container from "../container";
import Header from "../header";
import Sidebar from "../sidebar";
import { Outlet } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

const Layout = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { authUser } = useContext(AuthContext);

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    authUser(String(user?.externalAccounts.map(u => u.firstName)));

    return (
      <div className="flex bg-gray-50 h-svh font-sans">
        <div className="hidden xl:flex">
          <Sidebar />
        </div>

        <div className="flex flex-col w-full relative">
          <Header />

          <div className="hidden xl:flex absolute top-9 right-6">
            <SignedOut>
              <SignInButton />
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          <Container>
            <Outlet />
          </Container>
        </div>
      </div>
    );
  } else {
    authUser("");
    return window.location.href = "https://closing-penguin-8.accounts.dev/sign-in"
  }
};

export default Layout;
