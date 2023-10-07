"use client";

import useCountries from "@/app/hooks/useCountries";
import useSearchModal from "@/app/hooks/useSearchModal";
import { differenceInDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";

const Search = () => {
  const searchModal = useSearchModal();
  const params = useSearchParams();
  const { getByValue } = useCountries();
  const locationValue = params.get("locationValue");
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  const guestCount = params.get("guestCount");

  const location = useMemo(
    () => (locationValue ? getByValue(locationValue)?.label : "Anywhere"),
    [getByValue, locationValue]
  );
  const duration = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = differenceInDays(end, start);
      return `${diff > 0 ? diff : 1} night${diff > 1 ? "s" : ""}`;
    }
    return "Any week";
  }, [startDate, endDate]);

  const guest = useMemo(
    () =>
      guestCount
        ? `${guestCount} guest${+guestCount > 1 ? "s" : ""}`
        : "Add guests",
    [guestCount]
  );

  return (
    <div
      onClick={searchModal.onOpen}
      className="border w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <div className="text-sm font-semibold px-6">{location}</div>
        <div className="hidden sm:block text-sm font-semibold px-6 border-x flex-1 text-center">
          {duration}
        </div>
        <div className="text-sm pl-6 pr-2 text-gray-600 flex items-center gap-3">
          <div className="hidden sm:block">{guest}</div>
          <div className="p-2 bg-brand rounded-full text-white">
            <BiSearch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
