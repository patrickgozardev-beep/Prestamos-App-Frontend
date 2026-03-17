import { 
    VStack, Text, Box, HStack, Input, InputGroup, InputLeftElement, 
    IconButton, Flex, Badge, Divider, Button, 
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Center,
    Icon,
    SkeletonCircle,
    Skeleton,

  } from "@chakra-ui/react";
  import { MagnifyingGlass,Receipt,Info, Plus, CaretLeft, CaretRight, User } from "phosphor-react";
  import MainLayout from "../../layouts/MainLayout";
  import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import clienteService from "../../api/clienteService";
import type { ClienteDTO } from "../../types/Cliente";
  
  const Clientes = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    // 1. Estados para los datos y la carga
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCliente, setSelectedCliente] = useState<ClienteDTO | null>(null);

    const fetchClientes = async () => {
      try {
        setLoading(true);
        const data = await clienteService.listarPorUsuario();
        setClientes(data);
      } catch (error) {
        console.error("Error al obtener mis clientes:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // 3. Efecto de carga inicial
    useEffect(() => {
      if (searchTerm.trim() === "") {
        fetchClientes();
        return;
      }

      // 2. Creamos un temporizador (Debounce)
      const delayDebounceFn = setTimeout(() => {
        if (searchTerm.length >= 1) {
          ejecutarBusqueda(searchTerm);
        }
      }, 500); // Espera medio segundo después de la última tecla

      // 3. Limpiamos el temporizador si el usuario sigue escribiendo
      return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // 4. La función que realmente consume la API
    const ejecutarBusqueda = async (valor: string) => {
      try {
        setLoading(true);
        const data = await clienteService.buscar(1, valor);
        setClientes(data);
      } catch (error) {
        console.error("Error en búsqueda:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
    
      // Si el usuario borra todo, volvemos a listar todos
      if (value.trim() === "") {
        fetchClientes();
        return;
      }
    
      // Buscamos si tiene al menos 1 carácter (puedes subirlo a 3 si prefieres)
      if (value.length >= 1) {
        try {
          setLoading(true);
          // Aquí usamos el ID del usuario (hardcoded a 1 por ahora como en tu ejemplo)
          const filtered = await clienteService.buscar(1, value);
          setClientes(filtered);
        } catch (error) {
          console.error("Error en la búsqueda:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    const handleClienteClick = (cliente: any) => {
      setSelectedCliente(cliente);
      onOpen();
    };

    return (
      <MainLayout>
        <VStack spacing={0} align="stretch" w="full" minH="100vh">
          
          <Flex align="center" py={4} px={2} bg="white" position="sticky" top={0} zIndex={10}>
            <IconButton
              icon={<CaretLeft size={24} weight="bold" />}
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              aria-label="Volver"
              color="#004481"
            />
            <Text fontSize="lg" fontWeight="bold" color="#004481" ml={2}>
              Mis Clientes
            </Text>

          </Flex>
  
          {/* Buscador */}
          <Box px={4} pb={4} bg="white">
            <InputGroup marginTop={2}>
              <InputLeftElement pointerEvents="none">
                <MagnifyingGlass size={20} color="gray" />
              </InputLeftElement>
              <Input 
                placeholder="Buscar por nombre o DNI..." 
                bg="gray.50" 
                border="none" 
                borderRadius="xl"
                value={searchTerm} 
                onChange={handleSearch} 
                _focus={{ bg: "white", boxShadow: "0 0 0 1px #004481" }}
              />
            </InputGroup>
          </Box>
  
          <Divider />
  
          {/* Lista de Clientes */}
          <VStack p={4} spacing={4} pb={24} align="stretch">
            {loading ? (
              // --- ESTADO: CARGANDO (SKELETONS) ---
              [1, 2, 3, 4, 5].map((i) => (
                <Box key={i} p={4} bg="white" borderBottom="1px solid" borderColor="gray.50">
                  <HStack spacing={3} w="full">
                    <SkeletonCircle size="10" />
                    <VStack align="start"  flex={1}>
                      <Skeleton height="12px" width="60%" borderRadius="full" />
                      <Skeleton height="10px" width="30%" borderRadius="full" />
                    </VStack>
                  </HStack>
                </Box>
              ))
            ) : clientes.length > 0 ? (
              // --- ESTADO: CON DATOS ---
              clientes.map((cliente) => (
                <Box 
                  key={cliente.id}
                  p={4} 
                  bg="white" 
                  _active={{ bg: "gray.50" }} 
                  transition="0.2s"
                  cursor="pointer"
                  onClick={() => handleClienteClick(cliente)}
                  borderBottom="1px solid"
                  borderColor="gray.50"
                >
                  <HStack justifyContent="space-between">
                    <HStack spacing={3}>
                      <Box bg="blue.50" p={2} borderRadius="full">
                        <User size={24} color="#004481" weight="duotone" />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" fontSize="sm" color="gray.700">
                          {cliente.nombres}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          DNI: {cliente.dni}
                        </Text>
                      </VStack>
                    </HStack>
                    <CaretRight size={16} color="#CBD5E0" />
                  </HStack>
                </Box>
              ))
            ) : (
              <Center flex={1} py={20} w="full">
              <VStack spacing={4} align="center">
                <Box 
                  bg="blue.50" 
                  p={6} 
                  borderRadius="full" 
                  display="flex"          // Asegura comportamiento flex
                  alignItems="center"     // Centra el icono verticalmente
                  justifyContent="center"  // Centra el icono horizontalmente
                  boxSize="110px"         // Forzamos un tamaño cuadrado para que el círculo no se deforme
                >             
                  <Icon as={User} boxSize="40px" color="#004481" weight="duotone" />
                </Box>
                <VStack spacing={1}>
                  <Text fontWeight="bold" fontSize="lg" color="gray.700">
                    {searchTerm ? "Sin resultados" : "No hay clientes"}
                  </Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center" px={10}>
                    {searchTerm 
                      ? `No encontramos coincidencias para "${searchTerm}"` 
                      : "Aún no tienes clientes registrados."}
                  </Text>
                </VStack>
              </VStack>
            </Center>
            )}

            

            {/* MODAL (Fuera del loop para mejor rendimiento) */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
              <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
              <ModalContent borderRadius="2xl" mx={4}>
                <ModalBody p={0}>
                  <VStack align="stretch" spacing={0}>
                    <Box p={5} borderBottom="1px solid" borderColor="gray.100">
                      <Text fontWeight="900" color="#004481" noOfLines={1}>
                        {selectedCliente?.nombres}
                      </Text>
                      <Text fontSize="xs" color="gray.500">¿Qué deseas realizar?</Text>
                    </Box>
                    
                    <Button 
                      variant="ghost" justifyContent="start" h="64px" borderRadius="0"
                      leftIcon={<Receipt size={24} weight="duotone" color="#004481" />}
                      onClick={() => {
                        onClose();
                        navigate(`/prestamos?clienteId=${selectedCliente?.id}`);
                      }}
                    >
                      Ver Préstamos
                    </Button>

                    <Button 
                      variant="ghost" justifyContent="start" h="64px" borderRadius="0"
                      borderBottomRadius="2xl"
                      leftIcon={<Info size={24} weight="duotone" color="#004481" />}
                      onClick={() => {
                        onClose();
                        navigate(`/clientes/detalle/${selectedCliente?.id}`);
                      }}
                    >
                      Información del Cliente
                    </Button>
                  </VStack>
                </ModalBody>
              </ModalContent>
            </Modal>
          </VStack>
          {/* Botón Flotante para crear cliente (Opcional, muy usado en banca móvil) */}
          <Button
            position="fixed"
            bottom="20px"
            right="20px"
            colorScheme="blue"
            bg="#004481"
            borderRadius="full"
            size="lg"
            leftIcon={<Plus weight="bold" />}
            boxShadow="2xl"
            onClick={() => navigate("/clientes/nuevo")}
          >
            Nuevo
          </Button>
  
        </VStack>
      </MainLayout>
    );
  };
  
  export default Clientes;