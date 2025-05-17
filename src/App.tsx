import React, { useEffect, useState } from "react";
import "./index.css";
import Home from "./pages/Home/Home.tsx";
import { Data } from "./types/data.ts";

const App: React.FC = () => {
  const API_URL: string = "http://127.0.0.1:8000/wallet";
  const [data, setData] = useState<Data[]>();

  // function to fetch data from backend
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        setData(result);
      } catch (error) {
        return console.log("Error fetching data on App.tsx");
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {data ? (
        <>
          <Home investmentData={data} />
        </>
      ) : (
        <p>a</p>
      )}
    </div>
  );
};

export default App;
