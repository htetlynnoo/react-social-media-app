import {
    Card,
    CardContent,
    Box,
    IconButton,
    Button,
    Typography,
    Avatar,
    ButtonGroup,
    Icon,
} from "@mui/material";

import { useApp } from "../AppProvider";

import { Delete as DeleteIcon } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useNavigate } from "react-router";

import {
    FavoriteBorderOutlined as LikeIcon,
    Favorite as LikedIcon,
    ChatBubbleOutline as CommentIcon,
} from "@mui/icons-material";

const API = "http://localhost:8080";

const likePost = async postId => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/posts/${postId}/like`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("failed to like post");
    return res.json();
};

const unlikePost = async postId => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/posts/${postId}/like`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("failed to unlike post");
    return res.json();
};

export default function Item({ post, remove }) {
    //home ka nay pass lote pay lite tr remove nk post nk ka
    const { auth } = useApp();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const isLiked = post.likes?.some(like => like.userId === auth?.id);

    const { mutate: like } = useMutation({
        mutationFn: likePost,
        onSuccess: () => {
            queryClient.invalidateQueries("posts"); // d mhr d lo lote mha home mhr ll query client shi tl ae dr ko outdated lote pee unlike or like ka nay arr lone detail pyn pay htr tk hr ko update lote pyit lite tr
            queryClient.invalidateQueries("user");
        },
    });

    const { mutate: unlike } = useMutation({
        mutationFn: unlikePost,
        onSuccess: () => {
            queryClient.invalidateQueries("posts");
            queryClient.invalidateQueries("user");
        },
    });

    const handleLike = () => {
        if (!auth) return;

        if (isLiked) {
            unlike(post.id);
        } else {
            like(post.id);
        }
    };
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}
                >
                    <Box sx={{ display: "flex", mb: 2, gap: 2 }}>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                background: blue[500],
                            }}
                            onClick={() => navigate(`/users/${post.user.id}`)}
                        >
                            {post.user.name[0]}
                        </Avatar>
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                cursor: "pointer",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                            onClick={() => navigate(`/users/${post.user.id}`)}
                        >
                            {post.user.name}
                        </Typography>
                    </Box>
                    {auth && auth.id === post.user.id && (
                        <IconButton
                            size="small"
                            onClick={() => remove(post.id)}
                        >
                            <DeleteIcon sx={{ fontSize: "24" }} />
                        </IconButton>
                    )}
                </Box>

                <Typography>{post.content}</Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                        mt: 2,
                    }}
                >
                    <ButtonGroup sx={{ alignItems: "center" }}>
                        <IconButton size="small" onClick={handleLike}>
                            {isLiked ? (
                                <LikedIcon color="error" fontSize="inherit" />
                            ) : (
                                <LikeIcon color="error" fontSize="inherit" />
                            )}
                        </IconButton>
                        <Button variant="text" size="small">
                            {post.likes?.length || 0}
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup sx={{ alignItems: "center" }}>
                        <IconButton
                            size="small"
                            onClick={() => navigate(`/posts/${post.id}`)}
                        >
                            <CommentIcon
                                color="success"
                                sx={{ fontSize: 21 }}
                            />
                        </IconButton>
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => navigate(`/posts/${post.id}`)}
                        >
                            {post.comments?.length || 0}
                        </Button>
                    </ButtonGroup>
                </Box>
            </CardContent>
        </Card>
    );
}
