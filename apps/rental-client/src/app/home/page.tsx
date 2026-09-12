"use client";

import HomePage from "../../components/HomePage";
import { AuthenticatedRoute } from "../../components/util/AuthenticatedRoute";

export default function Home() {
  return (
    <AuthenticatedRoute>
      <HomePage />
    </AuthenticatedRoute>
  );
}