import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useAuth } from "@workos-inc/authkit-react";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { user, isLoading, signIn, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      signIn({
        state: { returnTo: location },
      });
    }
  }, [isLoading, signIn, user, location]);

  return (
    <>
      <button onClick={() => signOut()}>Sign Out</button>
      <Welcome />
    </>
  );
}
