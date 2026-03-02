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
import { useState } from "react";
  
  const Clientes = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedCliente, setSelectedCliente] = useState<any>(null);
  
    const handleClienteClick = (cliente: any) => {
      setSelectedCliente(cliente);
      onOpen();
    };
    // Datos de ejemplo que luego vendrán de tu API
    const clientes = [
      { id: 1, nombre: "Juan Pérez", dni: "726354XX", estado: "Activo", monto: "S/ 1,200" },
      { id: 2, nombre: "María Rojas", dni: "092837XX", estado: "Pendiente", monto: "S/ 500" },
      { id: 3, nombre: "Carlos Solis", dni: "453627XX", estado: "Mora", monto: "S/ 2,000" },
    ];
  
    return (
      <MainLayout>
        <VStack spacing={0} align="stretch" w="full" minH="100vh">
          
          {/* Header de Navegación estilo BBVA */}
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
                _focus={{ bg: "white", boxShadow: "outline" }}
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
                        {cliente.nombre}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        DNI: {cliente.dni}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <HStack spacing={4}>
                    <VStack align="end" spacing={0}>
                      <Text fontWeight="bold" fontSize="sm" color="#004481">
                        {cliente.monto}
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
                        <Text fontWeight="900" color="#004481">{selectedCliente?.nombre}</Text>
                        <Text fontSize="xs" color="gray.500">¿Qué deseas realizar?</Text>
                      </Box>
                      
                      <Button 
                        variant="ghost" justifyContent="start" h="60px" borderRadius="0"
                        leftIcon={<Receipt size={24} weight="duotone" color="#004481" />}
                        onClick={() => navigate(`/prestamos?clienteId=${selectedCliente.id}`)}
                      >
                        Ver Préstamos
                      </Button>

                      <Button 
                        variant="ghost" justifyContent="start" h="60px" borderRadius="0"
                        borderBottomRadius="2xl"
                        leftIcon={<Info size={24} weight="duotone" color="#004481" />}
                        onClick={() => navigate(`/clientes/detalle/${selectedCliente.id}`)}
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