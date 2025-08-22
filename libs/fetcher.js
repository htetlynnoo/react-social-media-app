const api = import.meta.env.VITE_API;

//for form

export async function postPost({ content }) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${api}/posts`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
}

//for posts

export const fetchPosts = async (type = "latest") => {
    const endpoint = type === "following" ? "/posts/following" : "/posts";
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await fetch(`${api}${endpoint}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
};

export const deletePost = async id => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${api}/posts/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to delete post");
    return res.json();
};

//for Item

export const likePost = async postId => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${api}/posts/${postId}/like`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("failed to like post");
    return res.json();
};

export const unlikePost = async postId => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${api}/posts/${postId}/like`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("failed to unlike post");
    return res.json();
};

// for login.jsx

export async function postLogin(data) {
    const res = await fetch(`${api}/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    return res.json(); //data to use so from json to js
}

//for Post.jsx

export const fetchPost = async id => {
    const res = await fetch(`${api}/posts/${id}`);
    if (!res.ok) throw new Error("Failed to fetch post");
    return res.json();
};

//for Profile.jsx

export const fetchUser = async id => {
    const res = await fetch(`${api}/users/${id}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
};

//for Register.jsx

export async function postUser(data) {
    const res = await fetch(`${api}/users`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    return res.json(); //data to use so from json to js
}
//for Search.jsx

export const searchUsers = async query => {
    if (!query) return [];
    const res = await fetch(`${api}/search?q=${query}`);
    if (!res.ok) throw new Error("Failed to search users");
    return res.json();
};

//for CommentForm.jsx

export const createComment = async ({ postId, content }) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${api}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to create comment");
    return res.json();
};

//for followbutton.jsx

export const followUser = async userId => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${api}/users/${userId}/follow`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to follow user");
    return res.json();
};

export const unfollowUser = async userId => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${api}/users/${userId}/follow`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to unfollow user");
    return res.json();
};
