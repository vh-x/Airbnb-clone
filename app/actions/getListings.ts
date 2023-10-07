import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params?: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params ?? {};

    const query = {
      ...(userId && { userId }),
      ...(roomCount && { roomCount: { gte: +roomCount } }),
      ...(guestCount && { guestCount: { gte: +guestCount } }),
      ...(bathroomCount && { bathroomCount: { gte: +bathroomCount } }),
      ...(locationValue && { locationValue }),
      ...(startDate &&
        endDate && {
          NOT: {
            reservations: {
              some: {
                OR: [
                  {
                    endDate: { gte: startDate },
                    startDate: { lte: startDate },
                  },
                  {
                    startDate: { lte: endDate },
                    endDate: { gte: endDate },
                  },
                ],
              },
            },
          },
        }),
      ...(category && { category }),
    };

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: { createdAt: "desc" },
    });
    return listings;
  } catch (error: any) {
    throw new Error(error);
  }
}
