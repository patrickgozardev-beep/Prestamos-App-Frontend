import { 
    VStack, Text, Box, HStack, Icon, SimpleGrid, Circle, Flex, Spacer, 
    Button
  } from "@chakra-ui/react";
  import { Users, Coins, ChartPieSlice, SignOut, CaretRight, Bell } from "phosphor-react";
  import MainLayout from "../layouts/MainLayout";
  import { useNavigate } from "react-router-dom";
  
  const Dashboard = () => {
    const navigate = useNavigate();
  
    return (
      <MainLayout>
        <VStack spacing={6} align="stretch" w="full" pb={10}>
          
          {/* Superior: Saludo y Notificaciones */}
          <Flex align="center" px={2}>
            <Box>
              <Text fontSize="sm" color="gray.500">Hola, Steve</Text>
              <Text fontSize="xl" fontWeight="900" color="#004481">GOZAR CAPITAL</Text>
            </Box>
            <Spacer />
            <HStack spacing={4}>
              <Bell size={24} color="#004481" weight="bold" />
              <Circle size="40px" bg="blue.50">
                  <Text fontWeight="bold" color="#004481">S</Text>
              </Circle>
            </HStack>
          </Flex>
  
          {/* Tarjeta Principal de Cartera (Estilo BBVA) */}
          <Box 
            bg="#004481" 
            p={5} 
            borderRadius="2xl" 
            color="white" 
            shadow="xl"
            position="relative"
            overflow="hidden"
          >
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" fontWeight="bold" opacity={0.8}>CARTERA TOTAL ACTIVA</Text>
              <Text fontSize="3xl" fontWeight="bold">S/ 15,000.00</Text>
              <Text fontSize="xs" opacity={0.7}>Actualizado hace un momento</Text>
            </VStack>
            {/* Adorno visual sutil */}
            <Circle position="absolute" right="-20px" bottom="-20px" size="100px" bg="whiteAlpha.100" />
          </Box>
  
          {/* Sección de Accesos Directos (Operaciones) */}
          <Text fontSize="sm" fontWeight="bold" color="gray.600" px={2}>OPERACIONES FRECUENTES</Text>
          <SimpleGrid columns={3} spacing={4} px={2}>
            <VStack onClick={() => navigate("/clientes")} cursor="pointer">
              <Circle size="60px" bg="white" shadow="sm" border="1px solid" borderColor="gray.100">
                <Users size={28} color="#004481" weight="duotone" />
              </Circle>
              <Text fontSize="xs" fontWeight="bold" color="#004481">Clientes</Text>
            </VStack>
  
            <VStack onClick={() => navigate("/prestamos")} cursor="pointer">
              <Circle size="60px" bg="white" shadow="sm" border="1px solid" borderColor="gray.100">
                <Coins size={28} color="#004481" weight="duotone" />
              </Circle>
              <Text fontSize="xs" fontWeight="bold" color="#004481">Préstamos</Text>
            </VStack>
  
            <VStack onClick={() => navigate("/metricas")} cursor="pointer">
              <Circle size="60px" bg="white" shadow="sm" border="1px solid" borderColor="gray.100">
                <ChartPieSlice size={28} color="#004481" weight="duotone" />
              </Circle>
              <Text fontSize="xs" fontWeight="bold" color="#004481">Métricas</Text>
            </VStack>
          </SimpleGrid>
  
          {/* Lista de Movimientos Recientes / Próximos Cobros */}
          <Box px={2} pt={4}>
            <HStack justifyContent="space-between" mb={4}>
              <Text fontSize="sm" fontWeight="bold" color="gray.600">PRÓXIMOS COBROS</Text>
              <Text fontSize="xs" color="#004481" fontWeight="bold">Ver todos</Text>
            </HStack>
  
            <VStack spacing={3}>
              {[1, 2].map((i) => (
                <HStack 
                  key={i}
                  w="full" 
                  p={4} 
                  bg="white" 
                  borderRadius="xl" 
                  shadow="sm" 
                  justifyContent="space-between"
                  onClick={() => navigate("/prestamos/detalle")}
                >
                  <HStack>
                    <Circle size="10px" bg="teal.400" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold">Juan Pérez</Text>
                      <Text fontSize="xs" color="gray.500">Vence mañana</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                      <Text fontWeight="bold" color="gray.700">S/ 150.00</Text>
                      <CaretRight size={16} weight="bold" color="gray.400" />
                  </HStack>
                </HStack>
              ))}
            </VStack>
          </Box>
  
          {/* Botón de Salida Discreto al final */}
          <Button 
            variant="ghost" 
            leftIcon={<SignOut size={20} />} 
            colorScheme="red" 
            size="sm"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Cerrar Sesión Segura
          </Button>
  
        </VStack>
      </MainLayout>
    );
  };
  
  export default Dashboard;