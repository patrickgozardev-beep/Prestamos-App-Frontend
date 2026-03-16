import { 
    VStack, Box, Text, IconButton, Flex, Button, Textarea, 
    useToast, Skeleton, Icon 
  } from "@chakra-ui/react";
  import { ArrowLeft, WhatsappLogo, Copy } from "phosphor-react";
  import { useEffect, useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import MainLayout from "../../layouts/MainLayout";
  import prestamoService from "../../api/prestamoService"; // Importamos tu servicio
  
  const NotificarPrestamo = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const toast = useToast();
    
    const [loading, setLoading] = useState(true);
    const [whatsappUrl, setWhatsappUrl] = useState("");
    const [mensajeTexto, setMensajeTexto] = useState("");
  
    const cargarMensaje = async () => {
        if (!id) return;
        try {
          setLoading(true);
          // 🚀 Consumiendo el nuevo endpoint desde el service
          const data = await prestamoService.obtenerLinkWhatsApp(Number(id));
          
          setWhatsappUrl(data.link);
          
          // Decodificamos el texto para que sea legible en el Textarea
          const urlObj = new URL(data.link);
          const textoDecodificado = decodeURIComponent(urlObj.searchParams.get("text") || "");
          setMensajeTexto(textoDecodificado);
          
        } catch (error) {
          toast({ 
            title: "Error", 
            description: "No se pudo generar el mensaje del cronograma", 
            status: "error" 
          });
          navigate(-1);
        } finally {
          setLoading(false);
        }
    };

    const copiarMensaje = async () => {
    try {
        await navigator.clipboard.writeText(mensajeTexto);
    
        toast({
        title: "Mensaje copiado",
        description: "El mensaje fue copiado al portapapeles",
        status: "success",
        duration: 1200,
        isClosable: true,
        });
    
    } catch (err) {
        console.error("Error al copiar:", err);
    }
    };

    useEffect(() => {
      cargarMensaje();
    }, [id, navigate, toast]);
  
    const handleEnviar = () => {
      if (whatsappUrl) window.open(whatsappUrl, "_blank");
    };
  
    return (
      <MainLayout>
        <VStack spacing={0} align="stretch" bg="gray.50" minH="100vh" w="full">
          <Flex align="center" py={4} px={4} bg="white" shadow="sm">
            <IconButton icon={<ArrowLeft size={24} />} variant="ghost" onClick={() => navigate(-1)} color="#004481" aria-label="Volver"/>
            <Text fontSize="lg" fontWeight="bold" color="#004481" ml={2}>Notificar Cronograma</Text>
          </Flex>
  
          <VStack p={4} spacing={6} align="stretch">
            <Box bg="white" p={6} borderRadius="2xl" shadow="md">
              <Text fontSize="xs" color="gray.500" fontWeight="black" mb={4} textAlign="center" letterSpacing="wider">
                VISTA PREVIA DEL MENSAJE
              </Text>
  
              {loading ? (
                <VStack align="stretch">
                  <Skeleton h="200px" borderRadius="xl" />
                  <Skeleton h="60px" borderRadius="xl" mt={4} />
                </VStack>
              ) : (
                <VStack spacing={5}>
                  <Box position="relative" w="full">
                    <Textarea
                      value={mensajeTexto}
                      isReadOnly
                      h="280px"
                      borderRadius="xl"
                      bg="blue.50"
                      borderColor="blue.100"
                      fontSize="sm"
                      p={4}
                      whiteSpace="pre-wrap" 
                    />
                    <IconButton
                      icon={<Copy size={20} />}
                      size="sm"
                      position="absolute"
                      bottom={3}
                      right={3}
                      onClick={() => copiarMensaje()}
                      aria-label="Copiar"
                      colorScheme="blue"
                      variant="ghost"
                    />
                  </Box>
  
                  <Button 
                    w="full" h="70px" bg="#25D366" color="white"
                    leftIcon={<WhatsappLogo size={32} weight="fill" />}
                    _hover={{ bg: "#1da851" }}
                    _active={{ transform: "scale(0.96)" }}
                    onClick={handleEnviar}
                    borderRadius="2xl"
                    fontSize="md"
                    fontWeight="bold"
                    shadow="xl"
                  >
                    ENVIAR A WHATSAPP
                  </Button>
                </VStack>
              )}
            </Box>
          </VStack>
        </VStack>
      </MainLayout>
    );
  };
  
  export default NotificarPrestamo;