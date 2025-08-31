import { useRef, useState } from "react";

import { OutlinedInput, IconButton } from "@mui/material";

import { Add as AddIcon } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postPost } from "../../libs/fetcher";

export default function Form() {
    const inputRef = useRef();
    const queryClient = useQueryClient();
    const [file, setFile] = useState(null);

    const add = useMutation({
        mutationFn: postPost,
        onSuccess: async item => {
            await queryClient.invalidateQueries("posts");
            await queryClient.setQueryData(["posts"], old => {
                return [item, ...old];
            });
        },
    });

    return (
        <form
            style={{ marginBottom: 20, display: "flex" }}
            onSubmit={e => {
                e.preventDefault();

                const content = inputRef.current.value;
                if (content || file) {
                    add.mutate({ content, file });
                }

                e.currentTarget.reset();
                setFile(null);
            }}
        >
            <OutlinedInput
                type="text"
                style={{ flexGrow: 1 }}
                inputRef={inputRef}
                endAdornment={
                    <IconButton type="submit">
                        <AddIcon />
                    </IconButton>
                }
                placeholder="What's on your mind?"
            />
            <OutlinedInput
                type="file"
                inputProps={{ accept: "image/*" }}
                onChange={e => setFile(e.target.files[0])}
            />
        </form>
    );

    //2. inputProps={{ accept: "image/*" }}

    ////This tells the file picker to only allow image files (jpg, png, gif, etc.).

    //Without it, the user could pick any file (PDF, MP3, etc.).

    //image/* means: "all image MIME types."
}
