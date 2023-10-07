"use client";

import { Listing, Reservation, User } from "@prisma/client";
import axios from "axios";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";

interface ReservationWithListing extends Reservation {
  listing: Listing;
}

interface TripsClientProps {
  reservations: ReservationWithListing[];
  currentUser: User;
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const [deletingId, setDeletingId] = useState("");
  const [currentReservations, setCurrentReservations] =
    useState<ReservationWithListing[]>(reservations);

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);
    axios
      .delete(`/api/reservations/${id}`)
      .then(() => {
        toast.success("Reservation cancelled");
        setCurrentReservations((prev) =>
          prev.filter((reservation) => reservation.id !== id)
        );
      })
      .catch((error) =>
        toast.error(error?.response?.data?.error || "Something went wrong")
      )
      .finally(() => setDeletingId(""));
  }, []);

  return currentReservations?.length > 0 ? (
    <Container>
      <div className="pt-8">
        <Heading title="Trips" subtitle="Your reservations" />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-col-6 gap-8">
          {currentReservations.map((reservation) => (
            <ListingCard
              key={reservation.id}
              data={reservation.listing}
              reservation={reservation}
              onAction={onCancel}
              actionLabel="Cancel reservation"
              actionId={reservation.id}
              disabled={deletingId === reservation.id}
              currentUser={currentUser}
            />
          ))}
        </div>
      </div>
    </Container>
  ) : (
    <EmptyState
      title="No trips found"
      subtitle="You have not made any reservations."
    />
  );
};

export default TripsClient;
