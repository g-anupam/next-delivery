"use client";

import { Suspense } from "react";
import OrderSuccessInner from "./success-inner";

export default function Wrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessInner />
    </Suspense>
  );
}
