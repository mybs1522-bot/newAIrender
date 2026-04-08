import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTransferToken } from "@/lib/device-auth";
import { redirect } from "next/navigation";
import { CheckCircle2, Palette } from "lucide-react";

interface Props {
  searchParams: Promise<{ state?: string }>;
}

export default async function DesktopReturnPage({ searchParams }: Props) {
  const { state } = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session || !state) redirect("/auth/signin");

  const transferToken = await createTransferToken(state, {
    id: (session.user as { id?: string }).id,
    email: session.user?.email,
    name: session.user?.name,
    image: session.user?.image,
  });

  if (!transferToken) redirect("/auth/signin?error=expired");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Login complete!</h1>
          <p className="text-sm text-muted-foreground">
            You can close this browser tab and return to the desktop app.
          </p>
        </div>

        <div className="rounded-xl border bg-background p-4 text-left space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Signed in as</p>
          <p className="font-medium">{session.user?.name}</p>
          <p className="text-sm text-muted-foreground">{session.user?.email}</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Palette className="h-3.5 w-3.5" />
          Interior Designer AI — switch back to the desktop app
        </div>
      </div>
    </div>
  );
}
