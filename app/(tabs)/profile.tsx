import UserProfile from "@/src/features/auth/screens/UserProfile";
import ScreenScrollWrapper from "@/src/navigation/ScreenScrollWrapper";
import React from "react";

export default function AccountPage() {
  return (
    <ScreenScrollWrapper>
      <UserProfile />
    </ScreenScrollWrapper>
  );
}
