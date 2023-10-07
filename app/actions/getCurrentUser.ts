import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/libs/prismadb";
import { getServerSession } from "next-auth/next";

export const getSession = async () => await getServerSession(authOptions);

export default async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session?.user?.email) return null;
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    return currentUser || null;
  } catch (error) {
    return null;
  }
}
