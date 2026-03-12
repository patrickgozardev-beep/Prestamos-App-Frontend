import { 
    VStack, Text, Box, IconButton, Flex, FormControl, 
    FormLabel, Input, Button, InputGroup, InputLeftAddon, 
    Icon, Center, useDisclosure, Modal, ModalOverlay, 
    ModalContent, ModalHeader, ModalBody, ModalFooter, useToast, Spinner,
    FormErrorMessage
  } from "@chakra-ui/react";
  import { CaretLeft, CloudArrowUp, FloppyDiskBack, Warning } from "phosphor-react";
  import MainLayout from "../../layouts/MainLayout";
  import { useNavigate, useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import clienteService from "../../api/clienteService";
  import { soloNumeros, REGEX_DNI, REGEX_TELEFONO } from "../../utils/validaciones";

  const EditarCliente = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    const [loading, setLoading] = useState(true); // Carga inicial de datos
    const [isUpdating, setIsUpdating] = useState(false); // Estado del botón guardar
  
    const [formData, setFormData] = useState({
      nombres: "",
      dni: "",
      telefono: "",
      googleMapsLink: "",
      dniPdf: ""
    });
  
    // 1. Cargar datos del cliente al iniciar
    useEffect(() => {
      const cargarCliente = async () => {
        if (!id) return;
        try {
          setLoading(true);
          const data = await clienteService.obtenerPorId(Number(id));
          setFormData({
            nombres: data.nombres,
            dni: data.dni,
            telefono: data.telefono || "",
            googleMapsLink: data.googleMapsLink || "",
            dniPdf: data.dniPdf || ""
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo cargar la información del cliente.",
            status: "error",
          });
          navigate("/clientes");
        } finally {
          setLoading(false);
        }
      };
      cargarCliente();
    }, [id, navigate, toast]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Si es DNI o Teléfono, aplicamos filtro de "solo números" antes de guardar
    if (id === "dni" || id === "telefono") {
        const numerico = soloNumeros(value);
        
        // Limitamos la longitud máxima
        if (id === "dni" && numerico.length > 8) return;
        if (id === "telefono" && numerico.length > 9) return;
        
        setFormData({ ...formData, [id]: numerico });
    } else {
        setFormData({ ...formData, [id]: value });
    }
    };

    const dniError = formData.dni.length > 0 && !REGEX_DNI.test(formData.dni);
    const telefonoError = formData.telefono.length > 0 && !REGEX_TELEFONO.test(formData.telefono);
    
    const handleUpdate = async () => {
      if (!id) return;
      setIsUpdating(true);
      try {
        const clienteEditado: any = {
          ...formData,
          usuario: { id: 1 } // Mantener el vínculo con el usuario
        };
  
        await clienteService.actualizar(Number(id), clienteEditado);
        
        toast({
          title: "Cliente actualizado",
          description: "Los cambios se guardaron correctamente.",
          status: "success",
          duration: 3000,
        });
        
        onClose();
        navigate(`/clientes/detalle/${id}`); // Regresar al detalle
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un problema al actualizar.",
          status: "error",
        });
      } finally {
        setIsUpdating(false);
      }
    };
  
    if (loading) {
      return (
        <MainLayout>
          <Center h="80vh">
            <Spinner speed="0.65s" color="#004481" size="xl" />
          </Center>
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
              onClick={() => navigate(-1)} // Regresa a la pantalla anterior
              aria-label="Volver"
              color="#004481"
            />
            <Text fontSize="lg" fontWeight="bold" color="#004481" ml={2}>
              Editar Perfil
            </Text>
          </Flex>
  
          <Box p={6}>
            <VStack spacing={6}>
              
              <FormControl id="nombres" isRequired>
                <FormLabel fontSize="xs" fontWeight="900" color="gray.500">NOMBRES COMPLETOS</FormLabel>
                <Input variant="flushed" focusBorderColor="#004481" value={formData.nombres} onChange={handleChange} />
              </FormControl>
  
              <FormControl id="dni" isRequired isInvalid={dniError}>
                <FormLabel fontSize="xs" fontWeight="900" color="gray.500">DNI</FormLabel>
                <Input variant="flushed" type="number" focusBorderColor="#004481" value={formData.dni} onChange={handleChange} />
                {dniError && <FormErrorMessage>El DNI debe tener 8 dígitos exactos.</FormErrorMessage>}
              </FormControl>
  
              <FormControl id="telefono" isInvalid={telefonoError}>
              <FormLabel fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                  Teléfono
              </FormLabel>
              <InputGroup variant="flushed">
                  {/* Añadimos pr={2} para separar el +51 del número y borderBottom para mantener la línea */}
                  <InputLeftAddon 
                  children="+51" 
                  bg="transparent" 
                  color="gray.400" 
                  pr={4} // 👈 Esto empuja el número hacia la derecha
                  borderBottom="1px solid" 
                  borderColor="gray.200"
                  />
                  <Input 
                  placeholder="987 654 321" 
                  type="tel" 
                  focusBorderColor="#004481" 
                  value={formData.telefono} 
                  onChange={handleChange}
                  pl={2} // 👈 Un pequeño espacio extra desde el inicio del input
                  />
              </InputGroup>
                {telefonoError && (
                    <FormErrorMessage>Debe empezar con 9 y tener 9 dígitos.</FormErrorMessage>
                )}
              </FormControl>
  
              <FormControl id="googleMapsLink">
                <FormLabel fontSize="xs" fontWeight="900" color="gray.500">LINK DE UBICACIÓN</FormLabel>
                <Input variant="flushed" focusBorderColor="#004481" value={formData.googleMapsLink} onChange={handleChange} />
              </FormControl>
  
              <Box w="full" pt={6}>
                <Button 
                  bg="#004481" color="white" w="full" size="lg" borderRadius="none"
                  _hover={{ bg: "#003366" }}
                  onClick={onOpen} // Abre confirmación
                  leftIcon={<FloppyDiskBack weight="bold" />}
                >
                  Guardar Cambios
                </Button>
              </Box>
  
            </VStack>
          </Box>
  
          {/* MODAL DE CONFIRMACIÓN */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="2xl">
              <ModalHeader textAlign="center" pt={8}>
                <Center mb={2}>
                  <Icon as={Warning} size={48} color="#004481" weight="duotone" />
                </Center>
                <Text fontSize="md" color="#004481">¿Actualizar datos?</Text>
              </ModalHeader>
              <ModalBody textAlign="center">
                <Text fontSize="sm" color="gray.600">
                  Se modificarán permanentemente los datos del cliente.
                </Text>
              </ModalBody>
              <ModalFooter flexDirection="column" gap={2} pb={8}>
                <Button 
                  bg="#004481" color="white" w="full" borderRadius="none"
                  isLoading={isUpdating}
                  onClick={handleUpdate}
                >
                  Confirmar
                </Button>
                <Button variant="ghost" w="full" onClick={onClose} isDisabled={isUpdating}>
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
  
        </VStack>
      </MainLayout>
    );
  };
  
  export default EditarCliente;