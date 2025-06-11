import React, { useState, useRef, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { canCommentProjects } from "@/utils/permissions";
import { toast } from "sonner";
import { ProjectComment, User } from "@/types";
import {
    ImageIcon,
    Reply,
    Edit,
    Trash2,
    ChevronDown,
    ChevronUp,
    Clock,
    X,
} from "lucide-react";

interface ProjectCommentsProps {
    projectId: number;
    comments: ProjectComment[] | Record<string, ProjectComment>;
    currentUser: User;
    onCommentsUpdate?: (comments: ProjectComment[]) => void;
}

export function ProjectComments({
    projectId,
    comments: initialComments,
    currentUser,
    onCommentsUpdate,
}: ProjectCommentsProps) {
    // Convert comments object to array if needed
    const commentsArray = Array.isArray(initialComments)
        ? initialComments
        : Object.values(initialComments || {});

    const [comments, setComments] = useState<ProjectComment[]>(commentsArray);
    const [editingComment, setEditingComment] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [expandedComments, setExpandedComments] = useState<Set<number>>(
        new Set()
    );
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [replyImage, setReplyImage] = useState<File | null>(null);
    const [replyImagePreview, setReplyImagePreview] = useState<string | null>(
        null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const replyFileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset } = useForm({
        content: "",
        image: null as File | null,
        parent_id: null as number | null,
    });

    const {
        data: replyData,
        setData: setReplyData,
        post: postReply,
        processing: replyProcessing,
        reset: resetReply,
    } = useForm({
        content: "",
        image: null as File | null,
        parent_id: null as number | null,
    });

    // Sync state with props when comments data changes
    useEffect(() => {
        const commentsArray = Array.isArray(initialComments)
            ? initialComments
            : Object.values(initialComments || {});
        setComments(commentsArray);
    }, [initialComments]);

    const canComment = canCommentProjects(currentUser);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.content.trim() && !data.image) return;

        router.post(
            `/projects/${projectId}/comments`,
            {
                content: data.content,
                image: data.image,
                parent_id: null, // Main comments don't have parent
            },
            {
                onSuccess: () => {
                    reset();
                    setSelectedImage(null);
                    setImagePreview(null);
                    toast.success("Comment added successfully");
                    // Data will be updated by Inertia page refresh
                },
                onError: () => {
                    toast.error("Failed to add comment");
                },
            }
        );
    };

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim() && !replyImage) return;

        router.post(
            `/projects/${projectId}/comments`,
            {
                content: replyContent,
                image: replyImage,
                parent_id: replyingTo,
            },
            {
                onSuccess: () => {
                    setReplyingTo(null);
                    setReplyContent("");
                    setReplyImage(null);
                    setReplyImagePreview(null);
                    toast.success("Reply added successfully");
                    // Data will be updated by Inertia page refresh
                },
                onError: () => {
                    toast.error("Failed to add reply");
                },
            }
        );
    };
    const handleReply = (commentId: number) => {
        setReplyingTo(commentId);
        setReplyContent(""); // Reset reply content
        setReplyImage(null);
        setReplyImagePreview(null);
    };

    const handleEdit = (comment: ProjectComment) => {
        setEditingComment(comment.id);
        setEditContent(comment.content);
    };

    const handleUpdate = (commentId: number) => {
        if (!editContent.trim()) return;
        router.patch(
            `/projects/${projectId}/comments/${commentId}`,
            { content: editContent },
            {
                onSuccess: () => {
                    setEditingComment(null);
                    setEditContent("");
                    toast.success("Comment updated successfully");
                    // Data will be updated by Inertia page refresh
                },
                onError: () => {
                    toast.error("Failed to update comment");
                },
            }
        );
    };

    const handleDelete = (commentId: number) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        router.delete(`/projects/${projectId}/comments/${commentId}`, {
            onSuccess: () => {
                toast.success("Comment deleted successfully");
                // Data will be updated by Inertia page refresh
            },
            onError: () => {
                toast.error("Failed to delete comment");
            },
        });
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                toast.error("Image size must be less than 5MB");
                return;
            }

            setSelectedImage(file);
            setData({ ...data, image: file });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setData({ ...data, image: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleReplyImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                toast.error("Image size must be less than 5MB");
                return;
            }

            setReplyImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setReplyImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeReplyImage = () => {
        setReplyImage(null);
        setReplyImagePreview(null);
        if (replyFileInputRef.current) {
            replyFileInputRef.current.value = "";
        }
    };

    const toggleReplies = (commentId: number) => {
        const newExpanded = new Set(expandedComments);
        if (newExpanded.has(commentId)) {
            newExpanded.delete(commentId);
        } else {
            newExpanded.add(commentId);
        }
        setExpandedComments(newExpanded);
    };

    const renderComment = (comment: ProjectComment, isReply = false) => (
        <div
            key={comment.id}
            className={`flex gap-3 ${isReply ? "ml-8 mt-3" : ""}`}
        >
            <Avatar
                className={`${isReply ? "w-7 h-7" : "w-9 h-9"} flex-shrink-0`}
            >
                <AvatarImage
                    src={
                        comment.user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            comment.user.name
                        )}&background=0ea5e9&color=fff`
                    }
                    alt={comment.user.name}
                />
                <AvatarFallback>
                    {comment.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <p
                                className={`font-medium ${
                                    isReply ? "text-sm" : ""
                                }`}
                            >
                                {comment.user.name}
                            </p>
                            <span
                                className={`text-gray-500 ${
                                    isReply ? "text-xs" : "text-sm"
                                }`}
                                title={comment.formatted_date}
                            >
                                <Clock className="w-3 h-3 inline mr-1" />
                                {comment.time_ago}
                            </span>
                        </div>

                        {comment.user.id === currentUser.id && (
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(comment)}
                                    className="text-xs h-6 px-2"
                                >
                                    <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-xs h-6 px-2 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {editingComment === comment.id ? (
                        <div className="space-y-2">
                            <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="text-sm"
                                rows={2}
                            />
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => handleUpdate(comment.id)}
                                    className="text-xs h-6"
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setEditingComment(null);
                                        setEditContent("");
                                    }}
                                    className="text-xs h-6"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p
                                className={`text-gray-700 ${
                                    isReply ? "text-sm" : ""
                                }`}
                            >
                                {comment.content}
                            </p>

                            {comment.image_path && (
                                <div className="mt-2">
                                    <img
                                        src={comment.image_path}
                                        alt="Comment attachment"
                                        className="max-w-xs rounded-lg cursor-pointer hover:opacity-90"
                                        onClick={() =>
                                            window.open(
                                                comment.image_path,
                                                "_blank"
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-3 mt-1">
                    {canComment && !isReply && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReply(comment.id)}
                            className="text-xs h-6 px-2 text-gray-600"
                        >
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                        </Button>
                    )}

                    {comment.replies &&
                        comment.replies.length > 0 &&
                        !isReply && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleReplies(comment.id)}
                                className="text-xs h-6 px-2 text-gray-600"
                            >
                                {expandedComments.has(comment.id) ? (
                                    <ChevronUp className="w-3 h-3 mr-1" />
                                ) : (
                                    <ChevronDown className="w-3 h-3 mr-1" />
                                )}
                                {comment.replies.length}{" "}
                                {comment.replies.length === 1
                                    ? "reply"
                                    : "replies"}
                            </Button>
                        )}
                </div>
                {/* Replies */}
                {comment.replies &&
                    comment.replies.length > 0 &&
                    !isReply &&
                    expandedComments.has(comment.id) && (
                        <div className="mt-3 space-y-3">
                            {comment.replies.map((reply) =>
                                renderComment(reply, true)
                            )}
                        </div>
                    )}{" "}
                {/* Reply form */}
                {replyingTo === comment.id && (
                    <div className="mt-3">
                        <form
                            onSubmit={handleReplySubmit}
                            className="space-y-3"
                        >
                            <Textarea
                                rows={2}
                                value={replyContent}
                                onChange={(e) =>
                                    setReplyContent(e.target.value)
                                }
                                placeholder={`Reply to ${comment.user.name}...`}
                                className="resize-none text-sm"
                            />

                            {/* Image upload for reply */}
                            <div className="flex items-center gap-2">
                                <Input
                                    ref={replyFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleReplyImageSelect}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        replyFileInputRef.current?.click()
                                    }
                                    className="text-xs"
                                >
                                    <ImageIcon className="w-3 h-3 mr-1" />
                                    Image
                                </Button>

                                {replyImagePreview && (
                                    <div className="relative">
                                        <img
                                            src={replyImagePreview}
                                            alt="Preview"
                                            className="w-16 h-16 object-cover rounded border"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={removeReplyImage}
                                            className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full bg-red-500 text-white hover:bg-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={
                                        replyProcessing ||
                                        (!replyContent.trim() && !replyImage)
                                    }
                                    size="sm"
                                    className="text-xs"
                                >
                                    {replyProcessing
                                        ? "Posting..."
                                        : "Post Reply"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setReplyingTo(null);
                                        setReplyContent("");
                                        setReplyImage(null);
                                        setReplyImagePreview(null);
                                    }}
                                    className="text-xs"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Project Comments
                    <Badge variant="secondary">{comments.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add Comment Form */}
                {canComment && (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Textarea
                            rows={3}
                            value={data.content}
                            onChange={(e) => setData("content", e.target.value)}
                            placeholder="Add a comment to this project..."
                            className="resize-none"
                        />

                        {/* Image upload */}
                        <div className="flex items-center gap-2">
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Add Image
                            </Button>

                            {imagePreview && (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded border"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeImage}
                                        className="absolute -top-1 -right-1 h-6 w-6 p-0 rounded-full bg-red-500 text-white hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={
                                    processing ||
                                    (!data.content.trim() && !data.image)
                                }
                                size="sm"
                            >
                                {processing ? "Posting..." : "Post Comment"}
                            </Button>
                        </div>
                    </form>
                )}{" "}
                {/* Comments List */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {!comments || comments.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        comments.map((comment) => renderComment(comment))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
