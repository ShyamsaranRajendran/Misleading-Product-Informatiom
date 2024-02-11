function generatePDF() {
    const element = document.getElementById('pos');
    const ele =document.getElementById('download');

    html2pdf(element, {
      margin: 10,
      filename: 'Misleaded.pdf',
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    });
  }