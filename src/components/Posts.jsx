import { Box, Typography, CircularProgress } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Item from "./Item";
import { fetchPosts, deletePost } from "../../libs/fetcher";

export default function Posts({ type = "latest" }) {
    const queryClient = useQueryClient();
    const queryKey = ["posts", type];

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
        mutationFn: deletePost,
        onMutate: async id => {
            await queryClient.cancelQueries({ queryKey });

            queryClient.setQueryData(queryKey, old => {
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

    return posts.map(post => (
        <Item key={post.id} post={post} remove={remove} />
    ));
}
