import pkg from '@pdftron/pdfnet-node';
const { PDFNet } = pkg;

import fs from 'fs';
import path from 'path';

export async function generarPDF(datos) {
  const inputPath = './model/PETICION_INICIAL_MONITORIO_MODELO.pdf';
  const outputPath = `./uploads/PETICION_MODIFICADA_${Date.now()}.pdf`;

  // Inicializar PDFNet con la clave de licencia desde las variables de entorno
  await PDFNet.initialize(process.env.PDFTRON_LICENSE);

  try {
    // Cargar el documento PDF
    const doc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
    doc.initSecurityHandler();
    doc.lock();

    const replacer = await PDFNet.ContentReplacer.create();
    const page = await doc.getPage(1); // Editar la primera página

    // Añadir reemplazos de texto dinámico
    await replacer.addString('(cliente)', datos.cliente);
    await replacer.addString('(dineroEnLetra)', datos.dineroEnLetra);
    await replacer.addString('(dineroEnNumero)', datos.dineroEnNumero);
    await replacer.addString('(contraDe)', datos.contraDe);
    await replacer.addString('(CIFcontra)', datos.CIFcontra);
    await replacer.addString('(domicilioContra)', datos.domicilioContra);
    await replacer.addString('(cantidad)', datos.cantidad);
    await replacer.addString('(numero)', datos.factura1);
    await replacer.addString('(fecha)', datos.fecha);
    await replacer.addString('(importe)', datos.importe);
    await replacer.addString('(pdf1)', datos.pdf1);
    await replacer.addString('(numeroAlbaran)', datos.numeroAlbaran);
    await replacer.addString('(fechaAlbaran)', datos.fechaAlbaran);
    await replacer.addString('(sumaImporte)', datos.sumaImporte);
    await replacer.addString('(suma)', datos.suma);
    await replacer.addString('(contrarioDeudor)', datos.contrarioDeudor);
    await replacer.addString('(ascendente)', datos.ascendente);
    await replacer.addString('(diaSem)', datos.diaSem);
    await replacer.addString('(diaMes)', datos.diaMes);
    await replacer.addString('(mes)', datos.mes);
    await replacer.addString('(anio)', datos.anio);

    // Procesar la página con los reemplazos
    await replacer.process(page);

    // Guardar el documento modificado
    await doc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
    console.log(`PDF modificado guardado en: ${outputPath}`);

    return outputPath;
  } catch (error) {
    console.error('Error al modificar el PDF:', error);
    throw error;
  } finally {
    await PDFNet.shutdown();
  }
}
