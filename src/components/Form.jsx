import { useRef } from "react";

import { OutlinedInput, IconButton } from "@mui/material";

import { Add as AddIcon } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postPost } from "../../libs/fetcher";

export default function Form() {
    const inputRef = useRef();
    const queryClient = useQueryClient();

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
                content && add.mutate({ content });

                e.currentTarget.reset();
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
                placeholder="What's on your mind"
            />
        </form>
    );
}
