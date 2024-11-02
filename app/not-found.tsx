"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ROUTES from "./routes";

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(ROUTES.public.login);
  }, [router]);
  return <></>;
};

export default NotFound;
