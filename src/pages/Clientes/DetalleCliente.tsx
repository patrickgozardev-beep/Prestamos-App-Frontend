import { 
  VStack, Text, Box, Flex, IconButton, Button, SimpleGrid, 
  Divider, HStack, useToast, Center, Spinner,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Icon
} from "@chakra-ui/react";
import { CaretLeft, Trash, PencilLine, MapPin, Warning, House, FilePdf, Eye } from "phosphor-react";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ClienteDTO } from "../../types/Cliente";
import clienteService from "../../api/clienteService";

const DetalleCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  // Solo mantenemos el disclosure para la eliminación
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [cliente, setCliente] = useState<ClienteDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await clienteService.obtenerPorId(Number(id));
        setCliente(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo obtener la información del cliente",
          status: "error",
          duration: 3000,
        });
        navigate("/clientes");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id, navigate, toast]);

  const handleEliminar = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      await clienteService.eliminar(Number(id));
      toast({ title: "Cliente eliminado", status: "success" });
      navigate("/clientes");
    } catch (error) {
      toast({ title: "Error al eliminar", status: "error" });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Center h="80vh"><Spinner color="#004481" size="xl" /></Center>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <VStack spacing={0} align="stretch" w="full" bg="white" minH="100vh">
        {/* Header */}
        <Flex align="center" py={4} px={2} borderBottom="1px solid" borderColor="gray.100">
          <IconButton 
            icon={<CaretLeft size={24} weight="bold" />} 
            variant="ghost" 
            onClick={() => navigate("/clientes")} 
            color="#004481" 
            aria-label="Volver" 
          />
          <Text fontSize="lg" fontWeight="bold" color="#004481">Perfil del Cliente</Text>
          <Flex flex={1} justify="flex-end">
              <IconButton
                icon={<House size={24} weight="duotone" />}
                colorScheme="blue"
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                aria-label="Inicio"
              />
          </Flex>
        </Flex>

        <Box p={6}>
          <VStack align="start" spacing={6}>
            <Box>
              <Text fontSize="xs" color="gray.500" fontWeight="900" letterSpacing="widest">NOMBRES</Text>
              <Text fontSize="xl" fontWeight="bold" color="gray.700">{cliente?.nombres}</Text>
            </Box>

            <SimpleGrid columns={2} w="full" spacing={4}>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="900" letterSpacing="widest">DNI</Text>
                <Text fontWeight="medium" color="gray.600">{cliente?.dni}</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="900" letterSpacing="widest">TELÉFONO</Text>
                <Text fontWeight="medium" color="gray.600">{cliente?.telefono || "No registrado"}</Text>
              </Box>
            </SimpleGrid>

            <Divider />

            {/* --- SECCIÓN DE DOCUMENTACIÓN (AHORA ABRE URL) --- */}
            <Box w="full">
              <Text fontSize="xs" color="gray.500" fontWeight="900" letterSpacing="widest" mb={3}>DOCUMENTACIÓN</Text>
              {cliente?.dniPdf ? (
                <HStack 
                  p={4} 
                  bg="blue.50" 
                  borderRadius="lg" 
                  border="1px solid" 
                  borderColor="blue.100"
                  justify="space-between"
                  cursor="pointer"
                  // Aquí se abre la URL directamente
                  onClick={() => window.open(cliente.dniPdf, "_blank", "noopener,noreferrer")}
                  _hover={{ bg: "blue.100" }}
                  transition="all 0.2s"
                >
                  <HStack>
                    <Icon as={FilePdf} size={28} color="#004481" weight="fill" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold" color="#004481">DNI Digitalizado</Text>
                      <Text fontSize="xs" color="blue.600">Click para ver documento</Text>
                    </VStack>
                  </HStack>
                  <Icon as={Eye} size={20} color="#004481" />
                </HStack>
              ) : (
                <Text fontSize="sm" color="gray.400">No se adjuntó documento DNI</Text>
              )}
            </Box>

            {cliente?.googleMapsLink && (
              <Button 
                leftIcon={<MapPin weight="fill" />} 
                variant="link" 
                color="#004481" 
                size="sm"
                onClick={() => window.open(cliente.googleMapsLink, "_blank")}
              >
                Ver Ubicación en Maps
              </Button>
            )}

            <HStack w="full" pt={10} spacing={4}>
              <Button 
                flex={1} 
                leftIcon={<PencilLine />} 
                colorScheme="blue" 
                variant="outline" 
                borderRadius="md"
                onClick={() => navigate(`/clientes/editar/${id}`)}
              >
                Editar
              </Button>
              <Button 
                flex={1} 
                leftIcon={<Trash />} 
                colorScheme="red" 
                variant="ghost" 
                borderRadius="md"
                onClick={onOpen}
              >
                Eliminar
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius="2xl">
            <ModalHeader textAlign="center" pt={8}>
              <Center mb={2}>
                <Icon as={Warning} size={48} color="red.500" weight="duotone" />
              </Center>
              <Text fontSize="md" color="gray.700">¿Eliminar cliente?</Text>
            </ModalHeader>
            <ModalBody textAlign="center">
              <Text fontSize="sm" color="gray.600">
                Esta acción es permanente. Se borrarán los datos de <strong>{cliente?.nombres}</strong>.
              </Text>
            </ModalBody>
            <ModalFooter flexDirection="column" gap={2} pb={8}>
              <Button 
                colorScheme="red" 
                w="full" 
                borderRadius="none" 
                onClick={handleEliminar}
                isLoading={isDeleting}
              >
                Sí, eliminar
              </Button>
              <Button variant="ghost" w="full" onClick={onClose} isDisabled={isDeleting}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </VStack>
    </MainLayout>
  );
};

export default DetalleCliente;