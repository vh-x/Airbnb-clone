import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
  userId?: string;
  posterId?: string;
}

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, posterId } = params;

    const query = {
      ...(listingId && { listingId }),
      ...(userId && { userId }),
      ...(posterId && { listing: { userId: posterId } }),
    };

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: { listing: true },
      orderBy: { createdAt: "desc" },
    });

    return reservations;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
}
