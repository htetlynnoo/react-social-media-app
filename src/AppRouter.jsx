import { BrowserRouter, Routes, Route } from "react-router";
import FixedThemeApp from "./FixedThemeApp";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Likes from "./pages/Like";
import Noti from "./pages/Noti";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<FixedThemeApp />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/users/:id" element={<Profile />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/posts/:id" element={<Post />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/posts/:id/likes" element={<Likes />} />
                    <Route path="/noti" element={<Noti />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
