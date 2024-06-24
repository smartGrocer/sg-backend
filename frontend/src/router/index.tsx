import { createBrowserRouter } from "react-router-dom";
import App from "../App";

const router = createBrowserRouter([
	{ path: "/", element: <App /> },
	{ path: "/dashboard", element: <h1>Dashboard</h1> },
]);

export default router;
