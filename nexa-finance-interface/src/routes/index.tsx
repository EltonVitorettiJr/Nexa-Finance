import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer, type ToastContainerProps } from "react-toastify";
import { AuthProvider } from "../context/AuthContext";
import AppLayout from "../layout/App.layout";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import TransactionForm from "../pages/TransactionForm";
import Transactions from "../pages/Transactions";
import PrivateRoutes from "./PrivateRoutes";

const AppRoutes = () => {
  const toastConfig: ToastContainerProps = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "colored",
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>

          <Route element={<PrivateRoutes />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/transacoes" element={<Transactions />}></Route>
              <Route
                path="/nova-transacao"
                element={<TransactionForm />}
              ></Route>
            </Route>
          </Route>

          <Route path="*" element={<h2>Página não encontrada</h2>}></Route>
        </Routes>
        <ToastContainer {...toastConfig} />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
