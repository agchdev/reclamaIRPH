import puppeteer from 'puppeteer';
import fs from 'fs';

export async function generarPDF(datos) {
    try {
        const templatePath = './model/template.html';
        
        // Verificar si el archivo de plantilla existe
        if (!fs.existsSync(templatePath)) {
            throw new Error('El archivo de plantilla HTML no existe.');
        }

        // Leer el contenido del archivo de plantilla
        const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

        // Reemplazar los marcadores en el HTML con los datos dinámicos
        const htmlContent = htmlTemplate
            .replace('{{cliente}}', datos.cliente || 'Sin cliente')
            .replace('{{dineroEnLetra}}', datos.dineroEnLetra || 'Cero euros')
            .replace('{{dineroEnNumero}}', datos.dineroEnNumero || '0.00')
            .replace('{{contraDe}}', datos.contraDe || 'Parte contraria')
            .replace('{{CIFcontra}}', datos.CIFcontra || 'N/A')
            .replace('{{domicilioContra}}', datos.domicilioContra || 'N/A')
            .replace('{{cantidad}}', datos.cantidad || '0.00')
            .replace('{{factura1}}', datos.factura1 || 'N/A')
            .replace('{{fecha}}', datos.fecha || 'N/A')
            .replace('{{importe}}', datos.importe || '0.00')
            .replace('{{pdf1}}', datos.pdf1 || 'Documento no especificado')
            .replace('{{numeroAlbaran}}', datos.numeroAlbaran || 'N/A')
            .replace('{{fechaAlbaran}}', datos.fechaAlbaran || 'N/A')
            .replace('{{sumaImporte}}', datos.sumaImporte || '0.00')
            .replace('{{suma}}', datos.suma || '0.00')
            .replace('{{contrarioDeudor}}', datos.contrarioDeudor || 'Parte contraria')
            .replace('{{ascendente}}', datos.ascendente || 'N/A')
            .replace('{{diaSem}}', new Date().getDay() || 'N/A')
            .replace('{{diaMes}}', new Date().getDate() || 'N/A')
            .replace('{{mes}}', new Date().getMonth() || 'N/A')
            .replace('{{anio}}', new Date().getFullYear() || 'N/A')
            .replace('{{email}}', datos.email || 'N/A')
            .replace('{{message}}', datos.message || 'N/A');

        // Iniciar Puppeteer
        const browser = await puppeteer.launch({
          headless: 'new',
        }); // Usa el navegador preempaquetado
        const page = await browser.newPage();

        // Cargar el contenido HTML en la página
        await page.setContent(htmlContent, { waitUntil: 'load' });

        // Generar el PDF
        const pdfPath = `./uploads/PETICION_MODIFICADA_${Date.now()}.pdf`;
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

        // Cerrar el navegador
        await browser.close();

        return pdfPath;
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        throw error; // Re-lanzamos el error para que sea manejado en niveles superiores
    }
}



// import fs from 'fs';
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// export async function generarPDF(datos) {
//   const outputPath = `./uploads/PETICION_MODIFICADA_${Date.now()}.pdf`;

//   // Crear un nuevo documento PDF
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage([595, 842]); // Tamaño A4
//   const { width, height } = page.getSize();

//   // Fuentes
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//   const fontSize = 12; // Tamaño de fuente estándar
//   const margin = 50; // Margen estándar

//   // Configuración de colores
//   const normalColor = rgb(0, 0, 0);

//   // Helper para dibujar texto
//   const drawText = (text, x, y, options = {}) => {
//     page.drawText(text, {
//       x,
//       y,
//       size: options.size || fontSize,
//       font: options.font || font,
//       color: options.color || normalColor,
//     });
//   };

//   // Encabezado con subrayado
//   const headerText = 'AL JUZGADO DE PRIMERA INSTANCIA';
//   const headerFontSize = fontSize + 2;
//   const textWidth = boldFont.widthOfTextAtSize(headerText, headerFontSize);
//   const textX = (width - textWidth) / 2;
//   const textY = height - 50;

//   function wrapText(text, maxWidth, font, fontSize) {
//     const words = text.split(' ');
//     let line = '';
//     const lines = [];

//     words.forEach((word) => {
//       const testLine = line + word + ' ';
//       const testWidth = font.widthOfTextAtSize(testLine.trim(), fontSize);
//       if (testWidth > maxWidth) {
//         lines.push(line.trim());
//         line = word + ' ';
//       } else {
//         line = testLine;
//       }
//     });

//     if (line) lines.push(line.trim());
//     return lines;
//   }

