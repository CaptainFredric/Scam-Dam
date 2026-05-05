import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CasePage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/cases/${id}/timeline`);
}
