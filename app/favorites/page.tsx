import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListings";
import EmptyState from "../components/EmptyState";
import FavoritesClient from "./FavoritesClient";

const FavoritesPage = async () => {
  const listings = await getFavoriteListings();
  const currentUser = await getCurrentUser();

  return listings?.length > 0 && currentUser ? (
    <div>
      <FavoritesClient listings={listings} currentUser={currentUser} />
    </div>
  ) : (
    <EmptyState
      title="No favorites found"
      subtitle="You have not add any listings yet."
    />
  );
};

export default FavoritesPage;
