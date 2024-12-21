import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generarPDF(data) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit); // Registra fontkit

  const page = pdfDoc.addPage([595, 842]); // Tamaño A4 en puntos
  const fontSize = 12;
  const { width, height } = page.getSize();

  // Cargar una fuente personalizada desde un archivo .ttf
  const fontPath = path.join(__dirname, '../../fonts/Times-Roman.ttf');
  if (!fs.existsSync(fontPath)) {
    throw new Error(`El archivo de fuente no se encuentra en ${fontPath}`);
  }
  const fontBytes = fs.readFileSync(fontPath);
  const customFont = await pdfDoc.embedFont(fontBytes);

  // Estilos personalizados
  const normalColor = rgb(0, 0, 0);
  const redColor = rgb(1, 0, 0);
  // Dibujar título centrado, en negrita y subrayado
  const title = 'AL JUZGADO DE PRIMERA INSTANCIA';
  const titleWidth = customFont.widthOfTextAtSize(title, fontSize + 2);
  const titleX = (width - titleWidth) / 2; // Centramos el texto horizontalmente
  const titleY = height - 50;

  page.drawText(title, {
    x: titleX,
    y: titleY,
    size: fontSize + 2,
    font: customFont,
    color: normalColor,
  });

  // Dibujar subrayado
  const underlineY = titleY - 2; // Justo debajo del texto
  page.drawLine({
    start: { x: titleX, y: underlineY },
    end: { x: titleX + titleWidth, y: underlineY },
    thickness: 1,
    color: normalColor,
  });

  // Dibujar subtítulo
  page.drawText(
    'DON JUAN ANTONIO MONTENEGRO RUBIO, Procurador de los Tribunales, en',
    {
      x: 50,
      y: height - 100,
      size: fontSize,
      font: customFont,
      color: normalColor,
    }
  );

  page.drawText('nombre de ', {
    x: 50,
    y: height - 120,
    size: fontSize,
    font: customFont,
    color: normalColor,
  });

  page.drawText('XXXXXXX (cliente)', {
    x: 110,
    y: height - 120,
    size: fontSize,
    font: customFont,
    color: redColor,
  });

  page.drawText(
    ', cuya representación acreditaré mediante comparecencia',
    {
      x: 50,
      y: height - 140,
      size: fontSize,
      font: customFont,
      color: normalColor,
    }
  );

  page.drawText('“apud acta” y asistido del Letrado del Ilustre Colegio de Abogados de Granada, José', {
    x: 50,
    y: height - 160,
    size: fontSize,
    font: customFont,
    color: normalColor,
  });

  page.drawText('Manuel Aguayo Pozo, Colegiado 3031, como mejor proceda en derecho, comparezco y', {
    x: 50,
    y: height - 180,
    size: fontSize,
    font: customFont,
    color: normalColor,
  });

  page.drawText('DIGO:', {
    x: 50,
    y: height - 210,
    size: fontSize,
    font: customFont,
    color: normalColor,
  });

  // Guardar el PDF generado
  const pdfBytes = await pdfDoc.save();
  const pdfPath = path.join('./uploads', `formulario_${Date.now()}.pdf`);
  fs.writeFileSync(pdfPath, pdfBytes);

  return pdfPath;
}
