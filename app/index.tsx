import * as ExpoCrypto from "expo-crypto";
import "react-native-get-random-values";
import RootLayout from "./_layout";

if (typeof globalThis.crypto === "undefined") {
  // @ts-ignore
  globalThis.crypto = ExpoCrypto;
}

export default function Index() {
  return <RootLayout />;
}
