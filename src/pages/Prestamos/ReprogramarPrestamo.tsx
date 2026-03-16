import { 
    VStack, Box, Text, Flex, IconButton, Button, 
    NumberInput, NumberInputField, NumberInputStepper, 
    NumberIncrementStepper, NumberDecrementStepper,
    Alert, AlertIcon, useToast
  } from "@chakra-ui/react";
  import { ArrowLeft, ArrowsClockwise } from "phosphor-react";
  import { useState } from "react";
  import { useNavigate, useParams, useLocation } from "react-router-dom";
  import MainLayout from "../../layouts/MainLayout";
  import prestamoService from "../../api/prestamoService";
import CustomSelect from "../../components/CustomSelect";
  
  const ReprogramarPrestamo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const toast = useToast();
    
    const [cuotas, setCuotas] = useState(1);
    const [interes, setInteres] = useState("20");
    const [loading, setLoading] = useState(false);
  
    const handleReprogramar = async () => {
      try {
        setLoading(true);
        // Tu endpoint de Spring Boot
        await prestamoService.reprogramar(Number(id), cuotas, Number(interes));
        
        toast({
          title: "Préstamo Reprogramado",
          description: "El cronograma ha sido recalculado exitosamente.",
          status: "success",
        });
        
        // Volvemos al detalle usando replace para que no pueda volver atrás a la pantalla de reprogramación
        navigate(`/prestamos/${id}`, { replace: true });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo reprogramar el préstamo.",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <MainLayout>
        <VStack spacing={0} align="stretch" bg="gray.50" minH="100vh">
          {/* Header */}
          <Flex align="center" py={4} px={4} bg="white" shadow="sm">
            <IconButton 
              icon={<ArrowLeft size={24} />} 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              color="#004481" 
              aria-label="Volver"
            />
            <Text fontSize="lg" fontWeight="bold" color="#004481" ml={2}>
              Reprogramar Préstamo
            </Text>
          </Flex>
  
          <VStack p={4} spacing={6} align="stretch">
            <Box bg="white" p={6} borderRadius="2xl" shadow="md">
              <Text fontSize="sm" color="gray.500" fontWeight="bold" mb={1}>REPROGRAMACIÓN PARA</Text>
              <Text fontSize="xl" fontWeight="black" color="#004481" mb={4}>
                {state?.clienteNombre || "Cliente"}
              </Text>
  
              <Alert status="warning" borderRadius="xl" mb={6} fontSize="sm">
                <AlertIcon />
                Al reprogramar, las cuotas pendientes actuales se eliminarán y se generará un nuevo cronograma basado en el saldo restante.
              </Alert>
  
              <VStack align="stretch" spacing={4}>
                <Text fontWeight="bold" color="gray.700">¿En cuántas cuotas nuevas deseas dividir el saldo?</Text>
                
                <NumberInput 
                  min={1} 
                  max={60} 
                  value={cuotas} 
                  onChange={(val) => setCuotas(Number(val))}
                  size="lg"
                >
                  <NumberInputField   borderRadius="xl" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontWeight="bold" color="gray.700">¿En cuántas cuotas nuevas deseas dividir el saldo?</Text>

                <CustomSelect 
                label="" 
                options={[
                  {value: "10", label: "10%"}, 
                  {value: "20", label: "20%"}, 
                  {value: "30", label: "30%"}
                ]} 
                value={interes}
                onChange={(val) => setInteres(val)}
              />
  
                <Button 
                  leftIcon={<ArrowsClockwise size={20} weight="bold" />}
                  colorScheme="blue" 
                  bg="#004481"
                  h="60px"
                  borderRadius="xl"
                  isLoading={loading}
                  onClick={handleReprogramar}
                  mt={4}
                >
                  CONFIRMAR REPROGRAMACIÓN
                </Button>
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </MainLayout>
    );
  };
  
  export default ReprogramarPrestamo;