import { VStack, Text, Box, Flex, Input, Button, InputGroup, InputLeftAddon, useToast } from "@chakra-ui/react";
import { CaretLeft } from "phosphor-react";
import MainLayout from "../../layouts/MainLayout";
import CustomSelect from "../../components/CustomSelect";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import prestamoService from "../../api/prestamoService";
import clienteService from "../../api/clienteService";

const NuevoPrestamo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientesOptions, setClientesOptions] = useState<{value: string, label: string}[]>([]);

  const [formData, setFormData] = useState({
    clienteId: searchParams.get("clienteId") || "",
    tipoPrestamoId: "",
    monto: "",
    interesPorcentaje: "20",
    fechaInicio: new Date().toISOString().split('T')[0],
    cantidadCuotas: "",
  });
  const fetchClientes = async () => {
    try {
      setLoadingClientes(true);
      const data = await clienteService.listarTodos();  
      const options = data.map((c: any) => ({ 
        value: c.id.toString(), 
        label: c.nombres 
      }));
      setClientesOptions(options);
    } catch (error) {
      console.error("Error cargando clientes", error);
    } finally {
      setLoadingClientes(false);
    }
  };
  // Cargar clientes desde el backend si no viene filtrado
  useEffect(() => {

    fetchClientes();
  }, []);

  const handleConfirmar = async () => {
    // Validaciones básicas
    if (!formData.clienteId || !formData.monto || !formData.tipoPrestamoId) {
      toast({ title: "Atención", description: "Completa los campos obligatorios", status: "warning" });
      return;
    }

    if(Number(formData.monto) <= 0){
      toast({ title: "Atención", description: "El monto debe ser positivo y mayor a 0", status: "error" })
      formData.monto = '0'
      return ;
    }

    setIsSubmitting(true);
    try {
      const dto = {
        ...formData,
        clienteId: Number(formData.clienteId),
        tipoPrestamoId: Number(formData.tipoPrestamoId),
        monto: Number(formData.monto),
        interesPorcentaje: Number(formData.interesPorcentaje),
        cantidadCuotas: Number(formData.cantidadCuotas),
      };

      // Llamada al servicio según tipo
      if (formData.tipoPrestamoId === "1") {
        await prestamoService.crearDiario(dto);
      } else {
        await prestamoService.crearSemanal(dto);
      }

      toast({ title: "¡Éxito!", description: "Préstamo creado correctamente", status: "success" });
      navigate("/prestamos", { replace: true });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo crear el préstamo", status: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <VStack spacing={0} align="stretch" w="full" bg="white" minH="100vh">
        <Flex align="center" py={4} px={2} borderBottom="1px solid" borderColor="gray.100">
          <Box as="button" onClick={() => navigate(-1)} p={2} borderRadius="md" _hover={{ bg: "gray.50" }}>
            <CaretLeft size={24} weight="bold" color="#004481" />
          </Box>
          <Text fontSize="lg" fontWeight="bold" color="#004481" ml={2}>Crear Préstamo</Text>
        </Flex>

        <VStack p={6} spacing={8} align="stretch" pb={32}>
          <CustomSelect 
            label="CLIENTE" 
            placeholder={loadingClientes ? "Cargando..." : "Seleccionar cliente"}
            options={clientesOptions} 
            value={formData.clienteId}
            onChange={(val) => setFormData({...formData, clienteId: val})} 
          />

          <CustomSelect 
            label="TIPO DE PRÉSTAMO" 
            placeholder="Seleccione frecuencia" 
            options={[{value: "1", label: "Diario"}, {value: "2", label: "Semanal"}]} 
            value={formData.tipoPrestamoId}
            onChange={(val) => {
              let cuotas = val === "1" ? "24" : "1";
              setFormData({ ...formData, tipoPrestamoId: val, cantidadCuotas: cuotas });
            }}
          />

          <Box borderBottom="1px solid" borderColor="gray.200" pb={1}>
            <Text fontSize="xs" color="gray.400" fontWeight="900" letterSpacing="wider">MONTO A PRESTAR</Text>
            <InputGroup variant="unstyled">
              <InputLeftAddon children="S/" color="#004481" fontWeight="bold" fontSize="lg" pr={2} bg="transparent" />
              <Input 
                type="number" 
                placeholder="0.00" 
                value={formData.monto}
                onChange={(e) => setFormData({...formData, monto: e.target.value})}
                fontSize="2xl" fontWeight="900" color="#004481"
              />
            </InputGroup>
          </Box>

          <Flex gap={6}>
              <Box flex={1}>
                <CustomSelect 
                  label="INTERÉS" 
                  options={[{value: "10", label: "10%"}, {value: "20", label: "20%"}, {value: "30", label: "30%"}]} 
                  value={formData.interesPorcentaje}
                  onChange={(val) => setFormData({ ...formData, interesPorcentaje: val })}
                />
              </Box>
              <Box flex={1} borderBottom="1px solid" borderColor="gray.200">
                <Text fontSize="xs" color="gray.400" fontWeight="900" letterSpacing="wider">CUOTAS</Text>
                <Input 
                    variant="unstyled" 
                    type="number"
                    h="40px"
                    value={formData.cantidadCuotas}
                    onChange={(e) => setFormData({...formData, cantidadCuotas: e.target.value})}
                    fontWeight="500"
                />
              </Box>
          </Flex>

          <Box borderBottom="1px solid" borderColor="gray.200" pb={1}>
            <Text fontSize="xs" color="gray.400" fontWeight="900" letterSpacing="wider">FECHA DE INICIO</Text>
            <Input 
              variant="unstyled" 
              type="date" 
              h="40px"
              value={formData.fechaInicio}
              onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
            />
          </Box>
        </VStack>

        <Button
          position="fixed" bottom="24px" left="50%" transform="translateX(-50%)" w="92%"
          bg="#004481" color="white" borderRadius="full" size="lg" 
          boxShadow="0px 8px 20px rgba(0, 68, 129, 0.3)"
          isLoading={isSubmitting}
          _hover={{ bg: "#003366" }}
          onClick={handleConfirmar}
        >
          Confirmar Préstamo
        </Button>
      </VStack>
    </MainLayout>
  );
};

export default NuevoPrestamo;