import { Box, Typography, CircularProgress } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Item from "./Item";
import { fetchPosts, deletePost } from "../../libs/fetcher";
import { useApp } from "../AppProvider";

export default function Posts({ type = "latest" }) {
    const queryClient = useQueryClient();
    const queryKey = ["posts", type];
    const { isPosting } = useApp();

    const {
        data: posts,
        error,
        isLoading,
    } = useQuery({
        queryKey,
        queryFn: () => fetchPosts(type),
        enabled: type !== "following" || !!localStorage.getItem("token"),
    });

    const { mutate: remove } = useMutation({
        mutationFn: id => deletePost(id),
        onMutate: async id => {
            await queryClient.cancelQueries({ queryKey });

            await queryClient.setQueryData(queryKey, old => {
                return old ? old.filter(post => post.id !== id) : [];
            });
        },
    });

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" textAlign="center" sx={{ mt: 4 }}>
                {error.message}
            </Typography>
        );
    }

    if (!posts?.length) {
        return (
            <Typography
                color="text.secondary"
                textAlign="center"
                sx={{ mt: 4 }}
            >
                {type === "following"
                    ? "No posts from people you follow"
                    : "No posts yet"}
            </Typography>
        );
    }

    return (
        <>
            {isPosting && (
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <CircularProgress size={20} />
                    <Typography>Uploading your post...</Typography>
                </Box>
            )}
            {posts.map(post => (
                <Item key={post.id} post={post} remove={remove} />
            ))}
        </>
    );
}
