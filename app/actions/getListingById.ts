import Prisma from "@/app/libs/prismadb";
export interface IParams {
  listingId?: string;
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;
    const listing = await Prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: true },
    });
    if (!listing) return null;
    return listing;
  } catch (error: any) {
    throw new Error(error);
  }
}
