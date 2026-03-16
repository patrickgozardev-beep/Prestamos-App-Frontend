import { 
  VStack, 
  Input, 
  Button, 
  Text, 
  FormControl, 
  FormLabel, 
  Box,
  Center,
  useToast
} from "@chakra-ui/react";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../api/authService";
import PinKeyboard from "../components/PinKeyboard";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // 1. Estados para capturar las credenciales
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pinReset, setPinReset] = useState(0);

  // 2. Función de login conectada al backend
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) {
      // Si viene de un clic o de un Enter, detenemos la acción por defecto
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
  
    console.log("Intentando llamar al backend...");
    if (!username || !password) {
      toast({
        title: "Campos incompletos",
        description: "Por favor ingresa usuario y contraseña",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      await authService.login({ username, password });
      
      toast({
        title: "Acceso exitoso",
        status: "success",
        duration: 2000,
      });

      // Redirigir al dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error capturado:", error);
    
      // Extraemos el mensaje del backend o usamos uno por defecto
      const mensajeError = error.response?.data?.message || 
                           error.response?.data || 
                           "Usuario o contraseña incorrectos";
      setPinReset(prev => prev + 1);
      toast({
        title: "Error de acceso",
        description: mensajeError,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom"  
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <Box 
        p={8} 
        bg="white"
        borderRadius="none"
        minH="450px" 
        w="full"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <VStack spacing={8} align="stretch">
          <Center flexDirection="column">
            <Text 
              fontSize="3xl" 
              fontWeight="900" 
              color="#004481" 
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
                Documento de Identidad
              </FormLabel>
              <Input 
                variant="flushed"
                placeholder="Ingresa tu documento" 
                focusBorderColor="#004481"
                fontSize="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}  
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
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Capturamos la clave
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); 
                    handleLogin(e);    
                  }
                }}              
                />
            </FormControl>
            {/* <PinKeyboard
              onComplete={(pin) => setPassword(pin)}
              onChange={(pin) => setPassword(pin)}
              resetSignal={pinReset} 
            /> */}
          </VStack>

          <VStack spacing={4} pt={4}>
          <Button 
            type="button"  
            bg="#004481" 
            color="white"
            _hover={{ bg: "#003366" }}
            width="full" 
            size="lg" 
            borderRadius="none"
            onClick={(e) => handleLogin(e)} // Asegúrate de pasar el evento 'e'
            isLoading={isLoading}
            loadingText="Validando..."
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