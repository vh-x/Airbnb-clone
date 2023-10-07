"use client";

import { Listing, User } from "@prisma/client";
import axios from "axios";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";

interface PropertiesClientProps {
  properties: Listing[];
  currentUser: User;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  properties,
  currentUser,
}) => {
  const [deletingId, setDeletingId] = useState("");
  const [currentProperties, setCurrentProperties] =
    useState<Listing[]>(properties);

  const onDelete = useCallback((id: string) => {
    setDeletingId(id);
    axios
      .delete(`/api/listings/${id}`)
      .then(() => {
        toast.success("Listing deleted");
        setCurrentProperties((prev) =>
          prev.filter((reservation) => reservation.id !== id)
        );
      })
      .catch((error) =>
        toast.error(error?.response?.data?.error || "Something went wrong")
      )
      .finally(() => setDeletingId(""));
  }, []);

  return currentProperties?.length > 0 ? (
    <Container>
      <Heading title="Properties" subtitle="Your properties" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-col-6 gap-8">
        {currentProperties.map((property) => (
          <ListingCard
            key={property.id}
            data={property}
            onAction={onDelete}
            actionLabel="Delete property"
            actionId={property.id}
            disabled={deletingId === property.id}
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  ) : (
    <EmptyState
      title="No properties found"
      subtitle="You have not listed any properties."
    />
  );
};

export default PropertiesClient;
