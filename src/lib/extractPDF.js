// src/lib/extractPDF.js
// Extract text from uploaded PDF resume on server side

/**
 * Extract raw text from a PDF buffer
 * Uses pdf-parse (server-side only)
 */
export async function extractPDFText(buffer) {
  try {
    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer)
    return data.text
  } catch (err) {
    console.error('PDF extraction error:', err)
    throw new Error('Could not read the PDF. Make sure it is a valid, text-based PDF.')
  }
}

/**
 * Convert a Next.js request File to a Buffer
 */
export async function fileToBuffer(file) {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
