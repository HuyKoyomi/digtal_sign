import React, { useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfWithBackground({ pdfFile }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const renderPage = async () => {
      const pdf = await pdfjs.getDocument(pdfFile).promise;
      const page = await pdf.getPage(1); // Chọn trang cần vẽ

      const viewport = page.getViewport({ scale: 1 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Vẽ nền
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Màu nền, ví dụ: đỏ với độ trong suốt 0.5
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    renderPage();
  }, [pdfFile]);

  return (
    <canvas ref={canvasRef} />
  );
}

export default PdfWithBackground;
