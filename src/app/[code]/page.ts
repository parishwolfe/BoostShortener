import { redirect, notFound } from "next/navigation";
import prisma from '../../../db/prisma';

export default async function RedirectPage({
  params,
}: {
  params: { code: string };
}) {
  // Await params to satisfy Next.js' dynamic route requirements.
  const { code } = await Promise.resolve(params);

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