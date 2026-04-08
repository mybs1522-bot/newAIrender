"use client";

import { Home, Wand2, Palette, HelpCircle, LogIn, LogOut, User, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useSubscription } from "@/hooks/use-subscription";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Home",   icon: Home,        href: "/" },
  { title: "Studio", icon: Wand2,       href: "/render" },
  { title: "Help",   icon: HelpCircle,  href: "/help" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { status: subStatus, generationCount, generationLimit, cancelAtPeriodEnd } = useSubscription();
  const isTrialing = subStatus === "trialing";
  const trialExhausted = isTrialing && generationCount >= generationLimit;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background">
                  <Palette className="h-4 w-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">Interior Designer</span>
                  <span className="text-xs text-muted-foreground">AI Studio</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        {cancelAtPeriodEnd && (
          <div className="px-2 pb-1">
            <div className="flex items-center justify-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
              Subscription cancelled
            </div>
          </div>
        )}
        {isTrialing && !cancelAtPeriodEnd && (
          <div className="px-2 pb-1">
            {trialExhausted ? (
              <div className="flex items-center justify-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                <Zap className="h-3 w-3 fill-current" />
                Trial Ends · Active Plan
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1 px-1">
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-500 dark:text-amber-400">
                    <Zap className="h-3 w-3" />
                    Trial renders
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {generationCount}/{generationLimit}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all bg-amber-500"
                    style={{ width: `${Math.min((generationCount / generationLimit) * 100, 100)}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}
        <SidebarMenu>
          {status === "authenticated" && session?.user ? (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg" tooltip={session.user.name ?? "Account"}>
                  <Link href="/settings">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name ?? "User"}
                        width={32}
                        height={32}
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <div className="flex min-w-0 flex-col leading-tight gap-0.5">
                      <span className="truncate text-sm font-medium">{session.user.name}</span>
                      {isTrialing ? (
                        <span className={`truncate text-xs font-medium ${trialExhausted ? "text-destructive" : "text-amber-500 dark:text-amber-400"}`}>
                          {trialExhausted
                            ? "Trial limit reached"
                            : `${generationCount}/${generationLimit} trial renders`}
                        </span>
                      ) : (
                        <span className="truncate text-xs text-muted-foreground">{session.user.email}</span>
                      )}
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Sign out" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Sign in with Google" onClick={() => signIn("google")}>
                <LogIn className="h-4 w-4" />
                <span>Sign in with Google</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
