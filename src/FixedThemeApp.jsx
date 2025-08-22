import Header from "./components/Header";

import { Container } from "@mui/material";

import AppDrawer from "./components/AppDrawer";
import { Outlet } from "react-router";

export default function FixedThemeApp() {
    return (
        <div>
            <Header />
            <AppDrawer />
            <Container sx={{ mt: 4 }} maxWidth="sm">
                {/* {showForm && <Form add={add} />}
                {posts.map(post => (
                    <Item key={post.id} post={post} remove={remove} /> 
                ))} */}
                <Outlet />
            </Container>
        </div>
    );
}
