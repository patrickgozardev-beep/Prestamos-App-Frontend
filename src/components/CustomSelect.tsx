import {
    Box,
    Text,
    VStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Icon,
    Flex
  } from "@chakra-ui/react";
  import { CaretDown, Check } from "phosphor-react";
  
  interface Option {
    value: string | number;
    label: string;
  }
  
  interface CustomSelectProps {
    label: string;
    options: Option[];
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
  }
  
  const CustomSelect = ({ label, options, value, onChange, placeholder }: CustomSelectProps) => {
    // Encontramos el texto de la opción seleccionada para mostrarlo en el botón
    const selectedOption = options.find((opt) => opt.value === value);
  
    return (
<Box w="full" borderBottom="1px solid" borderColor="gray.200" pb={1}>
      <Text
        fontSize="xs"
        color="gray.400"
        fontWeight="900"
        letterSpacing="wider"
        mb={0}
        textTransform="uppercase"
      >
        {label}
      </Text>

      <Menu matchWidth gutter={4}>
        <MenuButton
          as={Button}
          variant="unstyled"
          w="full"
          h="40px"
          /* Quitamos el borde celeste del focus y el outline */
          _focus={{ boxShadow: "none", outline: "none" }}
          _active={{ bg: "transparent" }}
        >
          <Flex justify="space-between" align="center" w="full" px={1}>
            <Text
              fontWeight="500"
              fontSize="md"
              color={selectedOption ? "gray.700" : "gray.400"}
              noOfLines={1}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </Text>
            
            <Icon 
              as={CaretDown} 
              color="#004481" 
              weight="bold" 
              fontSize="14px" 
              mr={2} 
            />
          </Flex>
        </MenuButton>

        <MenuList 
          borderRadius="xl" 
          shadow="xl" 
          border="1px solid"
          borderColor="gray.100"
          py={2}
          zIndex={1500}
          _focus={{ boxShadow: "xl" }} // Evita el borde celeste al abrir
        >
          {options.map((opt) => (
            <MenuItem
              key={opt.value}
              onClick={() => onChange(opt.value.toString())}
              py={3}
              px={4}
              bg={value?.toString() === opt.value.toString() ? "blue.50" : "transparent"}
              _hover={{ bg: "gray.50" }}
              _focus={{ bg: "gray.50" }} // Limpia el focus negro del item
            >
              <Flex justify="space-between" align="center" w="full">
                <Text 
                  color={value?.toString() === opt.value.toString() ? "#004481" : "gray.700"} 
                  fontWeight={value?.toString() === opt.value.toString() ? "bold" : "normal"}
                >
                  {opt.label}
                </Text>
                {value?.toString() === opt.value.toString() && (
                  <Icon as={Check} color="#004481" weight="bold" />
                )}
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
    );
  };
  
  export default CustomSelect;