"use client";

import React, { useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export function OTPInput({ length = 6, value = "", onChange }: OTPInputProps) {
  const [otp, setOTP] = useState(value.split(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    []
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = e.target.value;
    if (newValue.length > 1) return;

    const newOTP = [...otp];
    newOTP[index] = newValue;
    setOTP(newOTP);
    const newOTPString = newOTP.join("");
    if (typeof onChange === "function") {
      onChange(newOTPString);
    }

    // Move to next input if value is entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
    const newOTP = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      newOTP[i] = pastedData[i];
    }

    setOTP(newOTP);
    const newOTPString = newOTP.join("");
    if (typeof onChange === "function") {
      onChange(newOTPString);
    }
    inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          ref={setRef(index)}
          value={otp[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-lg"
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
