"use client";

import Container from "@/app/components/Container";
import ListingReservation from "@/app/components/listings/ListingReservation";
import { categories } from "@/app/components/navbar/Categories";
import useLoginModal from "@/app/hooks/useLoginModal";
import { Listing, Reservation, User } from "@prisma/client";
import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Range } from "react-date-range";
import toast from "react-hot-toast";
import ListingHead from "../../components/listings/LisitingHead";
import ListingInfo from "../../components/listings/LisitingInfo";

interface ListingClientProps {
  listing: Listing & { user: User };
  currentUser?: User | null;
  reservations?: Reservation[];
}

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
  reservations = [],
}) => {
  const {
    id,
    title,
    imageSrc,
    user,
    description,
    roomCount,
    guestCount,
    bathroomCount,
    locationValue,
  } = listing;
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(
    () =>
      reservations.flatMap((reservation) =>
        eachDayOfInterval({
          start: new Date(reservation.startDate),
          end: new Date(reservation.endDate),
        })
      ),
    [reservations]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) return loginModal.onOpen();

    setIsLoading(true);
    axios
      .post(`/api/reservations`, {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing.id,
      })
      .then(() => {
        toast.success("Listing reserved!");
        setDateRange(initialDateRange);
        router.push("/trips");
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      setTotalPrice(
        dayCount && listing.price ? dayCount * listing.price : listing.price
      );
    }
  }, [dateRange, listing.price]);

  const category = useMemo(
    () => categories.find((item) => item.label === listing.category),
    [listing.category]
  );
  return (
    <Container>
      <div className="pt-8 max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={title}
            imageSrc={imageSrc}
            locationValue={locationValue}
            id={id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={user}
              category={category}
              description={description}
              roomCount={roomCount}
              guestCount={guestCount}
              bathroomCount={bathroomCount}
              locationValue={locationValue}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
