import io from "socket.io-client"; // to connect with socket.io in client side => npm i socket.io-client

export const socket = io.connect(process.env.REACT_SERVER);
