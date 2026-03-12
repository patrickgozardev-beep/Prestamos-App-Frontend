import { 
    VStack, Box, Text, IconButton, Flex, Button, FormControl, 
    FormLabel, Input, SimpleGrid, useToast, Center, Divider 
  } from "@chakra-ui/react";
  import { ArrowLeft, Check, CurrencyDollar } from "phosphor-react";
  import { useEffect, useState } from "react";
  import { useNavigate, useLocation, useParams } from "react-router-dom";
  import MainLayout from "../../layouts/MainLayout";
import type { PagoDTO } from "../../types/Pago";
import pagoService from "../../api/pagosService";
  
  const NuevoPago = () => {
    const navigate = useNavigate();
    // useParams captura el nombre exacto que pusiste en la ruta ":cronogramaId"
    const params = useParams<{ cronogramaId: string }>();
    const { state } = useLocation(); 
    const toast = useToast();
  
    const [monto, setMonto] = useState(state?.montoSugerido?.toString() || "");
    const [metodo, setMetodo] = useState("YAPE");
    const [loading, setLoading] = useState(false);
  
    // Debug para verificar que el ID llega por la URL
    useEffect(() => {
      if (!params.cronogramaId) {
        toast({ title: "Error: No se detectó ID de cuota", status: "error" });
      }
    }, [params.cronogramaId]);
  
    const handlePago = async () => {
      if (loading) return; 
      const idNumerico = Number(params.cronogramaId);
      
      if (isNaN(idNumerico) || idNumerico <= 0) {
        return toast({ title: "ID de cuota inválido", status: "error" });
      }
  
      if (!monto || parseFloat(monto) <= 0) {
        return toast({ title: "Monto inválido", status: "error" });
      }
  
      try {
        setLoading(true);
        if (loading) return;
        const dto: PagoDTO = {
          cronogramaId: idNumerico, 
          monto: parseFloat(monto),
          metodo: metodo,
          foto: ""
        };
  
  
        await pagoService.registrarPago(dto);
        
        toast({ 
          title: "Cobro registrado correctamente", 
          description: "Redirigiendo al inicio...",
          status: "success", 
          duration: 2000 
        });
  
        setTimeout(() => {
            if (state?.prestamoId) {
              navigate(`/prestamos/${state.prestamoId}`, { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          }, 1500);

      } catch (error: any) {
        const serverMessage = error.response?.data;
        setLoading(false);
        toast({ 
          title: "Error al procesar el pago", 
          description: typeof serverMessage === 'string' 
          ? serverMessage 
          : "No se pudo procesar el pago",
          status: "error" 
        });
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
              Confirmar Cobro
            </Text>
          </Flex>
  
          <VStack p={4} spacing={6} align="stretch">
            <Box bg="white" p={6} borderRadius="2xl" shadow="md">
              <VStack align="start" spacing={1} mb={6}>
                <Text fontSize="sm" color="gray.500" fontWeight="bold">RESUMEN DE CUOTA</Text>
                <Text fontSize="xl" fontWeight="black" color="#004481">
                  {state?.clienteNombre || "Cliente"}
                </Text>
                <Text color="gray.600">Cuota N° {state?.numeroCuota || "-"}</Text>
              </VStack>
  
              <Divider mb={6} />
  
              <VStack spacing={5}>
                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.700">Monto Recibido (S/)</FormLabel>
                  <Input 
                    size="lg" type="number" fontSize="3xl" h="70px"
                    fontWeight="black" color="#004481" textAlign="center"
                    value={monto} onChange={(e) => setMonto(e.target.value)}
                    focusBorderColor="#004481" borderRadius="xl" bg="blue.50"
                  />
                </FormControl>
  
                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.700">Método de Cobro</FormLabel>
                  <SimpleGrid columns={2} spacing={3} w="full">
                    {[ 'YAPE', 'PLIN', 'TRANSFERENCIA','EFECTIVO'].map((m) => (
                      <Button
                        key={m}
                        onClick={() => setMetodo(m)}
                        variant={metodo === m ? "solid" : "outline"}
                        bg={metodo === m ? "#004481" : "transparent"}
                        color={metodo === m ? "white" : "gray.600"}
                        _hover={{ bg: metodo === m ? "#003366" : "gray.100" }}
                        size="md" 
                        borderRadius="xl"
                      >
                        {m}
                      </Button>
                    ))}
                  </SimpleGrid>
                </FormControl>
  
                <Button 
                  w="full" size="lg" h="75px" bg="#004481" color="white"
                  leftIcon={<Check size={28} weight="bold" />}
                  isLoading={loading}
                  isDisabled={loading} 
                  loadingText="Registrando..."
                  onClick={handlePago}
                  borderRadius="2xl" shadow="xl" mt={4}
                  _active={{ transform: "scale(0.95)" }}
                >
                  FINALIZAR COBRO
                </Button>
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </MainLayout>
    );
  };
  
  export default NuevoPago;