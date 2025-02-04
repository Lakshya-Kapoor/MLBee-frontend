import { createContext } from "react";

export type SearchContextType = {
  search: boolean;
  setSearch: (search: boolean) => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);
