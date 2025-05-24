import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User } from "@/types";
import { formatDate } from "@/lib/utils";
import { Users, Calendar } from "lucide-react";

interface Task {
    id: number;
    title: string;
    status: "todo" | "in_progress" | "completed";
    assigned_to: {
        id: number;
        name: string;
    } | null;
}

interface Project {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    tasks: Task[];
}

interface Props {
    auth: {
        user: User;
    };
    projects: Project[];
}

export default function Index({ auth, projects }: Props) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Projects" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold">My Projects</h1>
                        <Button asChild>
                            <Link href="/projects/create">Create Project</Link>
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => {
                            const completedTasks = project.tasks.filter(
                                (task) => task.status === "completed"
                            ).length;
                            const progress =
                                project.tasks.length > 0
                                    ? Math.round(
                                          (completedTasks /
                                              project.tasks.length) *
                                              100
                                      )
                                    : 0;

                            return (
                                <Card key={project.id}>
                                    <CardHeader>
                                        <CardTitle>{project.name}</CardTitle>
                                        <CardDescription>
                                            {project.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium">
                                                    Progress
                                                </h3>
                                                <Progress
                                                    value={progress}
                                                    className="w-full"
                                                />
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {progress}% Complete (
                                                    {completedTasks} of{" "}
                                                    {project.tasks.length}{" "}
                                                    tasks)
                                                </p>
                                            </div>

                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    <span>
                                                        {formatDate(
                                                            project.start_date
                                                        )}{" "}
                                                        -{" "}
                                                        {formatDate(
                                                            project.end_date
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    <span>
                                                        {
                                                            project.tasks.filter(
                                                                (task) =>
                                                                    task.assigned_to
                                                            ).length
                                                        }{" "}
                                                        Members
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            asChild
                                        >
                                            <Link
                                                href={`/projects/${project.id}`}
                                            >
                                                View Details
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
