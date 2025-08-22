import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../AppProvider";

import { unfollowUser, followUser } from "../../libs/fetcher";

export default function FollowButton({ userId, isFollowing }) {
    const { auth } = useApp();
    const queryClient = useQueryClient();

    const { mutate: follow, isLoading: isFollowLoading } = useMutation({
        mutationFn: followUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user", userId.toString()],
            });
        },
    });

    const { mutate: unfollow, isLoading: isUnfollowLoading } = useMutation({
        mutationFn: unfollowUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user", userId.toString()],
            });
        },
    });

    if (!auth || auth.id === userId) return null;

    const isLoading = isFollowLoading || isUnfollowLoading;

    return (
        <Button
            variant={isFollowing ? "outlined" : "contained"}
            onClick={() => {
                if (isFollowing) {
                    unfollow(userId);
                } else {
                    follow(userId);
                }
            }}
            disabled={isLoading}
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    );
}
