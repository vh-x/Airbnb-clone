import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.error();

  const listingId = params?.listingId;
  if (!listingId) throw new Error("Invalid ID");

  const response = await prisma.listing.delete({
    where: { id: listingId, userId: currentUser.id },
  });
  return NextResponse.json(response);
}
