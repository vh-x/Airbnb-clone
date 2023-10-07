"use client";

import useRentModal from "@/app/hooks/useRentModal";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Heading from "../Heading";
import CategoryInput from "../inputs/CategoryInput";
import Counter from "../inputs/Counter";
import CountrySelect from "../inputs/CountrySelect";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import { categories } from "../navbar/Categories";
import Modal from "./Modal";

const RentModal = () => {
  const rentModal = useRentModal();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { refresh } = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      location: null,
      title: "",
      description: "",
      imageSrc: "",
      category: "",
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
    },
  });

  const selectedCategory = watch("category");
  const selectedLocation = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");

  const Map = useMemo(
    () => dynamic(() => import("../Map"), { ssr: false }),
    [selectedLocation]
  );

  const setCustomValue = (id: string, value: any) =>
    setValue(id, value, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });

  const onBack = () => setStep((prev) => prev - 1);
  const onNext = () => setStep((prev) => prev + 1);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!isFinalStep) return onNext();

    setIsLoading(true);
    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Listing Created!");
        refresh();
        reset();
        setStep(0);
        rentModal.onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  const isFirstStep = step === 0;
  const isFinalStep = step === 5;

  const secondaryActionLabel = useMemo(
    () => (isFirstStep ? undefined : "Back"),
    [isFirstStep]
  );

  const actionLabel = useMemo(
    () => (isFinalStep ? "Create" : "Next"),
    [isFinalStep]
  );

  const category = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map(({ label, icon }) => (
          <CategoryInput
            key={label}
            onClick={() => setCustomValue("category", label)}
            selected={selectedCategory === label}
            label={label}
            icon={icon}
          />
        ))}
      </div>
    </div>
  );

  const location = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where is your place located?"
        subtitle="Help guests find you!"
      />
      <CountrySelect
        value={selectedLocation}
        onChange={(value) => setCustomValue("location", value)}
      />
      <div className="h-[35vh]">
        <Map center={selectedLocation?.latlng} />
      </div>
    </div>
  );

  const info = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Share some basics about your place."
        subtitle="What amenities do you have?"
      />
      <Counter
        title="Guests"
        subtitle="How many guests do you allow?"
        value={guestCount}
        onChange={(value) => setCustomValue("guestCount", value)}
      />
      <hr />
      <Counter
        title="Rooms"
        subtitle="How many rooms do you allow?"
        value={roomCount}
        onChange={(value) => setCustomValue("roomCount", value)}
      />
      <hr />
      <Counter
        title="Bathrooms"
        subtitle="How many bathrooms do you allow?"
        value={bathroomCount}
        onChange={(value) => setCustomValue("bathroomCount", value)}
      />
      <hr />
    </div>
  );

  const images = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Add some photos of your place."
        subtitle="Show guests what your place looks like!"
      />
      <ImageUpload
        value={imageSrc}
        onChange={(value) => setCustomValue("imageSrc", value)}
      />
    </div>
  );

  const description = (
    <div className="flex flex-col gap-8">
      <Heading
        title="How would you describe your place?"
        subtitle="Short and sweet works best!"
      />
      <Input
        id="title"
        label="Title"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <hr />
      <Input
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const price = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Now, set your price"
        subtitle="How much do you want to charge per night?"
      />
      <Input
        id="price"
        type="number"
        label="Price"
        disabled={isLoading}
        register={register}
        errors={errors}
        formatPrice
        required
      />
    </div>
  );

  const steps = [category, location, info, images, description, price];

  return (
    <Modal
      title="Airbnb your home!"
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryAction={isFirstStep ? undefined : onBack}
      secondaryActionLabel={secondaryActionLabel}
      body={steps[step]}
    />
  );
};

export default RentModal;
