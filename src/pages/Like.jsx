import { Box, Alert } from "@mui/material";
import UserList from "../components/UserList";
import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { getLikeList } from "../../libs/fetcher";

export default function Likes() {
    const { id } = useParams();
    const {
        isLoading,
        isError,
        data: likeLists,
    } = useQuery({
        queryKey: ["LikeList"],
        queryFn: () => getLikeList(id),
    });

    if (isError) {
        return (
            <Box>
                <Alert severity="warning">{error.message}</Alert>
            </Box>
        );
    }

    if (isLoading) {
        return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
    }

    return (
        <>
            <Box>
                <UserList likeLists={likeLists} title="Likes" />
            </Box>
        </>
    );
}
