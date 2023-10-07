import { redirect } from "next/navigation";
import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";
import EmptyState from "../components/EmptyState";
import PropertiesClient from "./PropertiesClient";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/");

  const properties = await getListings({ userId: currentUser.id });

  if (properties.length === 0)
    return (
      <EmptyState
        title="No properties found"
        subtitle="You have not listed any properties."
      />
    );

  return <PropertiesClient properties={properties} currentUser={currentUser} />;
};

export default PropertiesPage;
