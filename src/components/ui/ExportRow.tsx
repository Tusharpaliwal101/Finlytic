import React from 'react';
import Button from './Button';

interface ExportRowProps {
  onExcel: () => void;
  onPdf: () => void;
  loading?: boolean;
}

const ExportRow: React.FC<ExportRowProps> = ({ onExcel, onPdf, loading }) => {
  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="excel" 
        onClick={onExcel} 
        loading={loading}
        className="flex-1 lg:flex-none"
      >
        Export Excel
      </Button>
      <Button 
        variant="pdf" 
        onClick={onPdf} 
        loading={loading}
        className="flex-1 lg:flex-none"
      >
        Export PDF
      </Button>
    </div>
  );
};

export default ExportRow;
