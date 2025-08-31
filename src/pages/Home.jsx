import { Box, Tabs, Tab } from "@mui/material";

import { useApp } from "../AppProvider";
import Posts from "../components/Posts";
import Form from "../components/Form";
import { useSearchParams } from "react-router";

//checked

export default function Home() {
    const { auth, showForm } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "latest";

    //Your <Tabs> component expects a valid value ("latest" or "following").
    //If it gets null:

    //The Tabs component won’t know which tab is active.

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
