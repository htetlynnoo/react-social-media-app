import {
    TextField,
    Box,
    Alert,
    ListItemButton,
    Typography,
} from "@mui/material";

import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

import { useQuery } from "@tanstack/react-query";
import { searchFetcher } from "../../libs/fetcher";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

import { useNavigate } from "react-router";
import FollowSwitch from "../components/FollowSwitch";
import { useApp } from "../AppProvider";

export default function Search() {
    const [query, setQuery] = useState("");
    const debounceQuery = useDebounce(query, 500);
    const navigate = useNavigate();
    const { auth } = useApp();

    const { isLoading, isError, error, data } = useQuery({
        queryKey: ["Search Users", debounceQuery],
        queryFn: () => searchFetcher(debounceQuery),
        enabled: !!debounceQuery?.trim(),
    });

    if (isError) {
        return (
            <Box>
                <Alert severity="warning">{error.message}</Alert>
            </Box>
        );
    }

    return (
        <>
            <TextField
                fullWidth={true}
                placeholder="Search User"
                variant="outlined"
                onKeyUp={e => {
                    setQuery(e.target.value);
                }}
            />

            {isLoading ? (
                <Box sx={{ textAlign: "center", mt: 4 }}>Loading...</Box>
            ) : (
                <List>
                    {Array.isArray(data) &&
                        data.map(item => (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <ListItemButton
                                    onClick={() => {
                                        navigate(`/users/${item.id}`);
                                    }}
                                >
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={item.bio}
                                        />
                                    </ListItem>
                                </ListItemButton>
                                <Box>
                                    <FollowSwitch
                                        aPersonWhoGotFollowedId={item.id}
                                        isFollowing={item.followers?.some(
                                            f =>
                                                f.aPersonWhoFollowId ===
                                                auth?.id
                                        )}
                                        debounceQuery={debounceQuery}
                                    />
                                </Box>
                            </Box>
                        ))}

                    {Array.isArray(data) && data.length === 0 && (
                        <Typography
                            color="text.secondary"
                            textAlign="center"
                            sx={{ mt: 2 }}
                        >
                            No users found
                        </Typography>
                    )}
                </List>
            )}
        </>
    );
}
