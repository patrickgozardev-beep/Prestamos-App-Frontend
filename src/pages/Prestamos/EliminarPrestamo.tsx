import {
    VStack,
    Box,
    Text,
    Button,
    Icon,
    Center,
    useToast,
    IconButton,
    Flex,
    Heading,
    Divider,
    HStack,
  } from "@chakra-ui/react";
  import { CaretLeft, Warning, Trash, Info } from "phosphor-react";
  import { useNavigate, useParams, useLocation } from "react-router-dom";
  import MainLayout from "../../layouts/MainLayout";
  import prestamoService from "../../api/prestamoService";
  
  const EliminarPrestamo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
  
    // Recuperamos los datos pasados por el state
    const prestamo = location.state?.prestamo;
  
    const handleEliminar = async () => {
      try {
        if (!id) return;
        
        await prestamoService.eliminar(Number(id));
        
        toast({
          title: "Préstamo eliminado",
          description: "El registro y su cronograma fueron borrados.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
  
        navigate("/prestamos", { replace: true });
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el préstamo. Intente de nuevo.",
          status: "error",
        });
      }
    };
  
    return (
      <MainLayout>
        <VStack spacing={0} align="stretch" minH="100vh" bg="white">
          
          {/* Header de la pantalla */}
          <Flex align="center" p={4} borderBottom="1px solid" borderColor="gray.100">
            <IconButton 
              icon={<CaretLeft size={24} weight="bold" />} 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              aria-label="Volver"
              color="#004481"
            />
            <Text ml={2} fontWeight="bold" color="#004481" fontSize="lg">
              Confirmar Eliminación
            </Text>
          </Flex>
  
          <Center flex={1} px={6} py={10}>
            <VStack spacing={8} w="full" maxW="400px">
              
              {/* Icono de Alerta Visual */}
              <Box position="relative">
                <Box bg="red.50" p={8} borderRadius="full">
                  <Icon as={Warning} size={80} color="red.500" weight="fill" />
                </Box>
                <Box 
                  position="absolute" bottom="0" right="0" bg="white" p={1} borderRadius="full"
                >
                  <Icon as={Trash} size={28} color="red.600" weight="duotone" />
                </Box>
              </Box>
  
              <VStack spacing={4} textAlign="center">
                <Heading size="lg" color="gray.800">¿Estás seguro?</Heading>
                
                <Box bg="gray.50" p={4} borderRadius="xl" w="full" border="1px dashed" borderColor="gray.300">
                  <Text fontSize="sm" color="gray.500" mb={1}>Estás por eliminar el préstamo de:</Text>
                  <Text fontWeight="bold" fontSize="md" color="#004481">
                    {prestamo?.cliente?.nombres || "Cliente desconocido"}
                  </Text>
                  <Divider my={2} />
                  <Text fontSize="xs" color="gray.500">Monto del préstamo:</Text>
                  <Text fontWeight="bold" color="gray.700">S/ {prestamo?.montoTotal.toFixed(2)}</Text>
                </Box>
  
                <HStack bg="orange.50" p={3} borderRadius="lg" spacing={3} align="start">
                  <Icon as={Info} size={20} color="orange.600" weight="fill" mt={0.5} />
                  <Text fontSize="xs" color="orange.800" textAlign="left">
                    Esta acción borrará permanentemente todas las cuotas, pagos registrados y el historial de este crédito. No se puede deshacer.
                  </Text>
                </HStack>
              </VStack>
  
              <VStack w="full" spacing={3}>
                <Button 
                  colorScheme="red" 
                  size="lg" 
                  w="full" 
                  h="60px" 
                  borderRadius="2xl"
                  leftIcon={<Trash weight="fill" />}
                  onClick={handleEliminar}
                  shadow="md"
                  _active={{ transform: "scale(0.98)" }}
                >
                  Sí, eliminar definitivamente
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="lg" 
                  w="full" 
                  h="50px"
                  color="gray.500"
                  onClick={() => navigate(-1)}
                >
                  No, cancelar y volver
                </Button>
              </VStack>
  
            </VStack>
          </Center>
        </VStack>
      </MainLayout>
    );
  };
  
  export default EliminarPrestamo;