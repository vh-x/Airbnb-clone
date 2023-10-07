import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById, { IParams } from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";

interface ListingPageProps {
  params: IParams;
}

const ListingPage = async ({ params }: ListingPageProps) => {
  const listing = await getListingById(params);
  const currentUser = await getCurrentUser();
  const reservations = await getReservations(params);
  return listing ? (
    <ListingClient
      listing={listing}
      currentUser={currentUser}
      reservations={reservations}
    />
  ) : (
    <EmptyState />
  );
};

export default ListingPage;
