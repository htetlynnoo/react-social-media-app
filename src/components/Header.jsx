import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Badge,
} from "@mui/material";

import {
    ArrowBack as BackIcon,
    Add as AddIcon,
    Menu as MenuIcon,
    Search as SearchIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { getAllNotiFetcher } from "../../libs/fetcher";

import { useApp } from "../AppProvider";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
    const { auth, showForm, setShowForm, mode, setMode, setShowDrawer } =
        useApp();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { isLoading, isError, error, data } = useQuery({
        queryKey: ["Notifications", auth],
        queryFn: () => getAllNotiFetcher(),
        enabled: !!auth,
    });

    function notiCount() {
        if (!auth) return 0;
        if (isLoading || isError) return 0;

        return data.filter(noti => !noti.read).length;
    }

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    {pathname == "/" ? (
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                setShowDrawer(true);
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            <BackIcon />
                        </IconButton>
                    )}
                    <Typography>SaySth &raquo;</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    {auth && (
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={() => {
                                setShowForm(!showForm);
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    )}
                    <IconButton
                        color="inherit"
                        onClick={() => navigate("/search")}
                        sx={{
                            ml: 1,
                        }}
                    >
                        <SearchIcon />
                    </IconButton>

                    {auth && (
                        <IconButton
                            color="inherit"
                            onClick={() => navigate("/noti")}
                        >
                            <Badge color="error" badgeContent={notiCount()}>
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    )}

                    {mode == "light" ? (
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                setMode("dark");
                            }}
                        >
                            <DarkModeIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                setMode("light");
                            }}
                        >
                            <LightModeIcon />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
