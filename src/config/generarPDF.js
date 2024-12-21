import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import path from 'path';

export async function generarPDF(datos) {
  const pdfPath = './model/PETICION_INICIAL_MONITORIO_MODELO.pdf';
  const existingPdfBytes = fs.readFileSync(pdfPath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pages = pdfDoc.getPages();
  const primeraPagina = pages[0];
  const { width, height } = primeraPagina.getSize();

  // Usa una fuente estándar embebida
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Modificar el PDF con los datos proporcionados
  primeraPagina.drawText(`Nombre del Cliente: ${datos.nombre}`, {
    x: 50,
    y: height - 100,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  primeraPagina.drawText(`Cantidad Reclamada: ${datos.cantidad}`, {
    x: 50,
    y: height - 120,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  primeraPagina.drawText(`Lugar y Fecha: ${datos.fecha}`, {
    x: 50,
    y: height - 140,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  // Guardar el PDF modificado
  const pdfBytes = await pdfDoc.save();
  const outputPath = `./uploads/PETICION_INICIAL_${Date.now()}.pdf`;
  fs.writeFileSync(outputPath, pdfBytes);

  return outputPath;
}
