import { redirect } from "next/navigation";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import EmptyState from "../components/EmptyState";
import ReservationsClient from "./ReservationsClient";

const ReservationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/");

  const reservations = await getReservations({ posterId: currentUser.id });

  if (reservations.length === 0)
    return (
      <EmptyState
        title="No reservations found"
        subtitle="No reservations on your properties yet."
      />
    );

  return (
    <ReservationsClient reservations={reservations} currentUser={currentUser} />
  );
};

export default ReservationsPage;
