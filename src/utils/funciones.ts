export const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return "";
    // Asumiendo que viene como "YYYY-MM-DD"
    const [year, month, day] = fechaStr.split("-");
    return `${day}/${month}/${year}`;
  };