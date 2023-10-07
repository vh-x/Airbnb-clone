import { User } from "@prisma/client";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import useLoginModal from "./useLoginModal";

interface IUseFavorite {
  listingId: string;
  currentUser?: User | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const loginModal = useLoginModal();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(
    currentUser?.favoriteIds || []
  );

  const hasFavorited = useMemo(
    () => favoriteIds.includes(listingId),
    [favoriteIds, listingId]
  );

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!currentUser) return loginModal.onOpen();
      try {
        const request = await axios[hasFavorited ? "delete" : "post"](
          `/api/favorites/${listingId}`
        );
        setFavoriteIds(request.data.favoriteIds);
        toast.success("Success");
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
    [currentUser, hasFavorited, listingId, loginModal]
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
