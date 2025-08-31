const api = import.meta.env.VITE_API;

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

//for form ,photo pr htae yan

/* 
1. let imageUrl = null;

Initialize a variable to store the public URL of the uploaded image.

If no file is selected, it stays null.

2. if (file) { ... }

Only run the upload process if a file exists.

Prevents errors when the user submits just text.

3. const filePath = \public/${Date.now()}-${file.name}`;`

Creates a unique path/filename for Supabase storage.

Date.now() ensures the file name is unique (avoids overwriting files with the same name).

Example result: public/1693473456789-cat.png

4. supabase.storage.from("images").upload(...)
const { error } = await supabase.storage
  .from("images")
  .upload(filePath, file, { cacheControl: "3600", upsert: false });


Uploads the File object to your Supabase bucket named "images".

Options:

cacheControl: "3600" → browser can cache for 1 hour.

upsert: false → do not overwrite if the file already exists.

If there's an error during upload, throw error stops the process.

5. getPublicUrl(filePath)
const { data } = supabase.storage.from("images").getPublicUrl(filePath);
imageUrl = data.publicUrl;


After uploading, this generates a public URL for the file.

Example:

https://ivqftlcvxuobauwqpolb.supabase.co/storage/v1/object/public/images/public/1693473456789-cat.png


Store this URL in imageUrl so you can save it in your database with the post.
File {
  name: "cat.png",
  lastModified: 1725092180000,
  lastModifiedDate: Tue Aug 31 2025 20:36:20 GMT+0630,
  size: 24567,
  type: "image/png",
  webkitRelativePath: ""
}
*/

export async function postPost({ content, file }) {
    let imageUrl = null;

    if (file) {
        const filePath = `public/${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
            .from("images")
            .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (error) throw error;

        const { data } = supabase.storage.from("images").getPublicUrl(filePath);
        imageUrl = data.publicUrl;
    }

    const token = localStorage.getItem("token");
    const res = await fetch(`${api}/posts`, {
        method: "POST",
        body: JSON.stringify({ content, picture: imageUrl }),
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
    const res = await fetch(`${api}/user/register`, {
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

//for followbutton.jsx , sit yan (checked)

export const followUser = async aPersonWhoGotFollowedId => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${api}/users/${aPersonWhoGotFollowedId}/follow`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to follow user");
    return res.json();
};

export const unfollowUser = async aPersonWhoGotFollowedId => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${api}/users/${aPersonWhoGotFollowedId}/follow`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to unfollow user");
    return res.json();
};

//for like
export function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchWithAuth(endpoint, options = {}) {
    const headers = {
        ...getAuthHeaders(),
        ...options.headers,
    };

    const response = await fetch(`${api}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: "An error occurred" }));
        throw new Error(
            error.message ||
                error.msg ||
                `HTTP error! status: ${response.status}`
        );
    }

    return response.json();
}
