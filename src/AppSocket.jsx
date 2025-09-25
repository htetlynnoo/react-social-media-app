import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useApp } from "./AppProvider";
import { useQueryClient } from "@tanstack/react-query";

export default function AppSocket() {
    const {
        sendJsonMessage,

        lastJsonMessage,
        readyState,
    } = useWebSocket(import.meta.env.VITE_WS);
    const { auth } = useApp();

    const token = localStorage.getItem("token");
    const queryClient = useQueryClient();

    useEffect(() => {
        if (auth && readyState === ReadyState.OPEN) {
            sendJsonMessage({ token });
        }
    }, [readyState, auth]);

    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.event) {
            queryClient.invalidateQueries(lastJsonMessage.event);
        }
        console.log(`i got the ${lastJsonMessage}`);
    }, [lastJsonMessage]);

    return <></>;
}
