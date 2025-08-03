import { redirect, notFound } from "next/navigation";
import prisma from "@/db/prisma";

/**
 * Redirects to the original URL based on the short code.
 * This function is used in the dynamic route to handle redirection.
 *
 * @param props - The props containing parameters from the dynamic route.
 */

type PageProps = {
  params: Promise<{ code: string }>; // Updated type definition
};

export default async function RedirectPage({ params }: PageProps) {
  const { code } = await params;

  // Look up the short link by shortCode (code)
  const link = await prisma.shortLink.findUnique({
    where: { shortCode: code },
  });

  if (!link || !link.isActive) {
    notFound();
  }

  // Increment the click counter
  await prisma.shortLink.update({
    where: { shortCode: code },
    data: { clicks: { increment: 1 } },
  });

  // Redirect immediately to the original URL
  redirect(link.originalUrl);
}