import { VStack, Text, Box, Flex, IconButton, Input, Button, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { CaretLeft } from "phosphor-react";
import MainLayout from "../../layouts/MainLayout";
import CustomSelect from "../../components/CustomSelect"; // Importamos el nuevo componente
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

const NuevoPrestamo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    clienteId: searchParams.get("clienteId") || "",
    tipoPrestamoId: "",
    monto: "",
    interesPorcentaje: "20",
    fechaInicio: new Date().toISOString().split('T')[0],
    cantidadCuotas: "",
  });

  const clientesOptions = [
    { value: "1", label: "Juan Pérez" },
    { value: "2", label: "María Rojas" }
  ];

  const tipoOptions = [
    { value: "1", label: "Diario" },
    { value: "2", label: "Semanal" }
  ];

  const interesOptions = [
    { value: "10", label: "10%" },
    { value: "20", label: "20%" },
  ];
  
  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value;
    let cuotas = tipo === "1" ? "24" : tipo === "2" ? "1" : "";
    setFormData({ ...formData, tipoPrestamoId: tipo, cantidadCuotas: cuotas });
  };

  return (
    <MainLayout>
      <VStack spacing={0} align="stretch" w="full" bg="white" minH="100vh">
        <Flex align="center" py={4} px={2} borderBottom="1px solid" borderColor="gray.100">
          <IconButton icon={<CaretLeft size={24} weight="bold" />} variant="ghost" onClick={() => navigate(-1)} color="#004481" aria-label="Volver" />
          <Text fontSize="lg" fontWeight="bold" color="#004481">Crear Préstamo</Text>
        </Flex>

        <VStack p={6} spacing={8} align="stretch" pb={32}>
        <CustomSelect 
        label="CLIENTE" 
        placeholder="Seleccionar cliente" 
        options={clientesOptions} 
        value={formData.clienteId}
        onChange={(val) => setFormData({...formData, clienteId: val})} // Recibe el valor directo
        />

        <CustomSelect 
        label="TIPO DE PRÉSTAMO" 
        placeholder="Seleccione frecuencia" 
        options={tipoOptions} 
        value={formData.tipoPrestamoId}
        onChange={(val) => {
            // Replicamos tu lógica de cuotas
            let cuotas = val === "1" ? "24" : val === "2" ? "1" : "";
            setFormData({ ...formData, tipoPrestamoId: val, cantidadCuotas: cuotas });
        }}
        />

          <Box borderBottom="1px solid" borderColor="gray.200" pb={1}>
            <Text fontSize="xs" color="gray.400" fontWeight="900" letterSpacing="wider">MONTO A PRESTAR</Text>
            <InputGroup variant="unstyled">
              <InputLeftAddon children="S/" color="#004481" fontWeight="bold" fontSize="lg" pr={2} />
              <Input 
                type="number" 
                placeholder="0.00" 
                value={formData.monto}
                onChange={(e) => setFormData({...formData, monto: e.target.value})}
                fontSize="2xl"
                fontWeight="900"
                color="#004481"
              />
            </InputGroup>
          </Box>

          <Flex gap={6}>
             <Box flex={1}>
             <CustomSelect 
                label="INTERÉS" 
                options={interesOptions} 
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
          bg="#004481" color="white" borderRadius="full" size="lg" boxShadow="0px 8px 20px rgba(0, 68, 129, 0.3)"
          onClick={() => console.log(formData)}
        >
          Confirmar Préstamo
        </Button>
      </VStack>
    </MainLayout>
  );
};

export default NuevoPrestamo;