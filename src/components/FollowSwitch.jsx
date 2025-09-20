import { Button, debounce } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser } from "../../libs/fetcher";
import { useApp } from "../AppProvider";

export default function FollowSwitch({
    aPersonWhoGotFollowedId,
    isFollowing,
    debounceQuery,
}) {
    const { auth } = useApp();
    const queryClient = useQueryClient();

    const follow = useMutation({
        mutationFn: () => followUser(aPersonWhoGotFollowedId),

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["LikeLists"] });

            await queryClient.setQueryData(["LikeLists"], old =>
                old?.map(item =>
                    item.actorId === aPersonWhoGotFollowedId
                        ? {
                              ...item,
                              actor: {
                                  ...item.actor,
                                  followers: [
                                      ...(item.actor.followers || []),
                                      { aPersonWhoFollowId: auth.id },
                                  ],
                              },
                          }
                        : item
                )
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user", aPersonWhoGotFollowedId.toString()],
            });
            queryClient.invalidateQueries({
                queryKey: ["LikeLists"],
            });
            queryClient.invalidateQueries({
                queryKey: ["Search Users", debounceQuery],
            });
            queryClient.invalidateQueries({ queryKey: ["Me"] });
        },
    });

    const unFollow = useMutation({
        mutationFn: () => unfollowUser(aPersonWhoGotFollowedId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["LikeLists"] });

            await queryClient.setQueryData(["LikeLists"], old =>
                old?.map(item =>
                    item.actorId === aPersonWhoGotFollowedId
                        ? {
                              ...item,
                              actor: {
                                  ...item.actor,
                                  followers:
                                      item.actor.followers?.filter(
                                          f => f.aPersonWhoFollowId !== auth.id
                                      ) || [],
                              },
                          }
                        : item
                )
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user", aPersonWhoGotFollowedId.toString()],
            });
            queryClient.invalidateQueries({
                queryKey: ["LikeLists"],
            });
            queryClient.invalidateQueries({
                queryKey: ["Search Users", debounceQuery],
            });
            queryClient.invalidateQueries({ queryKey: ["Me"] });
        },
    });
    const isLoading = follow.isLoading || unFollow.isLoading;

    if (!auth || aPersonWhoGotFollowedId === auth.id) return null;
    return (
        <>
            <Button
                variant={isFollowing ? "outlined" : "contained"}
                onClick={() => {
                    if (isFollowing) {
                        unFollow.mutate(aPersonWhoGotFollowedId);
                    } else {
                        follow.mutate(aPersonWhoGotFollowedId);
                    }
                }}
                disabled={isLoading}
            >
                {isFollowing ? "Unfollow " : " Follow"}
            </Button>
        </>
    );
}
