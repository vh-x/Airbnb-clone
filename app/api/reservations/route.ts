import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { differenceInCalendarDays } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  const body = await request.json();

  const { listingId, startDate, endDate, totalPrice } = body;
  if (!listingId || !startDate || !endDate || !totalPrice)
    return NextResponse.error();

  const pricePerNightFromDb = await prisma.listing
    .findUnique({
      where: { id: listingId },
      select: { price: true },
    })
    .then((res) => res?.price);

  if (!pricePerNightFromDb) return NextResponse.error();

  // Calculate total price from db and compare with total price from request
  const numNights = differenceInCalendarDays(
    new Date(endDate),
    new Date(startDate)
  );
  const totalPriceFromDb = numNights * pricePerNightFromDb;

  if (totalPriceFromDb !== totalPrice) return NextResponse.error();

  const listingAndReservation = await prisma.listing.update({
    where: { id: listingId },
    data: {
      reservations: {
        create: { userId: currentUser.id, startDate, endDate, totalPrice },
      },
    },
  });

  return NextResponse.json(listingAndReservation);
}
