import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createComment } from "../../libs/fetcher";

export default function CommentForm({ postId }) {
    const [content, setContent] = useState("");
    const queryClient = useQueryClient();

    const { mutate: comment, isLoading } = useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
            setContent("");
        },
    });

    const handleSubmit = e => {
        e.preventDefault();
        if (!content.trim()) return;
        comment({ postId, content });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={isLoading}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={!content.trim() || isLoading}
                >
                    {isLoading ? "Commenting..." : "Comment"}
                </Button>
            </Box>
        </Box>
    );
}
