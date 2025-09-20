import {
    Box,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Typography,
} from "@mui/material";

import {
    Home as HomeIcon,
    Person as ProfileIcon,
    PersonAdd as RegisterIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";
import { green } from "@mui/material/colors";
import { useQuery } from "@tanstack/react-query";
import { getMyData } from "../../libs/fetcher";

export default function AppDrawer() {
    const { showDrawer, setShowDrawer, auth, setAuth, setGlobalMessage } =
        useApp();

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const { data: me } = useQuery({
        queryKey: ["Me"],
        queryFn: () => getMyData(token),
    });

    const toggleDrawer = newOpen => () => {
        setShowDrawer(newOpen);
    };

    const DrawerList = (
        <Box
            sx={{ width: 300 }}
            role="presentation"
            onClick={toggleDrawer(false)}
        >
            <Box
                sx={{
                    height: 200,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    gap: 2,
                }}
            >
                {auth ? (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    background: green[500],
                                }}
                            >
                                {me?.name[0] || "?"}
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h6"
                                    onClick={() => {
                                        navigate(`/users/${auth.id}`);
                                    }}
                                    sx={{
                                        cursor: "pointer",
                                    }}
                                >
                                    {me?.name}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontSize: 12 }}
                                    >
                                        {me?._count?.follwers || 0} followers
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontSize: 12 }}
                                    >
                                        {me?._count?.following || 0} following
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    background: green[500],
                                    cursor: "pointer",
                                }}
                                onClick={() =>
                                    setGlobalMessage("Please login first")
                                }
                            >
                                U
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h6"
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                    sx={{ cursor: "pointer" }}
                                >
                                    Unknown
                                </Typography>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/")}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            {auth && (
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => navigate(`/users/${auth.id}`)}
                        >
                            <ListItemIcon>
                                <ProfileIcon />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                setAuth(null);
                                localStorage.removeItem("token");
                            }}
                        >
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            )}

            {!auth && (
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/Register")}>
                            <ListItemIcon>
                                <RegisterIcon />
                            </ListItemIcon>
                            <ListItemText primary="Register" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/Login")}>
                            <ListItemIcon>
                                <LoginIcon />
                            </ListItemIcon>
                            <ListItemText primary="Login" />
                        </ListItemButton>
                    </ListItem>
                </List>
            )}
        </Box>
    );

    return (
        <div>
            <Drawer open={showDrawer} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}
