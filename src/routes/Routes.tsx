import type { ReactElement } from "react";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Clientes from "../pages/Clientes/Clientes";
import ProtectedRoute from "./ProtectedRoute";
import NuevoCliente from "../pages/Clientes/NuevoCliente";
import DetalleCliente from "../pages/Clientes/DetalleCliente";
import Prestamos from "../pages/Prestamos/Prestamos";
import NuevoPrestamo from "../pages/Prestamos/NuevoPrestamo";
import EditarCliente from "../pages/Clientes/EditarCliente";
import DetallePrestamo from "../pages/Prestamos/DetallePrestamo";
import NuevoPago from "../pages/Pagos/NuevoPago";
import Pagos from "../pages/Pagos/Pagos";
import DetallePago from "../pages/Pagos/DetallePago";
import ReprogramarPrestamo from "../pages/Prestamos/ReprogramarPrestamo";
import EliminarPrestamo from "../pages/Prestamos/EliminarPrestamo";
import NotificarPrestamo from "../pages/Prestamos/NotificarPrestamo";

interface AppRoute {
  path: string;
  element: ReactElement;
}

export const publicRoutes: AppRoute[] = [
  { path: "/", element: <Login /> },
];

export const privateRoutes: AppRoute[] = [
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: "/clientes",
    element: <ProtectedRoute><Clientes /></ProtectedRoute>
  },
  {
    path: "/clientes/nuevo",
    element: <ProtectedRoute><NuevoCliente /></ProtectedRoute>
  },
  {
    path: "/clientes/editar/:id",
    element: <ProtectedRoute><EditarCliente /></ProtectedRoute>
  },
  {

    path: "/clientes/detalle/:id",
    element: <ProtectedRoute><DetalleCliente /></ProtectedRoute>,
  },
  {
 
    path: "/prestamos",
    element: <ProtectedRoute><Prestamos /></ProtectedRoute>,
  },
  {

    path: "/prestamos/:id",
    element: <ProtectedRoute><DetallePrestamo /></ProtectedRoute>,
  },
  {

    path: "/prestamos/nuevo",
    element: <ProtectedRoute><NuevoPrestamo /></ProtectedRoute>,
  },
  {

    path: "/prestamos/reprogramar/:id",
    element: <ProtectedRoute><ReprogramarPrestamo /></ProtectedRoute>,
  },
  {

    path: "/prestamos/eliminar/:id",
    element: <ProtectedRoute><EliminarPrestamo /></ProtectedRoute>,
  },
  {

    path: "/prestamos/notificar/:id",
    element: <ProtectedRoute><NotificarPrestamo /></ProtectedRoute>,
  },
  {

    path: "/pago/nuevo/:cronogramaId",
    element: <ProtectedRoute><NuevoPago /></ProtectedRoute>,
  },
  {

    path: "/pago/cronograma/:cronogramaId",
    element: <ProtectedRoute><Pagos /></ProtectedRoute>,
  },
  {

    path: "/pago/detalle/:pagoId",
    element: <ProtectedRoute><DetallePago /></ProtectedRoute>,
  },



  

];