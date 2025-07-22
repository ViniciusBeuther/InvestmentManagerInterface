import React, { useEffect, useState } from "react";
import "./index.css";
import Home from "./pages/Home/Home.tsx";
import { Data } from "./types/data.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Distribution from "./pages/Distribution/Distribution.tsx";

const App: React.FC = () => {
  const API_URL: string = "http://127.0.0.1:8000/wallet";
  const [data, setData] = useState<Data[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        // console.log("Fetched data:", result);
        setData(result);
      } catch (error) {
        console.error("Error fetching data on App.tsx", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Erro ao carregar os dados.</p>;
  }

  const router = createBrowserRouter([
    {
      path: "/home",
      element: <Home investmentData={data} />,
    },
    {
      path: "/",
      element: <Home investmentData={data} />,
    },
    {
      path: "/dashboard",
      element: <Dashboard investmentData={data} />
    },
    {
      path: "/distribution",
      element: <Distribution />
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
