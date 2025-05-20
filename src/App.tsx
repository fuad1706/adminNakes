import { BrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;
