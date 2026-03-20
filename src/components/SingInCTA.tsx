'use client';

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SignInCTA() {
  return (
    <div className="mt-4">
      <SignInButton mode="modal">
        <Button 
          variant="glass" 
          className="rounded-full px-8 py-2.5 h-auto text-sm font-semibold tracking-tight"
        >
          Sign in to track progress
        </Button>
      </SignInButton>
    </div>
  );
}