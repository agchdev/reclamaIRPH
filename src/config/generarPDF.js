import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function generarPDF(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const fontSize = 12;
  const { width, height } = page.getSize();

  let x = 50, y = height - 50;

  page.drawText(`Nombre: ${data.nombre}`, { x, y, size: fontSize });
  y -= 20;
  page.drawText(`Email: ${data.email}`, { x, y, size: fontSize });
  y -= 20;
  page.drawText(`Mensaje: ${data.mensaje}`, { x, y, size: fontSize });
  y -= 20;
  page.drawText(`Fecha: ${data.fecha}`, { x, y, size: fontSize });

  const pdfBytes = await pdfDoc.save();
  const pdfPath = path.join('./uploads', `formulario_${Date.now()}.pdf`);
  fs.writeFileSync(pdfPath, pdfBytes);

  return pdfPath;
}
