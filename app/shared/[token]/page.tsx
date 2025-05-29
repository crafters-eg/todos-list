"use client"

import { Suspense } from "react";
import SharedTodoImport from "./SharedTodoImport";

export default function SharedTodoPage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <Suspense fallback={<div className="text-center mt-12">Loading...</div>}>
      <SharedTodoImport params={params} />
    </Suspense>
  );
}
