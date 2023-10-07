"use client";

import useSearchModal from "@/app/hooks/useSearchModal";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Modal from "./Modal";

const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [step, setStep] = useState(0);
  const [selectedLocation, setSelectedLocation] =
    useState<CountrySelectValue>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const Map = useMemo(
    () => dynamic(() => import("../Map"), { ssr: false }),
    [selectedLocation]
  );

  const location = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you wanna go?"
        subtitle="Find the perfect location!"
      />
      <CountrySelect value={selectedLocation} onChange={setSelectedLocation} />
      <hr />
      <div className="h-[35vh]">
        <Map center={selectedLocation?.latlng} />
      </div>
    </div>
  );

  const date = (
    <div className="flex flex-col gap-8">
      <Heading
        title="When do you plan to go?"
        subtitle="Make sure everyone is free!"
      />
      <Calendar
        value={dateRange}
        onChange={(value) => setDateRange(value.selection)}
      />
    </div>
  );

  const info = (
    <div className="flex flex-col gap-8">
      <Heading title="More information" subtitle="Find your perfect place!" />
      <Counter
        title="Guests"
        subtitle="How many guests are coming?"
        value={guestCount}
        onChange={setGuestCount}
      />
      <hr />
      <Counter
        title="Rooms"
        subtitle="How many rooms do you need?"
        value={roomCount}
        onChange={setRoomCount}
      />
      <hr />
      <Counter
        title="Bathrooms"
        subtitle="How many bathrooms do you need?"
        value={bathroomCount}
        onChange={setBathroomCount}
      />
    </div>
  );

  const steps = [location, date, info];

  const actionLabel = useMemo(
    () => (step === steps?.length - 1 ? "Search" : "Next"),
    [step, steps?.length]
  );
  const secondaryActionLabel = useMemo(
    () => (step === 0 ? undefined : "Back"),
    [step]
  );

  const onBack = useCallback(() => setStep((prev) => prev - 1), []);
  const onNext = useCallback(() => setStep((prev) => prev + 1), []);
  const onSubmit = useCallback(async () => {
    const currentQuery = params ? qs.parse(params.toString()) : {};
    const updatedQuery = {
      ...currentQuery,
      locationValue: selectedLocation?.value,
      guestCount,
      roomCount,
      bathroomCount,
      startDate: dateRange?.startDate?.toISOString(),
      endDate: dateRange?.endDate?.toISOString(),
    };

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(0);

    searchModal.onClose();
    router.push(url);
  }, [
    searchModal,
    selectedLocation,
    router,
    guestCount,
    roomCount,
    bathroomCount,
    dateRange,
    params,
  ]);

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      title="Filters"
      onSubmit={step < steps.length - 1 ? onNext : onSubmit}
      actionLabel={actionLabel}
      secondaryAction={step === 0 ? undefined : onBack}
      secondaryActionLabel={secondaryActionLabel}
      body={steps[step]}
    />
  );
};

export default SearchModal;
