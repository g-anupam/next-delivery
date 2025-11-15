"use client";

import { Suspense } from "react";
import PaymentInner from "./payment-inner";

export default function PaymentPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentInner />
    </Suspense>
  );
}
