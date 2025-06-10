import * as React from "react";
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Settings2,
    Calendar,
    Plus,
    User,
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
import {
    canCreateProject,
    canAssignTasks,
    canManageUsers,
    UserWithPermissions,
} from "@/utils/permissions";

export function AppSidebar({
    user,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    user?: UserWithPermissions;
}) {
    // console.log(`THIS IS user -----`, user);
    // console.log("User permissions:", user?.permissions);
    // console.log("User can object:", user?.can);
    // console.log(
    //     "canCreateProject result:",
    //     user ? canCreateProject(user) : "no user"
    // );

    // Build navigation based on user permissions
    const buildNavigation = () => {
        const navMain = [
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
                    ...(user && canCreateProject(user)
                        ? [
                              {
                                  title: "Create Project",
                                  url: "/projects/create",
                              },
                          ]
                        : []),
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
                    ...(user && canAssignTasks(user)
                        ? [
                              {
                                  title: "Create Task",
                                  url: "/tasks/create",
                              },
                          ]
                        : []),
                ],
            },
            {
                title: "Calendar",
                url: "/calendar",
                icon: Calendar,
            },
            ...(user && canManageUsers(user)
                ? [
                      {
                          title: "Team",
                          url: "/team",
                          icon: Users,
                      },
                  ]
                : []),
            {
                title: "Settings",
                url: "/settings",
                icon: Settings2,
                items: [
                    {
                        title: "Profile",
                        url: "/profile",
                    },
                    ...(user && canManageUsers(user)
                        ? [
                              {
                                  title: "Team Settings",
                                  url: "/team/settings",
                              },
                          ]
                        : []),
                    {
                        title: "Project Settings",
                        url: "/projects/settings",
                    },
                ],
            },
        ];

        return navMain;
    };

    const teams = [
        {
            name: "My Team",
            logo: FolderKanban,
            plan: "Pro",
        },
    ];

    const projects = [
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
    ];

    const userData = user
        ? {
              name: user.name,
              email: user.email,
              avatar: user.avatar || "",
          }
        : {
              name: "Guest",
              email: "",
              avatar: "",
          };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={buildNavigation()} />
                <NavProjects projects={projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
