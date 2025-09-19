import { Box, ListItemButton } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";
import FollowSwitch from "./FollowSwitch";
import { useApp } from "../AppProvider";

export default function UserList({ likeLists, title }) {
    const navigate = useNavigate();

    const { auth } = useApp();
    return (
        <Box>
            <Typography variant="h4" sx={{ textAlign: "center" }}>
                {title}
            </Typography>
            <List
                sx={{
                    width: "100%",
                    maxWidth: "content",
                    bgcolor: "background.paper",
                }}
            >
                {likeLists.map(likeList => (
                    <Box
                        key={likeList.actor.name}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <ListItemButton
                            onClick={() => {
                                navigate(`/users/${likeList.actorId}`);
                            }}
                        >
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={likeList.actor.name}
                                    secondary={likeList.actor.bio}
                                />
                            </ListItem>
                        </ListItemButton>
                        <Box>
                            <FollowSwitch
                                aPersonWhoGotFollowedId={likeList.actorId}
                                isFollowing={likeList.actor.followers?.some(
                                    f => f.aPersonWhoFollowId === auth?.id
                                )}
                            />
                        </Box>
                    </Box>
                ))}
            </List>
        </Box>
    );
}
