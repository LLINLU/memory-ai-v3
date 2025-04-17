
import { PaperList } from "./PaperList";

export const SearchResults = () => {
  return (
    <div className="h-full p-4 overflow-auto bg-[#fffdf5]">
      <h3 className="text-xl font-bold mb-4">Research Results</h3>
      <PaperList />
    </div>
  );
};
