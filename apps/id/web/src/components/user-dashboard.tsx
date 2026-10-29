"use client";

import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "@/components/ThemeToggle";
import { signOut } from "@/lib/auth-actions";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Code2,
  LogOut,
  ShieldCheck,
  User,
  KeyRound,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Calendar,
  Mail,
  Fingerprint,
  Zap,
} from "lucide-react";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  provider: string;
  createdAt?: string;
}

interface UserDashboardProps {
  user: DashboardUser;
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs font-mono text-sm">
                V
              </div>
              <span className="text-sm font-semibold">VNTEZ ID</span>
            </Link>
            <span className="text-muted-foreground/40 hidden sm:inline">/</span>
            <Badge variant="outline" size="sm" className="hidden sm:inline-flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Đã đăng nhập
            </Badge>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link href="/developers">
                <Code2 className="h-3.5 w-3.5 text-primary" />
                <span>Developer Hub</span>
              </Link>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{isLoggingOut ? "Đang thoát..." : "Đăng xuất"}</span>
            </Button>

            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl mx-auto space-y-6">
          {/* Welcome Card with Shadcn */}
          <Card className="border-border shadow-md">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                {/* User Avatar */}
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-16 w-16 rounded-full border-2 border-border object-cover shadow-xs shrink-0"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary text-2xl font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Badge variant="success" size="sm" className="gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Xác thực thành công
                    </Badge>
                    <Badge variant="secondary" size="sm" className="uppercase font-mono">
                      {user.provider}
                    </Badge>
                  </div>

                  <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Xin chào, {user.name}!
                  </CardTitle>
                  <CardDescription className="text-sm truncate">
                    {user.email || "Tài khoản VNTEZ ID"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/developers"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/70 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                      <Code2 className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-foreground">Developer Hub</div>
                      <div className="text-[11px] text-muted-foreground">Quản lý OAuth Clients</div>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>

                <Link
                  href="/developers"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/70 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-105 transition-transform">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-foreground">Hạ tầng Edge SSO</div>
                      <div className="text-[11px] text-muted-foreground">Cloudflare Global Network</div>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              </div>

              {/* Account Details Box */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-3 text-xs">
                <div className="text-xs font-semibold text-foreground/90 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Thông tin phiên làm việc
                </div>

                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center justify-between py-1 border-b border-border">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Email
                    </span>
                    <span className="font-mono text-foreground font-medium">{user.email || "—"}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border">
                    <span className="flex items-center gap-1.5">
                      <Fingerprint className="h-3.5 w-3.5" /> User ID
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-foreground">
                      <span className="max-w-[140px] sm:max-w-[180px] truncate">{user.id}</span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={copyUserId}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        title="Copy User ID"
                      >
                        {copiedId ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Identity Provider
                    </span>
                    <span className="capitalize text-foreground font-medium">{user.provider}</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <p className="text-[11px] text-muted-foreground text-center sm:text-left leading-relaxed w-full">
                💡 Cổng định danh trung tâm VNTEZ ID bảo vệ tài khoản và phiên làm việc của bạn trên toàn bộ ứng dụng trong hệ sinh thái.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-2 px-4">
          <p>© {new Date().getFullYear()} VNTEZ ID — Single Sign-On Platform</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/developers" className="hover:text-foreground transition-colors">
              Developers
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Điều khoản
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Bảo mật
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
