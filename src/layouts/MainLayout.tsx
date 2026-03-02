import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
    return (
      <Box
        minH="100vh"
        w="100vw" 
        bg="gray.50"
        display="flex"
        flexDirection="column"
      >
        {/* Aquí podrías añadir un Navbar simple más adelante */}
        <Box flex="1" p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          {children}
        </Box>
      </Box>
    );
  };

export default MainLayout;