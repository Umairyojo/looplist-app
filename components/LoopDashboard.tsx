"use client";

import { useState } from "react";
import {
  Home,
  Plus,
  ListTodo,
  Globe,
  LogOut,
  Search,
  MoreVertical,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function LoopCard({ loop }: { loop: { id: number; title: string; streak: number; status: string } }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="font-semibold">{loop.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
            <DropdownMenuItem>Mark as completed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">{loop.streak}</div>
          <div className="text-sm text-muted-foreground">day streak</div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <StatusBadge status={loop.status} />
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Active":
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
    case "Broken":
      return <Badge variant="destructive">Broken</Badge>;
    case "Completed":
      return (
        <Badge variant="outline" className="border-green-500 text-green-500">
          Completed
        </Badge>
      );
    default:
      return null;
  }
}

const sampleLoops = [
  { id: 1, title: "Daily Meditation", streak: 12, status: "Active" },
  { id: 2, title: "Read 30 Minutes", streak: 5, status: "Active" },
  { id: 3, title: "Morning Workout", streak: 0, status: "Broken" },
  { id: 4, title: "Weekly Review", streak: 8, status: "Active" },
  { id: 5, title: "Learn Spanish", streak: 30, status: "Completed" },
  { id: 6, title: "Drink Water", streak: 15, status: "Active" },
];

export default function LoopDashboard({ onLogout }: { onLogout: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLoops = sampleLoops.filter((loop) =>
    loop.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <Sidebar>
          <SidebarHeader className="flex flex-col gap-2 px-4 py-2">
            <div className="flex items-center gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ListTodo className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold">LoopList</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search loops..."
                className="w-full bg-background pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Plus className="h-4 w-4" />
                      <span>Create Loop</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <ListTodo className="h-4 w-4" />
                      <span>My Loops</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Globe className="h-4 w-4" />
                      <span>Public Boards</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-xl font-semibold">My Loops</h1>
              <div className="flex items-center gap-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Loop
                </Button>
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLoops.map((loop) => (
                <LoopCard key={loop.id} loop={loop} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}