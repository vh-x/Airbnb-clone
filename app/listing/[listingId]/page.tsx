import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById, { IParams } from "@/app/actions/getListingById";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";

interface ListingPageProps {
  params: IParams;
}

const ListingPage = async ({ params }: ListingPageProps) => {
  const listing = await getListingById(params);
  const currentUser = await getCurrentUser();
  return listing ? (
    <ListingClient listing={listing} currentUser={currentUser} />
  ) : (
    <EmptyState />
  );
};

export default ListingPage;
