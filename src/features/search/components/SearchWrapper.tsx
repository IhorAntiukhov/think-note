import { useState } from "react";
import { Searchbar } from "react-native-paper";
import SearchResultsList from "./SearchResultsList";

interface SearchWrapperProps {
  children: React.ReactNode;
}

export default function SearchWrapper({ children }: SearchWrapperProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ marginBottom: 20 }}
      />

      {searchQuery ? <SearchResultsList searchQuery={searchQuery} /> : children}
    </>
  );
}
