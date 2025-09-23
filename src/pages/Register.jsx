import { useForm } from "react-hook-form";
import { Box, Typography, OutlinedInput, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { postUser } from "../../libs/fetcher";
import { useApp } from "../AppProvider";

export default function Register() {
    const navigate = useNavigate();

    const { setGlobalMessage, globalMessage } = useApp();

    const {
        register,
        handleSubmit,

        formState: { errors },
    } = useForm();

    const create = useMutation({
        mutationFn: postUser,
        onSuccess: data => {
            console.log("Returned data:", data);

            navigate("/Login");
        },
        onError: error => {
            setGlobalMessage(error.message);

            console.log("Error message:", error.message);
        },
    });

    const submitRegister = data => {
        console.log(data);
        create.mutate(data);
    };

    return (
        <Box>
            <Typography variant="h3">Register</Typography>
            <form onSubmit={handleSubmit(submitRegister)}>
                <OutlinedInput
                    fullWidth
                    placeholder="name"
                    {...register("name", { required: true })}
                    sx={{ mt: 2 }}
                />
                {errors.name && (
                    <Typography color="error">
                        This field is required
                    </Typography>
                )}
                <OutlinedInput
                    fullWidth
                    placeholder="username"
                    {...register("username", { required: true })}
                    sx={{ mt: 2 }}
                />
                {errors.username && (
                    <Typography color="error">
                        {errors.username.message || "This field is required"}
                    </Typography>
                )}

                <OutlinedInput
                    fullWidth
                    placeholder="bio"
                    {...register("bio")}
                    sx={{ mt: 2 }}
                />

                <OutlinedInput
                    fullWidth
                    type="password"
                    placeholder="password"
                    {...register("password", { required: true })}
                    sx={{ mt: 2 }}
                />
                {errors.password && (
                    <Typography color="error">
                        This field is required
                    </Typography>
                )}
                <Button
                    type="submit"
                    fullWidth
                    sx={{ mt: 2 }}
                    variant="contained"
                >
                    Register
                </Button>
            </form>
        </Box>
    );
}
