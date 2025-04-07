import { useForm } from "react-hook-form";

import { Box, Typography, OutlinedInput, Button, Alert } from "@mui/material";
import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

async function postLogin(data) {
    const res = await fetch("http://localhost:8080/login", {
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

export default function Login() {
    const { setAuth } = useApp();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,

        formState: { errors },
    } = useForm();

    const login = useMutation({
        mutationFn: postLogin,
        onSuccess: data => {
            setAuth(data.user);
            localStorage.setItem("token", data.token);
            navigate("/");
        },
    });

    const submitLogin = data => {
        console.log(data);
        login.mutate(data);
    };

    return (
        <Box>
            <Typography variant="h3">Login</Typography>

            {login.isError && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    Invalid password or username
                </Alert>
            )}
            <form onSubmit={handleSubmit(submitLogin)}>
                <OutlinedInput
                    fullWidth
                    placeholder="username"
                    {...register("username", { required: true })}
                    sx={{ mt: 2 }}
                />
                {errors.username && (
                    <Typography color="error">
                        This field is required
                    </Typography>
                )}
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
                    Login
                </Button>
            </form>
        </Box>
    );
}
