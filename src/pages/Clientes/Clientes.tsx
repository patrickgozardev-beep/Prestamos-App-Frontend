import { 
    VStack, Text, Box, HStack, Icon, Input, InputGroup, InputLeftElement, 
    IconButton, Flex, Badge, Divider, Button, 
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    List,
    ListItem,
    ListIcon,
  } from "@chakra-ui/react";
  import { MagnifyingGlass,Receipt,Info, Plus, CaretLeft, UserPlus, CaretRight, User } from "phosphor-react";
  import MainLayout from "../../layouts/MainLayout";
  import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Cliente } from "../../types/Cliente";
import clienteService from "../../api/clienteService";
  
  const Clientes = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    // 1. Estados para los datos y la carga
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

    const fetchClientes = async () => {
      try {
        setLoading(true);
        const data = await clienteService.listarPorUsuario(1);
        setClientes(data);
      } catch (error) {
        console.error("Error al obtener mis clientes:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // 3. Efecto de carga inicial
    useEffect(() => {
      // Si el buscador está vacío, cargamos todos
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
            <Flex flex={1} justify="flex-end">
              <IconButton
                icon={<UserPlus size={24} weight="duotone" />}
                colorScheme="blue"
                variant="ghost"
                onClick={() => navigate("/clientes/nuevo")}
                aria-label="Agregar Cliente"
              />
            </Flex>
          </Flex>
  
          {/* Buscador */}
          <Box px={4} pb={4} bg="white">
            <InputGroup>
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
          <VStack spacing={1} align="stretch" mt={2}>
            {clientes.map((cliente) => (
              <Box 
                key={cliente.id}
                p={4} 
                bg="white" 
                _active={{ bg: "gray.50" }} 
                transition="0.2s"
                cursor="pointer"
                onClick={() => handleClienteClick(cliente)}
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
                  
                  <HStack spacing={4}>
                    <VStack align="end" spacing={0}>
                      <Text fontWeight="bold" fontSize="sm" color="#004481">
                        {cliente.nombres}
                      </Text>
                      <Badge 
                        colorScheme={cliente.estado === "Mora" ? "red" : "green"} 
                        variant="subtle" 
                        fontSize="10px"
                        borderRadius="full"
                        px={2}
                      >
                        {cliente.estado}
                      </Badge>
                    </VStack>
                    <CaretRight size={16} weight="bold" color="gray.300" />
                  </HStack>
                </HStack>

                {/* MODAL PARA INFO O PRESTAMOS */}
                <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
                <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
                <ModalContent borderRadius="2xl" mx={4}>
                  <ModalBody p={0}>
                    <VStack align="stretch" spacing={0}>
                      <Box p={5} borderBottom="1px solid" borderColor="gray.100">
                        <Text fontWeight="900" color="#004481">{selectedCliente?.nombres}</Text>
                        <Text fontSize="xs" color="gray.500">¿Qué deseas realizar?</Text>
                      </Box>
                      
                      <Button 
                        variant="ghost" justifyContent="start" h="60px" borderRadius="0"
                        leftIcon={<Receipt size={24} weight="duotone" color="#004481" />}
                        onClick={() => navigate(`/prestamos?clienteId=${selectedCliente?.id}`)}
                      >
                        Ver Préstamos
                      </Button>

                      <Button 
                        variant="ghost" justifyContent="start" h="60px" borderRadius="0"
                        borderBottomRadius="2xl"
                        leftIcon={<Info size={24} weight="duotone" color="#004481" />}
                        onClick={() => navigate(`/clientes/detalle/${selectedCliente?.id}`)}
                      >
                        Información del Cliente
                      </Button>
                    </VStack>
                  </ModalBody>
                </ModalContent>
              </Modal>
              </Box>
              
            ))}
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