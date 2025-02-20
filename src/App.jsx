import React from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
  function PageLayout() {
    return (
      <>
        <Outlet/>
      </>
    );
  }

  const pageRoutes = createBrowserRouter([
    {
      path: "/",
      element: <PageLayout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
      ]
    }
  ])
  return (
    <div>
      <RouterProvider router={pageRoutes}></RouterProvider>
    </div>
  );
}


