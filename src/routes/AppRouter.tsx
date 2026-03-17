import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./Routes";

const renderRoutes = (routes: any[]) =>
  routes.map((route) => {
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children.map((child: any) => (
            // Importante: path={child.path} sin "/" si es hijo
            <Route key={child.path} path={child.path} element={child.element} />
          ))}
        </Route>
      );
    }
    return <Route key={route.path} path={route.path} element={route.element} />;
  });

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {renderRoutes(publicRoutes)}
        {renderRoutes(privateRoutes)}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;