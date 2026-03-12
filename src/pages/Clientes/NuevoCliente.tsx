import { 
  VStack, Text, Box, IconButton, Flex, FormControl, 
  FormLabel, Input, Button, InputGroup, InputLeftAddon, 
  Icon, Center, useDisclosure, Modal, ModalOverlay, 
  ModalContent, ModalHeader, ModalBody, ModalFooter, useToast,
  FormErrorMessage
} from "@chakra-ui/react";
import { CaretLeft, CloudArrowUp, MapPin, CheckCircle } from "phosphor-react";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import clienteService from "../../api/clienteService";
import { soloNumeros, REGEX_DNI, REGEX_TELEFONO } from "../../utils/validaciones";

const NuevoCliente = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombres: "",
    dni: "",
    telefono: "",
    googleMapsLink: "",
    // Por ahora el PDF lo manejamos como string vacío o null si no tienes el upload listo
    dniPdf: ""
  });

  const dniError = formData.dni.length > 0 && !REGEX_DNI.test(formData.dni);
  const telefonoError = formData.telefono.length > 0 && !REGEX_TELEFONO.test(formData.telefono);

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Objeto cliente alineado a tu backend
      const nuevoCliente: any = {
        ...formData,
        usuario: { id: 1 } // ID del usuario en sesión (Hardcoded por ahora)
      };

      await clienteService.crear(nuevoCliente);
      
      toast({
        title: "Registro exitoso",
        description: `El cliente ${formData.nombres} ha sido guardado.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      onClose(); // Cerrar modal
      navigate("/clientes");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar al cliente. Revisa los datos.",
        status: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <VStack spacing={0} align="stretch" w="full" bg="white" minH="100vh">
        
        {/* Header Superior */}
        <Flex align="center" py={4} px={2} borderBottom="1px solid" borderColor="gray.100">
          <IconButton
            icon={<CaretLeft size={24} weight="bold" />}
            variant="ghost"
            onClick={() => navigate("/clientes")}
            aria-label="Volver"
            color="#004481"
          />
          <Text fontSize="lg" fontWeight="bold" color="#004481" ml={2}>
            Registrar Cliente
          </Text>
        </Flex>

        <Box p={6}>
          <VStack spacing={6}>
            
            <FormControl id="nombres" isRequired>
              <FormLabel fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">Nombres Completos</FormLabel>
              <Input variant="flushed" placeholder="Ej. Juan Pérez" focusBorderColor="#004481" value={formData.nombres} onChange={handleChange} />
            </FormControl>

            <FormControl id="dni" isInvalid={dniError}>
            <FormLabel fontSize="xs" fontWeight="900" color="gray.500">DNI</FormLabel>
              <Input 
                variant="flushed" 
                placeholder="8 dígitos" 
                value={formData.dni} 
                onChange={handleChange} 
              />
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
              <FormLabel fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">Link de Ubicación (Maps)</FormLabel>
              <Input variant="flushed" placeholder="https://goo.gl/maps/..." focusBorderColor="#004481" value={formData.googleMapsLink} onChange={handleChange} />
            </FormControl>

            <Box w="full" pt={6}>
              <Button 
                bg="#004481" color="white" w="full" size="lg" borderRadius="none"
                _hover={{ bg: "#003366" }}
                onClick={onOpen} // Abre el modal de confirmación
                isDisabled={!formData.nombres || !formData.dni} // Validación básica
              >
                Guardar Cliente
              </Button>
            </Box>

          </VStack>
        </Box>

        {/* --- MODAL DE CONFIRMACIÓN --- */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius="2xl">
            <ModalHeader textAlign="center" pt={8}>
              <Center mb={2}>
                <Icon as={CheckCircle} size={48} color="#004481" weight="duotone" />
              </Center>
              <Text fontSize="md" color="#004481">¿Confirmas el registro?</Text>
            </ModalHeader>
            <ModalBody textAlign="center" px={6}>
              <Text fontSize="sm" color="gray.600">
                Se registrará a <strong>{formData.nombres}</strong> en el sistema de Gozar Capital.
              </Text>
            </ModalBody>
            <ModalFooter flexDirection="column" gap={2} pb={8}>
              <Button 
                bg="#004481" color="white" w="full" borderRadius="none"
                isLoading={loading}
                onClick={handleSubmit}
              >
                Sí, registrar
              </Button>
              <Button variant="ghost" w="full" onClick={onClose} isDisabled={loading}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </VStack>
    </MainLayout>
  );
};

export default NuevoCliente;