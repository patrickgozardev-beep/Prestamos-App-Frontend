import { 
    VStack, Text, Box, HStack, IconButton, Flex, FormControl, 
    FormLabel, Input, Button, InputGroup, InputLeftAddon, 
    Stack, Icon, Center 
  } from "@chakra-ui/react";
  import { CaretLeft, User, Phone, IdentificationCard, MapPin, FilePdf, CloudArrowUp } from "phosphor-react";
  import MainLayout from "../../layouts/MainLayout";
  import { useNavigate } from "react-router-dom";
  
  const NuevoCliente = () => {
    const navigate = useNavigate();
  
    return (
      <MainLayout>
        <VStack spacing={0} align="stretch" w="full" bg="white" minH="100vh">
          
          {/* Header Superior estilo BBVA */}
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
              
              {/* Campo: Nombres */}
              <FormControl id="nombres">
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                  Nombres Completos
                </FormLabel>
                <InputGroup>
                  <Input 
                    variant="flushed" 
                    placeholder="Ej. Juan Pérez" 
                    focusBorderColor="#004481" 
                    fontSize="md"
                  />
                </InputGroup>
              </FormControl>
  
              {/* Campo: DNI */}
              <FormControl id="dni">
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                  Documento de Identidad (DNI)
                </FormLabel>
                <Input 
                  variant="flushed" 
                  placeholder="8 dígitos" 
                  type="number"
                  focusBorderColor="#004481" 
                />
              </FormControl>
  
              {/* Campo: Teléfono */}
              <FormControl id="telefono">
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                  Teléfono de contacto
                </FormLabel>
                <InputGroup variant="flushed">
                  <InputLeftAddon children="+51" bg="transparent" fontSize="md" color="gray.400" mr={3} />
                  <Input 
                    placeholder="987 654 321" 
                    type="tel"
                    focusBorderColor="#004481" 
                  />
                </InputGroup>
              </FormControl>
  
              {/* Campo: Google Maps */}
              <FormControl id="maps">
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                  Link de Ubicación (Maps)
                </FormLabel>
                <Input 
                  variant="flushed" 
                  placeholder="https://goo.gl/maps/..." 
                  focusBorderColor="#004481" 
                />
              </FormControl>
  
              {/* Campo: Carga de PDF (DNI) */}
              <FormControl id="dni_pdf">
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                  Copia de DNI (PDF)
                </FormLabel>
                <Center 
                  w="full" 
                  p={6} 
                  border="2px dashed" 
                  borderColor="gray.200" 
                  borderRadius="xl"
                  bg="gray.50"
                  cursor="pointer"
                  flexDirection="column"
                  _hover={{ bg: "blue.50", borderColor: "#004481" }}
                >
                  <Icon as={CloudArrowUp} size={32} color="#004481" weight="duotone" />
                  <Text fontSize="sm" color="gray.600" mt={2}>Toca para subir el archivo</Text>
                  <Text fontSize="xs" color="gray.400">Formato permitido: PDF (Máx. 5MB)</Text>
                </Center>
              </FormControl>
  
              <Box w="full" pt={6}>
                <Button 
                  bg="#004481" 
                  color="white" 
                  w="full" 
                  size="lg" 
                  borderRadius="none" // Estilo BBVA
                  _hover={{ bg: "#003366" }}
                  onClick={() => {
                     // Aquí iría tu fetch a la API
                     console.log("Cliente registrado");
                     navigate("/clientes");
                  }}
                >
                  Guardar Cliente
                </Button>
                <Text fontSize="xs" color="gray.400" textAlign="center" mt={4}>
                  Asegúrate de que los datos coincidan con el documento físico.
                </Text>
              </Box>
  
            </VStack>
          </Box>
        </VStack>
      </MainLayout>
    );
  };
  
  export default NuevoCliente;