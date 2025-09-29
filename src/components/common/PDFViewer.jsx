import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, FileText } from 'lucide-react';

const PDFViewer = ({ file, fileName }) => {
  console.log('PDFViewer received props:', { file, fileName });
  
  const openPDF = () => {
    console.log('Opening PDF:', file);
    window.open(file, '_blank');
  };

  const downloadPDF = () => {
    console.log('Downloading PDF:', file);
    const link = document.createElement('a');
    link.href = file;
    link.download = fileName || 'document.pdf';
    link.click();
  };

  return (
    <div className="w-full border border-gray-300 rounded-lg bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-medium">{fileName}</span>
        </div>
      </div>
      
      <div className="text-center py-8">
        <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">PDF Document</p>
        <p className="text-sm text-gray-500 mb-6">Click the button below to view or download</p>
        
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={openPDF} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open PDF
          </Button>
          <Button 
            onClick={downloadPDF} 
            variant="outline" 
            className="px-6 py-2"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          URL: {file}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