//   drawText(headerText, textX, textY, {
//     font: boldFont,
//     size: headerFontSize,
//   });

//   page.drawLine({
//     start: { x: textX, y: textY - 5 },
//     end: { x: textX + textWidth, y: textY - 5 },
//     thickness: 1,
//     color: normalColor,
//   });

//   // Subtítulo con texto continuo
//   const subTitleText = `DON JUAN ANTONIO MONTENEGRO RUBIO, Procurador de los Tribunales, en nombre de ${datos.cliente}, cuyo representación acreditaré mediante comparecencia “apud acta” y asistido del Letrado del Ilustre Colegio de Abogados de Granada, José Manuel Aguayo Pozo, Colegiado 3031, como mejor proceda en derecho, comparezco y DIGO:`;

//   const maxLineWidth = width - margin * 2; // Ancho máximo permitido (excluyendo márgenes)
//   const wrappedLines = wrapText(subTitleText, maxLineWidth, boldFont, fontSize);

//   // Posición inicial
//   let currentY = height - 80;

//   // Dibujar cada línea
//   wrappedLines.forEach((line) => {
//     drawText(line, margin, currentY, { font: boldFont });
//     currentY -= fontSize + 2; // Reducir Y para la siguiente línea
//   });

//   // Contenido dinámico
//   drawText(`Que en la representación que ostento y siguiendo instrucciones de mi mandante,`, margin, height - 140);
//   drawText(`por medio del presente escrito formulo PETICIÓN INICIAL DE PROCEDIMIENTO MONITORIO`, margin, height - 160);
//   drawText(`en reclamación ${datos.dineroEnLetra} (${datos.dineroEnNumero}€) de principal, en contra de`, margin, height - 180);
//   drawText(`${datos.contraDe}, con CIF ${datos.CIFcontra} y con domicilio en ${datos.domicilioContra},`, margin, height - 200);
//   drawText(`en base a los hechos que a continuación se detallan:`, margin, height - 220);

//   // Sección de hechos
//   drawText('H E C H O S', margin, height - 260, { font: boldFont, size: fontSize + 2 });
//   drawText('PRIMERO: ORIGEN Y CUANTÍA DE LA DEUDA', margin, height - 280, { font: boldFont });
//   drawText(`En virtud de las relaciones comerciales existentes entre las partes, la demandada`, margin, height - 300);
//   drawText(`resulta en deber la cantidad de ${datos.cantidad}.`, margin, height - 320);

//   // Facturas
//   drawText('FACTURAS:', margin, height - 360, { font: boldFont });
//   drawText(`• Factura nº ${datos.factura1}, de fecha ${datos.fecha}, por importe de ${datos.importe}, que se`, margin, height - 380);
//   drawText(`acompañan como ${datos.pdf1}.`, margin, height - 400);

//   // Albaranes
//   drawText('ALBARANES:', margin, height - 440, { font: boldFont });
//   drawText(`• ALBARÁN, nº ${datos.numeroAlbaran} de fecha ${datos.fechaAlbaran}, que se une como`, margin, height - 460);
//   drawText('documento número.', margin, height - 480);

//   // Finalización
//   drawText(`El importe total adeudado asciende a ${datos.sumaImporte}.`, margin, height - 520);
//   drawText(`SUPLICO AL JUZGADO: Que teniendo por presentado este escrito con los documentos y`, margin, height - 540);
//   drawText(`copias que se acompañan, se sirva admitirlos y me tenga por personado en nombre de`, margin, height - 560);
//   drawText(`${datos.cliente} y por formulada PETICIÓN INICIAL DE PROCESO MONITORIO en contra de`, margin, height - 580);
//   drawText(`${datos.contrarioDeudor}, a fin de que se requiera al deudor para que en el plazo de veinte`, margin, height - 600);
//   drawText(`días, pague la cantidad que se reclama ascendente a la suma de ${datos.ascendente} de`, margin, height - 620);
//   drawText(`principal; y para el caso de que en dicho plazo no atienda el requerimiento, o no`, margin, height - 640);
//   drawText(`comparezcan alegando razones de la negativa de pago, se dicte decreto dando por`, margin, height - 660);
//   drawText(`terminado el proceso monitorio y se me dé traslado del mismo para que pueda instar el`, margin, height - 680);
//   drawText(`despacho de ejecución.`, margin, height - 700);

//   // Guardar el PDF generado
//   const pdfBytes = await pdfDoc.save();
//   fs.writeFileSync(outputPath, pdfBytes);

//   console.log(`PDF generado en: ${outputPath}`);
//   return outputPath;
// }