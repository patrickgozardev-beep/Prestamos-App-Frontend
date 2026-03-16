// src/components/prestamos/FiltroPrestamos.js
import { 
    Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
    VStack, Text, Select, Input, Button, FormControl, FormLabel, SimpleGrid 
  } from "@chakra-ui/react";
  
  const FiltroPrestamos = ({ isOpen, onClose, filtros, setFiltros, aplicarFiltros }) => {
    return (
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent borderTopRadius="2xl">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" color="#004481">Filtrar Préstamos</DrawerHeader>
  
          <DrawerBody py={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">Estado del Préstamo</FormLabel>
                <Select 
                  value={filtros.estado} 
                  onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                >
                  <option value="">Todos</option>
                  <option value="ACTIVO">Activos</option>
                  <option value="PAGADO">Finalizados</option>
                  <option value="ATRASADO">Con Atraso</option>
                </Select>
              </FormControl>
  
              <SimpleGrid columns={2} spacing={3} w="full">
                <FormControl>
                  <FormLabel fontSize="sm">Desde</FormLabel>
                  <Input 
                    type="date" 
                    value={filtros.fechaInicio} 
                    onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Hasta</FormLabel>
                  <Input 
                    type="date" 
                    value={filtros.fechaFin} 
                    onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                  />
                </FormControl>
              </SimpleGrid>
  
              <FormControl>
                <FormLabel fontSize="sm">Monto mayor a:</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Ej. 1000"
                  value={filtros.montoMin}
                  onChange={(e) => setFiltros({...filtros, montoMin: e.target.value})}
                />
              </FormControl>
  
              <Button w="full" bg="#004481" color="white" onClick={aplicarFiltros} size="lg">
                Aplicar Filtros
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  };