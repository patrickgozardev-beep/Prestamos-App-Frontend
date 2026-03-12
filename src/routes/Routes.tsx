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
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/clientes",
    element: (
      <ProtectedRoute>
        <Clientes />
      </ProtectedRoute>
    ),
  },
  {
    // Ruta plana para evitar el error de anidamiento
    path: "/clientes/nuevo",
    element: (
      <ProtectedRoute>
        <NuevoCliente />
      </ProtectedRoute>
    ),
  },
  {
    // Ruta plana para evitar el error de anidamiento
    path: "/clientes/editar/:id",
    element: (
      <ProtectedRoute>
        <EditarCliente />
      </ProtectedRoute>
    ),
  },
  {
    /* Ruta dinámica: El ":id" permite que React Router capture 
       el ID del cliente para mostrar su información específica.
    */
    path: "/clientes/detalle/:id",
    element: <ProtectedRoute><DetalleCliente /></ProtectedRoute>,
  },
  {
    /* Esta ruta servirá tanto para ver todos los préstamos 
       como para ver los filtrados por query params (?clienteId=...)
    */
    path: "/prestamos",
    element: <ProtectedRoute><Prestamos /></ProtectedRoute>,
  },
  {
    /* Esta ruta servirá tanto para ver todos los préstamos 
       como para ver los filtrados por query params (?clienteId=...)
    */
    path: "/prestamos/:id",
    element: <ProtectedRoute><DetallePrestamo /></ProtectedRoute>,
  },
  {
    /* Esta ruta servirá tanto para ver todos los préstamos 
       como para ver los filtrados por query params (?clienteId=...)
    */
    path: "/prestamos/nuevo",
    element: <ProtectedRoute><NuevoPrestamo /></ProtectedRoute>,
  },
  {
    /* Esta ruta servirá tanto para ver todos los préstamos 
       como para ver los filtrados por query params (?clienteId=...)
    */
    path: "/prestamos/reprogramar/:id",
    element: <ProtectedRoute><ReprogramarPrestamo /></ProtectedRoute>,
  },
  {
    /* Esta ruta servirá tanto para ver todos los préstamos 
       como para ver los filtrados por query params (?clienteId=...)
    */
    path: "/pago/nuevo/:cronogramaId",
    element: <ProtectedRoute><NuevoPago /></ProtectedRoute>,
  },
  {
    /* Esta ruta servirá tanto para ver todos los préstamos 
       como para ver los filtrados por query params (?clienteId=...)
    */
    path: "/pago/cronograma/:cronogramaId",
    element: <ProtectedRoute><Pagos /></ProtectedRoute>,
  },
  {
    /* Esta ruta servirá tanto para ver todos los préstamos 
       como para ver los filtrados por query params (?clienteId=...)
    */
    path: "/pago/detalle/:pagoId",
    element: <ProtectedRoute><DetallePago /></ProtectedRoute>,
  },
 


];