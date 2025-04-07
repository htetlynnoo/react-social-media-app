import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Item from "../components/Item";
import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";
import { useApp } from "../AppProvider";
import Posts from "../components/Posts";
import Form from "../components/Form";

export default function Home() {
    const { auth, showForm } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "latest";

    const handleTabChange = (event, newValue) => {
        setSearchParams({ tab: newValue });
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                >
                    <Tab label="Latest" value="latest" />
                    <Tab label="Following" value="following" disabled={!auth} />
                </Tabs>
            </Box>

            {auth && showForm && <Form />}
            <Posts type={tab} />
        </>
    );
}
