import React, { useState } from "react";
import { Searchbar } from "react-native-paper";
import SearchResultsList from "./SearchResultsList";

interface SearchWrapperProps {
  type: "notes" | "ideas";
  children: React.ReactNode;
}

export default function SearchWrapper({ type, children }: SearchWrapperProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ marginBottom: 20 }}
      />

      {searchQuery ? (
        <SearchResultsList type={type} searchQuery={searchQuery} />
      ) : (
        children
      )}
    </>
  );
}
