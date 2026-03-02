import { 
    VStack, 
    Input, 
    Button, 
    Text, 
    FormControl, 
    FormLabel, 
    Box,
    Image,
    Center
  } from "@chakra-ui/react";
  import MainLayout from "../layouts/MainLayout";
  import { useNavigate } from "react-router-dom";
  
  const Login = () => {
    const navigate = useNavigate();
  
    const handleLogin = () => {
      localStorage.setItem("token", "123");
      navigate("/dashboard");
    };
  
    return (
      <MainLayout>
        {/* Contenedor principal con fondo blanco puro tipo BBVA */}
        <Box 
          p={8} 
          bg="white"
          borderRadius="none" // BBVA usa bordes menos redondeados en móviles
          minH="450px" 
          w="full"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <VStack spacing={8} align="stretch">
            
            {/* Logo o Título Institucional */}
            <Center flexDirection="column">
              <Text 
                fontSize="3xl" 
                fontWeight="900" 
                color="#004481" // El azul oficial
                letterSpacing="tighter"
              >
                GOZAR CAPITAL
              </Text>
              <Text fontSize="md" color="gray.600" fontWeight="medium">
                Hola, bienvenido
              </Text>
            </Center>
  
            <VStack spacing={6}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                  Usuario
                </FormLabel>
                <Input 
                  variant="flushed" // BBVA suele usar campos con solo línea inferior
                  placeholder="Ingresa tu documento" 
                  focusBorderColor="#004481"
                  fontSize="lg"
                />
              </FormControl>
  
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                  Contraseña
                </FormLabel>
                <Input 
                  variant="flushed"
                  type="password" 
                  placeholder="Tu clave de acceso" 
                  focusBorderColor="#004481"
                  fontSize="lg"
                />
              </FormControl>
            </VStack>
  
            <VStack spacing={4} pt={4}>
              <Button 
                bg="#004481" 
                color="white"
                _hover={{ bg: "#003366" }}
                width="full" 
                size="lg" 
                borderRadius="none" // Botones rectangulares o apenas redondeados
                onClick={handleLogin}
                fontWeight="bold"
              >
                Entrar
              </Button>
              
              <Text fontSize="sm" color="#004481" fontWeight="bold" cursor="pointer">
                ¿Olvidaste tu contraseña?
              </Text>
            </VStack>
  
            <Text fontSize="xs" textAlign="center" color="gray.400" mt={10}>
              © 2026 Gozar Capital Préstamos Personales. <br/> Todos los derechos reservados.
            </Text>
          </VStack>
        </Box>
      </MainLayout>
    );
  };
  
  export default Login;