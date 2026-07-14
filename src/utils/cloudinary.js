// Las imágenes de canchas se suben con la transformación q_auto,f_auto,w_800,c_limit
// (ver CloudinaryService en el backend), pero muchos lugares de la UI las
// muestran como miniaturas de 80-180px. Pedir siempre los 800px desperdicia
// ancho de banda. Esta función reescribe el segmento de transformación de la
// URL para pedir un ancho más chico, manteniendo auto-formato/calidad.
export function cloudinaryResize(url, width) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace(/\/upload\/[^/]+\//, `/upload/q_auto,f_auto,w_${width},c_limit/`);
}
