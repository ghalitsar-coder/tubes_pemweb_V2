import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Welcome({ auth }: PageProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="TaskFlow - Modern Project Management" />
            <div className="font-sans antialiased text-gray-800">
                {/* Navigation */}
                <nav className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 flex items-center">
                                    <i className="fas fa-tasks text-indigo-600 text-2xl mr-2"></i>
                                    <span className="text-xl font-bold text-indigo-600">
                                        TaskFlow
                                    </span>
                                </div>
                            </div>
                            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
                                <a
                                    href="#features"
                                    className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                                >
                                    Features
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                                >
                                    How It Works
                                </a>
                                <a
                                    href="#pricing"
                                    className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                                >
                                    Pricing
                                </a>
                                <a
                                    href="#contact"
                                    className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                                >
                                    Contact
                                </a>
                            </div>
                            <div className="flex items-center">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Sign up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700">
                    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Streamline Your Projects with TaskFlow
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-xl text-indigo-100">
                            The all-in-one project management solution that
                            combines the best of Jira and Trello with powerful
                            analytics and team collaboration.
                        </p>
                        <div className="mt-10 flex justify-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50"
                                >
                                    Get Started
                                </Link>
                            ) : (
                                <Link
                                    href={route("register")}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50"
                                >
                                    Get Started
                                </Link>
                            )}
                            <a
                                href="#"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70"
                            >
                                Watch Demo
                            </a>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                                Features
                            </h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Everything your team needs in one place
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                                TaskFlow provides a comprehensive set of tools
                                to manage projects from start to finish.
                            </p>
                        </div>

                        <div className="mt-20">
                            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                                {/* Kanban Boards */}
                                <div className="pt-6">
                                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                        <div className="-mt-6">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 inline-flex items-center justify-center p-3 rounded-md shadow-lg text-white">
                                                <i className="fas fa-columns text-xl"></i>
                                            </div>
                                            <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                                Kanban Boards
                                            </h3>
                                            <p className="mt-5 text-base text-gray-500">
                                                Visualize your workflow with
                                                customizable boards. Drag and
                                                drop tasks between columns to
                                                track progress.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Task Management */}
                                <div className="pt-6">
                                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                        <div className="-mt-6">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 inline-flex items-center justify-center p-3 rounded-md shadow-lg text-white">
                                                <i className="fas fa-tasks text-xl"></i>
                                            </div>
                                            <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                                Task Management
                                            </h3>
                                            <p className="mt-5 text-base text-gray-500">
                                                Create, assign, and track tasks
                                                with due dates, priorities, and
                                                dependencies between tasks.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Collaboration */}
                                <div className="pt-6">
                                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                        <div className="-mt-6">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 inline-flex items-center justify-center p-3 rounded-md shadow-lg text-white">
                                                <i className="fas fa-users text-xl"></i>
                                            </div>
                                            <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                                Team Collaboration
                                            </h3>
                                            <p className="mt-5 text-base text-gray-500">
                                                Real-time updates, comments, and
                                                mentions keep everyone on the
                                                same page.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Time Tracking */}
                                <div className="pt-6">
                                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                        <div className="-mt-6">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 inline-flex items-center justify-center p-3 rounded-md shadow-lg text-white">
                                                <i className="fas fa-stopwatch text-xl"></i>
                                            </div>
                                            <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                                Time Tracking
                                            </h3>
                                            <p className="mt-5 text-base text-gray-500">
                                                Track time spent on tasks and
                                                generate reports for better
                                                project estimation.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Analytics */}
                                <div className="pt-6">
                                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                        <div className="-mt-6">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 inline-flex items-center justify-center p-3 rounded-md shadow-lg text-white">
                                                <i className="fas fa-chart-line text-xl"></i>
                                            </div>
                                            <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                                Advanced Analytics
                                            </h3>
                                            <p className="mt-5 text-base text-gray-500">
                                                Get insights into team
                                                performance, project progress,
                                                and bottlenecks.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Integrations */}
                                <div className="pt-6">
                                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                        <div className="-mt-6">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 inline-flex items-center justify-center p-3 rounded-md shadow-lg text-white">
                                                <i className="fas fa-plug text-xl"></i>
                                            </div>
                                            <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                                Integrations
                                            </h3>
                                            <p className="mt-5 text-base text-gray-500">
                                                Connect with Slack, GitHub,
                                                Google Drive, and more to
                                                streamline your workflow.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="how-it-works" className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center mb-12">
                            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                                How It Works
                            </h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Simple yet powerful workflow
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center">
                            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
                                <div className="space-y-8">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                                <span className="text-lg font-bold">
                                                    1
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Create Projects
                                            </h3>
                                            <p className="mt-2 text-base text-gray-500">
                                                Set up projects with custom
                                                workflows, categories, and
                                                permissions for different team
                                                members.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                                <span className="text-lg font-bold">
                                                    2
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Add Tasks
                                            </h3>
                                            <p className="mt-2 text-base text-gray-500">
                                                Break down your project into
                                                tasks with descriptions,
                                                assignees, due dates, and
                                                priorities.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                                <span className="text-lg font-bold">
                                                    3
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Track Progress
                                            </h3>
                                            <p className="mt-2 text-base text-gray-500">
                                                Move tasks through your
                                                workflow, track time, and
                                                collaborate with your team in
                                                real-time.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                                <span className="text-lg font-bold">
                                                    4
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Analyze & Improve
                                            </h3>
                                            <p className="mt-2 text-base text-gray-500">
                                                Use our analytics dashboard to
                                                identify bottlenecks and improve
                                                your processes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 shadow-lg">
                                <div className="mb-4 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-700">
                                        Project Dashboard
                                    </h3>
                                    <div className="flex space-x-2">
                                        <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800">
                                            Active
                                        </span>
                                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                                            On Track
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {/* Backlog Column */}
                                    <div className="bg-gray-100 rounded p-3">
                                        <div className="font-medium text-gray-700 mb-2">
                                            Backlog
                                        </div>
                                        <div className="space-y-3">
                                            <div className="bg-white p-3 rounded shadow-sm border-l-4 border-gray-400">
                                                <div className="text-sm font-medium">
                                                    Design homepage mockup
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        #TASK-101
                                                    </span>
                                                    <div className="flex space-x-1">
                                                        <span className="h-5 w-5 rounded-full bg-purple-300 flex items-center justify-center text-xs">
                                                            JD
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-3 rounded shadow-sm border-l-4 border-yellow-400">
                                                <div className="text-sm font-medium">
                                                    Set up database schema
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        #TASK-102
                                                    </span>
                                                    <div className="flex space-x-1">
                                                        <span className="h-5 w-5 rounded-full bg-blue-300 flex items-center justify-center text-xs">
                                                            AM
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* In Progress Column */}
                                    <div className="bg-gray-100 rounded p-3">
                                        <div className="font-medium text-gray-700 mb-2">
                                            In Progress
                                        </div>
                                        <div className="space-y-3">
                                            <div className="bg-white p-3 rounded shadow-sm border-l-4 border-blue-400">
                                                <div className="text-sm font-medium">
                                                    Implement auth system
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        #TASK-103
                                                    </span>
                                                    <div className="flex space-x-1">
                                                        <span className="h-5 w-5 rounded-full bg-green-300 flex items-center justify-center text-xs">
                                                            SK
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Done Column */}
                                    <div className="bg-gray-100 rounded p-3">
                                        <div className="font-medium text-gray-700 mb-2">
                                            Done
                                        </div>
                                        <div className="space-y-3">
                                            <div className="bg-white p-3 rounded shadow-sm border-l-4 border-green-400 opacity-70">
                                                <div className="text-sm font-medium line-through">
                                                    Project kickoff meeting
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        #TASK-100
                                                    </span>
                                                    <div className="flex space-x-1">
                                                        <span className="h-5 w-5 rounded-full bg-red-300 flex items-center justify-center text-xs">
                                                            TL
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                                    <div>3 tasks completed</div>
                                    <div>4 total tasks</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div id="pricing" className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center mb-12">
                            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                                Pricing
                            </h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Plans that fit your team size
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                                Start for free and upgrade as your team grows.
                            </p>
                        </div>

                        <div className="mt-16 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
                            {/* Free Tier */}
                            <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-200">
                                <div className="p-6">
                                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                                        Free
                                    </h2>
                                    <p className="mt-4 text-sm text-gray-500">
                                        Perfect for individuals and small teams
                                        getting started.
                                    </p>
                                    <p className="mt-8">
                                        <span className="text-4xl font-extrabold text-gray-900">
                                            $0
                                        </span>
                                        <span className="text-base font-medium text-gray-500">
                                            /month
                                        </span>
                                    </p>
                                    {auth.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                                        >
                                            Get started
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route("register")}
                                            className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                                        >
                                            Get started
                                        </Link>
                                    )}
                                </div>
                                <div className="pt-6 pb-8 px-6">
                                    <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                                        What's included
                                    </h3>
                                    <ul className="mt-6 space-y-4">
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Up to 5 team members
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                3 active projects
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Basic task management
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Limited integrations
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Pro Tier */}
                            <div className="relative bg-white border-2 border-indigo-600 rounded-2xl shadow-sm divide-y divide-gray-200">
                                <div className="absolute top-0 inset-x-0 bg-indigo-600 rounded-tl-2xl rounded-tr-2xl py-2 px-6">
                                    <p className="text-xs font-semibold text-white uppercase tracking-wide">
                                        Most popular
                                    </p>
                                </div>
                                <div className="p-6 pt-12">
                                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                                        Pro
                                    </h2>
                                    <p className="mt-4 text-sm text-gray-500">
                                        For growing teams that need more power
                                        and flexibility.
                                    </p>
                                    <p className="mt-8">
                                        <span className="text-4xl font-extrabold text-gray-900">
                                            $12
                                        </span>
                                        <span className="text-base font-medium text-gray-500">
                                            /user/month
                                        </span>
                                    </p>
                                    {auth.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="mt-8 block w-full bg-indigo-600 border border-indigo-600 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-indigo-700"
                                        >
                                            Get started
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route("register")}
                                            className="mt-8 block w-full bg-indigo-600 border border-indigo-600 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-indigo-700"
                                        >
                                            Get started
                                        </Link>
                                    )}
                                </div>
                                <div className="pt-6 pb-8 px-6">
                                    <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                                        What's included
                                    </h3>
                                    <ul className="mt-6 space-y-4">
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Unlimited team members
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Unlimited projects
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Advanced task management
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Time tracking
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Custom workflows
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Priority support
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Enterprise Tier */}
                            <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-200">
                                <div className="p-6">
                                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                                        Enterprise
                                    </h2>
                                    <p className="mt-4 text-sm text-gray-500">
                                        For large organizations with advanced
                                        needs.
                                    </p>
                                    <p className="mt-8">
                                        <span className="text-4xl font-extrabold text-gray-900">
                                            Custom
                                        </span>
                                    </p>
                                    <a
                                        href="#contact"
                                        className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                                    >
                                        Contact sales
                                    </a>
                                </div>
                                <div className="pt-6 pb-8 px-6">
                                    <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                                        What's included
                                    </h3>
                                    <ul className="mt-6 space-y-4">
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                All Pro features
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Single sign-on (SSO)
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Advanced security
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Dedicated account manager
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                On-premise deployment
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-base text-gray-500">
                                                Custom integrations
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="bg-indigo-50 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center mb-12">
                            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                                Testimonials
                            </h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Trusted by teams worldwide
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Testimonial 1 */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                        JD
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-medium text-gray-900">
                                            John Doe
                                        </h4>
                                        <p className="text-gray-500">
                                            CTO at TechCorp
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "TaskFlow has transformed how our
                                    engineering team works. The Kanban boards
                                    and task dependencies have made our sprints
                                    30% more efficient."
                                </p>
                                <div className="mt-4 flex text-yellow-400">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </div>
                            </div>

                            {/* Testimonial 2 */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                        AS
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-medium text-gray-900">
                                            Alice Smith
                                        </h4>
                                        <p className="text-gray-500">
                                            Product Manager at DesignHub
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "We switched from Trello to TaskFlow and
                                    never looked back. The additional features
                                    like time tracking and analytics are
                                    game-changers."
                                </p>
                                <div className="mt-4 flex text-yellow-400">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </div>
                            </div>

                            {/* Testimonial 3 */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                        RJ
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-medium text-gray-900">
                                            Robert Johnson
                                        </h4>
                                        <p className="text-gray-500">
                                            CEO at StartupX
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "As a growing startup, we needed a tool that
                                    could scale with us. TaskFlow's flexibility
                                    and enterprise features made it the perfect
                                    choice."
                                </p>
                                <div className="mt-4 flex text-yellow-400">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star-half-alt"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-indigo-700">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            <span className="block">Ready to dive in?</span>
                            <span className="block text-indigo-200">
                                Start your free trial today.
                            </span>
                        </h2>
                        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                            <div className="inline-flex rounded-md shadow">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                                    >
                                        Get started
                                    </Link>
                                ) : (
                                    <Link
                                        href={route("register")}
                                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                                    >
                                        Get started
                                    </Link>
                                )}
                            </div>
                            <div className="ml-3 inline-flex rounded-md shadow">
                                <a
                                    href="#"
                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 bg-opacity-60 hover:bg-opacity-70"
                                >
                                    Live demo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer id="contact" className="bg-gray-800">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                    Product
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <a
                                            href="#features"
                                            className="text-base text-gray-300 hover:text-white"
                                        >
                                            Features
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#pricing"
                                            className="text-base text-gray-300 hover:text-white"
                                        >
                                            Pricing
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-gray-300 hover:text-white"
                                        >
                                            API
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-gray-300 hover:text-white"
                                        >
                                            Integrations
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                    Resources
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-gray-300 hover:text-white"
                                        >
                                            Documentation
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-gray-300 hover:text-white"
                                        >
                                            Guides
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-gray-300 hover:text-white"
                                        >
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-gray-300 hover:text-white"
                                        >
                                            Community
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                    Company
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-gray-300 hover:text-white"
                                        >
                                            About
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-gray-300 hover:text-white"
                                        >
                                            Careers
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-gray-300 hover:text-white"
                                        >
                                            Privacy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-base text-gray-300 hover:text-white"
                                        >
                                            Terms
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                    Contact
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li className="text-base text-gray-300">
                                        support@taskflow.com
                                    </li>
                                    <li className="text-base text-gray-300">
                                        +1 (555) 123-4567
                                    </li>
                                    <li className="text-base text-gray-300">
                                        123 Main St, San Francisco, CA
                                    </li>
                                    <li className="flex space-x-6 mt-4">
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-gray-300"
                                        >
                                            <i className="fab fa-twitter"></i>
                                        </a>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-gray-300"
                                        >
                                            <i className="fab fa-facebook"></i>
                                        </a>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-gray-300"
                                        >
                                            <i className="fab fa-linkedin"></i>
                                        </a>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-gray-300"
                                        >
                                            <i className="fab fa-github"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 border-t border-gray-700 pt-8">
                            <p className="text-base text-gray-400 text-center">
                                &copy; 2025 TaskFlow, Inc. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
