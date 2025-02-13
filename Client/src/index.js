import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import "./index.css"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App';
import AuthPage from './pages/auth/AuthPage';
import ProblemPage from './pages/problems/[pid]';
import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from './components/Modals/SignUp';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/problems/:pid",
    element: <ProblemPage />,
  },
  {
    path: "/auth/signup",
    element: <SignUp />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
    <ToastContainer/>
  </RecoilRoot>
);

reportWebVitals();
