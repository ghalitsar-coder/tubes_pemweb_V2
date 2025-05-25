import * as React from "react";
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Settings2,
    Calendar,
    Plus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: FolderKanban,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: CheckSquare,
            plan: "Startup",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "Projects",
            url: "/projects",
            icon: FolderKanban,
            items: [
                {
                    title: "All Projects",
                    url: "/projects",
                },
                {
                    title: "Calendar View",
                    url: "/projects/calendar",
                },
                {
                    title: "Create Project",
                    url: "/projects/create",
                },
            ],
        },
        {
            title: "Tasks",
            url: "/tasks",
            icon: CheckSquare,
            items: [
                {
                    title: "All Tasks",
                    url: "/tasks",
                },
                {
                    title: "Calendar View",
                    url: "/tasks/calendar",
                },
                {
                    title: "Create Task",
                    url: "/tasks/create",
                },
            ],
        },
        {
            title: "Calendar",
            url: "/calendar",
            icon: Calendar,
        },
        {
            title: "Team",
            url: "/team",
            icon: Users,
        },
        {
            title: "Settings",
            url: "/settings",
            icon: Settings2,
            items: [
                {
                    title: "Profile",
                    url: "/profile",
                },
                {
                    title: "Team Settings",
                    url: "/team/settings",
                },
                {
                    title: "Project Settings",
                    url: "/projects/settings",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Active Projects",
            url: "/projects?status=active",
            icon: FolderKanban,
        },
        {
            name: "Completed Projects",
            url: "/projects?status=completed",
            icon: CheckSquare,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
