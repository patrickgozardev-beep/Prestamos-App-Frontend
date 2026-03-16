import { useState, useEffect } from "react";
import { Box, Text, HStack, Grid, GridItem } from "@chakra-ui/react";

const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];
const SUBS: Record<string, string> = {
  2:'ABC', 3:'DEF', 4:'GHI', 5:'JKL',
  6:'MNO', 7:'PQRS', 8:'TUV', 9:'WXYZ'
};
const MAX_PIN = 6;

interface PinKeyboardProps {
  onComplete: (pin: string) => void;
  onChange?: (pin: string) => void;
  resetSignal?: number; // ✅ cada vez que cambie este número, se limpia el PIN
}

const PinKeyboard = ({ onComplete, onChange, resetSignal }: PinKeyboardProps) => {
  const [pin, setPin] = useState<string[]>([]);

  // ✅ Se limpia cuando el padre incrementa resetSignal
  useEffect(() => {
    if (resetSignal !== undefined && resetSignal > 0) {
      setPin([]);
      onChange?.('');
    }
  }, [resetSignal]);

  const handleKey = (k: string) => {
    if (k === '⌫') {
      const next = pin.slice(0, -1);
      setPin(next);
      onChange?.(next.join(''));
    } else if (pin.length < MAX_PIN) {
      const next = [...pin, k];
      setPin(next);
      onChange?.(next.join(''));
      if (next.length === MAX_PIN) onComplete(next.join(''));
    }
  };

  return (
    <Box py={6} px={4} w="full">
      <Text fontSize="xs" fontWeight="bold" color="gray.500"
        textTransform="uppercase" letterSpacing="wider" textAlign="center" mb={6}>
        Contraseña
      </Text>

      <HStack justify="center" spacing={4} mb={8}>
        {Array.from({ length: MAX_PIN }).map((_, i) => (
          <Box
            key={i}
            w="13px" h="13px"
            borderRadius="full"
            border="2px solid"
            borderColor={i < pin.length ? "#004481" : "gray.300"}
            bg={i < pin.length ? "#004481" : "transparent"}
            transition="all 0.15s"
            transform={i < pin.length ? "scale(1.15)" : "scale(1)"}
          />
        ))}
      </HStack>

      <Grid templateColumns="repeat(3, 1fr)" gap={3} maxW="264px" mx="auto">
        {KEYS.map((k, idx) => (
          <GridItem key={idx} display="flex" justifyContent="center">
            {k === '' ? (
              <Box w="80px" h="64px" />
            ) : (
              <Box
                as="button"
                w="80px" h="64px"
                borderRadius="full"
                bg={k === '⌫' ? "gray.100" : "#004481"}
                color={k === '⌫' ? "#004481" : "white"}
                border="none"
                cursor="pointer"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                _active={{ bg: k === '⌫' ? "gray.200" : "#003366", transform: "scale(0.93)" }}
                transition="all 0.1s"
                onClick={() => handleKey(k)}
                type="button"
              >
                <Text fontSize="20px" fontWeight="500" lineHeight="1">{k}</Text>
                {SUBS[k] && (
                  <Text fontSize="8px" color="whiteAlpha.700" letterSpacing="widest" mt="2px">
                    {SUBS[k]}
                  </Text>
                )}
              </Box>
            )}
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default PinKeyboard;