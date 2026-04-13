import { getAllUsage, TRIAL_GENERATION_LIMIT } from "@/lib/usage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap } from "lucide-react";

export const metadata = {
  title: "Admin Panel",
};

export default async function AdminPage() {
  const usageStore = await getAllUsage();

  const users = Object.entries(usageStore)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([email, count]) => ({
      email,
      count,
    }));

  const totalUsers = users.length;
  const totalGenerations = users.reduce((acc, obj) => acc + obj.count, 0);

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Admin</h1>
            <p className="text-muted-foreground text-sm">
              Manage system users and monitor render usage.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-panel-strong border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          <Card className="glass-panel-strong border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Renders Generated
              </CardTitle>
              <Zap className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalGenerations}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-panel-strong overflow-hidden border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">User Generation Tracking</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader className="bg-zinc-100 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="text-center font-semibold">
                  Renders Used
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Trial Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-muted-foreground h-32 text-center"
                  >
                    No active users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow
                    key={u.email}
                    className="group cursor-default transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                  >
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell className="text-center font-semibold">
                      {u.count}
                    </TableCell>
                    <TableCell className="text-right">
                      {u.count >= TRIAL_GENERATION_LIMIT ? (
                        <Badge
                          variant="destructive"
                          className="border-red-200 bg-red-500/10 font-bold text-red-600 hover:bg-red-500/20 dark:border-red-900/50 dark:text-red-400"
                        >
                          Trial Exhausted
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="border-emerald-200 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:border-emerald-900/50 dark:text-emerald-400"
                        >
                          {TRIAL_GENERATION_LIMIT - u.count} left
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
