import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string; shareId: string }> },
) {
  const { id: caseId, shareId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  // RLS will additionally reject any UPDATE that doesn't belong to a case
  // owned by the requester, so this is safe even if caseId is spoofed.
  const { error } = await supabase
    .from("case_shares")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", shareId)
    .eq("case_id", caseId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ revoked: true });
}
