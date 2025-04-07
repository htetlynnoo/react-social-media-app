import { useState, useRef } from "react";
import Header from "./components/Header";
import Item from "./components/Item";
import { Container } from "@mui/material";

import { useApp } from "./AppProvider";
import AppDrawer from "./components/AppDrawer";
import { Outlet } from "react-router";

export default function App() {
    return (
        <div>
            <Header />
            <AppDrawer />
            <Container sx={{ mt: 4 }} maxWidth="md">
                {/* {showForm && <Form add={add} />}
                {posts.map(post => (
                    <Item key={post.id} post={post} remove={remove} /> 
                ))} */}
                <Outlet />
            </Container>
        </div>
    );
}
