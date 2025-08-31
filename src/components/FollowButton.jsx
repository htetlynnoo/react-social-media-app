import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../AppProvider";

import { unfollowUser, followUser } from "../../libs/fetcher";

export default function FollowButton({ aPersonWhoGotFollowedId, isFollowing }) {
    const { auth } = useApp();
    const queryClient = useQueryClient();

    const { mutate: follow, isLoading: isFollowLoading } = useMutation({
        mutationFn: () => followUser(aPersonWhoGotFollowedId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user", aPersonWhoGotFollowedId.toString()],
            });
        },
    });

    const { mutate: unfollow, isLoading: isUnfollowLoading } = useMutation({
        mutationFn: () => unfollowUser(aPersonWhoGotFollowedId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user", aPersonWhoGotFollowedId.toString()],
            });
        },
    });

    if (!auth || auth.id === aPersonWhoGotFollowedId) return null;

    const isLoading = isFollowLoading || isUnfollowLoading;

    return (
        <Button
            variant={isFollowing ? "outlined" : "contained"}
            onClick={() => {
                if (isFollowing) {
                    unfollow(aPersonWhoGotFollowedId);
                } else {
                    follow(aPersonWhoGotFollowedId);
                }
            }}
            disabled={isLoading}
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    );
}
