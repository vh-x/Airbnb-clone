"use client";

import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import useLoginModal from "@/app/hooks/useLoginModal";
import { Listing, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import ListingHead from "../../components/listings/LisitingHead";
import ListingInfo from "../../components/listings/LisitingInfo";

interface ListingClientProps {
  listing: Listing & { user: User };
  currentUser?: User | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
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
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
