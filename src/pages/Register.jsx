import { useForm } from "react-hook-form";
import { Box, Typography, OutlinedInput, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

async function postUser(data) {
    const res = await fetch("http://localhost:8080/users", {
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

export default function Register() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,

        formState: { errors },
    } = useForm();

    const create = useMutation({
        mutationFn: postUser,
        onSuccess: () => {
            navigate("/Login");
        },
        onError: () => {
            setError("username or password is required");
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
                        This field is required
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
