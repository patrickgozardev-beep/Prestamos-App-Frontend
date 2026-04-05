import { Badge, Box, Button, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { CheckCircle, Clock, CurrencyDollar } from "phosphor-react";
import { formatearFecha } from "../utils/funciones";

export const CuotaCard = ({ cuota, prestamo, navigate, getBadgeProps }: any) => {
    const props = getBadgeProps(cuota.estado);
    const isFinalizada = cuota.estado === 'PAGADO' || cuota.estado === 'INACTIVO';
  
    return (
      <Box
        bg="white" 
        p={4} 
        borderRadius="xl" 
        shadow="sm"
        onClick={() => {
          // Si ya tiene pagos (Pagado o Parcial), vamos a la lista de pagos de esa cuota
          if (cuota.estado === 'PAGADO' || cuota.estado === 'PARCIAL') {
            navigate(`/pago/cronograma/${cuota.id}`, { 
              state: { numeroCuota: cuota.numeroCuota, prestamoId: prestamo.id } 
            });
          }
        }}
        cursor={!isFinalizada || cuota.estado === 'PAGADO' ? "pointer" : "default"}
        _hover={!isFinalizada ? { bg: "gray.50" } : {}}
      >
        <HStack justifyContent="space-between">
          <HStack spacing={3}>
            <Center bg={props.bg} p={2} borderRadius="lg">
              {cuota.estado === 'PAGADO' ? (
                <CheckCircle size={24} color={props.iconColor} weight="fill" />
              ) : (
                <Clock size={24} color={props.iconColor} weight="fill" />
              )}
            </Center>
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="sm">Cuota {cuota.numeroCuota}</Text>
              <Text fontSize="xs" color="gray.500">Vence: {formatearFecha(cuota.fechaVencimiento)}</Text>
            </VStack>
          </HStack>
  
          <VStack align="end" spacing={0}>
            <Text fontWeight="900" fontSize="md" color="#004481">
              S/ {cuota.monto.toFixed(2)}
            </Text>
            <Badge fontSize="9px" colorScheme={props.color} variant="subtle">
              {cuota.estado}
            </Badge>
          </VStack>
        </HStack>
  
        {/* Botón Registrar Cobro: Solo si NO está pagada ni inactiva */}
        {!isFinalizada && (
          <Button 
            mt={3} 
            size="sm" 
            w="full" 
            colorScheme="blue" 
            variant="outline"
            leftIcon={<CurrencyDollar weight="bold" />}
            borderRadius="lg"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/pago/nuevo/${cuota.id}`, { 
                state: { 
                  montoSugerido: cuota.monto - (cuota.montoPagado || 0), 
                  numeroCuota: cuota.numeroCuota,
                  clienteNombre: prestamo.cliente?.nombres,
                  prestamoId: prestamo.id 
                } 
              });
            }}
          >
            Registrar Cobro
          </Button>
        )}
      </Box>
    );
  };