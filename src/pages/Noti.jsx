import {
    Avatar,
    Box,
    Typography,
    Button,
    Badge,
    CircularProgress,
    Alert,
} from "@mui/material";

import {
    Comment as CommentIcon,
    Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllNotiFetcher,
    readingAllNoti,
    readDesireNoti,
} from "../../libs/fetcher";
import { format } from "date-fns";

import { useNavigate } from "react-router";

export default function Noti() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { isLoading, isError, error, data } = useQuery({
        queryKey: ["Notifications"],
        queryFn: () => getAllNotiFetcher(),
    });

    const readAllNotis = useMutation({
        mutationFn: () => readingAllNoti(),
        onMutate: () => {
            queryClient.cancelQueries({ queryKey: ["Notifications"] });
            queryClient.setQueryData(["Notifications"], old => {
                old.map(noti => {
                    noti.read = true;
                    return noti;
                });
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Notifications"] });
        },
    });

    const readNotiYouWant = useMutation({
        mutationFn: id => readDesireNoti(id),
        onMutate: id => {
            queryClient.cancelQueries({ queryKey: ["Notifications"] });
            queryClient.setQueryData(["Notifications"], old =>
                old.map(noti =>
                    noti.id === id ? { ...noti, read: true } : noti
                )
            );
        },
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ["Notifications"] });
            const noti = data;
            navigate(`/posts/${noti.postId}`);
        },
    });

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box>
                <Alert severity="warning">{error.message}</Alert>
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex", // make it a flex container
                    justifyContent: "flex-end", // align items to the end (right)
                    width: "100%", // full width of parent
                    my: 2, // optional margin top
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => readAllNotis.mutate()}
                >
                    Mark all as read
                </Button>
            </Box>

            {data?.map(noti => (
                <Box
                    sx={{
                        width: "100%",
                        p: 2,
                        background: noti.read ? "#90caf8" : "#087fea",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        borderRadius: 1,

                        "&:hover": {
                            transform: "scale(1.02)", // optional scale effect
                        },
                        transition: "all 0.3s ease",
                    }}
                    onClick={() => readNotiYouWant.mutate(Number(noti.id))}
                    key={noti.id}
                >
                    {noti.type === "LIKE" ? (
                        <Badge color="error" badgeContent={<FavoriteIcon />}>
                            <Avatar />
                        </Badge>
                    ) : (
                        <Badge color="primary" badgeContent={<CommentIcon />}>
                            <Avatar />
                        </Badge>
                    )}
                    <Box
                        sx={{
                            display: "flex",
                        }}
                    >
                        <Box
                            sx={{
                                mr: 1,
                            }}
                        >
                            <Typography>{noti.actor.name}</Typography>
                            <small>
                                {format(noti.created, "MMM dd, yyyy")}
                            </small>
                        </Box>
                        <Typography>{noti.content}</Typography>
                    </Box>
                </Box>
            ))}
        </>
    );
}
