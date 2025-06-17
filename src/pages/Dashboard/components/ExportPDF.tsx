import React from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Ocorrencia } from '../../../types';

interface ExportPDFProps {
  ocorrencias: Ocorrencia[];
  startDate: string;
  endDate: string;
}

const ExportPDF: React.FC<ExportPDFProps> = ({ ocorrencias, startDate, endDate }) => {
  const handleExportPDF = async () => {
    try {
      // Criar novo documento PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yOffset = margin;

      // Adicionar cabeçalho
      pdf.setFillColor(59, 130, 246); // Cor azul
      pdf.rect(0, 0, pageWidth, 30, 'F');
      
      // Título
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Relatório de Ocorrências', pageWidth / 2, 20, { align: 'center' });
      
      // Resetar cor do texto
      pdf.setTextColor(0, 0, 0);
      yOffset = 40;

      // Adicionar período
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const periodo = startDate && endDate 
        ? `Período: ${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}`
        : 'Período: Todos os registros';
      pdf.text(periodo, pageWidth / 2, yOffset, { align: 'center' });
      yOffset += 15;

      // Adicionar data de geração
      const dataGeracao = new Date().toLocaleDateString('pt-BR');
      pdf.text(`Gerado em: ${dataGeracao}`, pageWidth / 2, yOffset, { align: 'center' });
      yOffset += 20;

      // Adicionar estatísticas
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Estatísticas Gerais', margin, yOffset);
      yOffset += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      // Estatísticas detalhadas
      const totalOcorrencias = ocorrencias.length;
      const ocorrenciasCriticas = ocorrencias.filter(o => o.gravidade === 'Crítica').length;
      const ocorrenciasMedias = ocorrencias.filter(o => o.gravidade === 'Média').length;
      const ocorrenciasBaixas = ocorrencias.filter(o => o.gravidade === 'Baixa').length;

      pdf.text(`Total de Ocorrências: ${totalOcorrencias}`, margin, yOffset);
      yOffset += 8;
      pdf.text(`Ocorrências Críticas: ${ocorrenciasCriticas}`, margin, yOffset);
      yOffset += 8;
      pdf.text(`Ocorrências Médias: ${ocorrenciasMedias}`, margin, yOffset);
      yOffset += 8;
      pdf.text(`Ocorrências Baixas: ${ocorrenciasBaixas}`, margin, yOffset);
      yOffset += 15;

      // Capturar e adicionar gráficos
      const charts = document.querySelectorAll('.bg-white.rounded-lg.shadow-md');
      for (const chart of charts) {
        const canvas = await html2canvas(chart as HTMLElement, {
          scale: 2, // Melhor qualidade
          useCORS: true,
          logging: false
        });
        const imgData = canvas.toDataURL('image/png');
        
        // Verificar se precisa de nova página
        if (yOffset + 100 > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          yOffset = margin;
        }

        // Adicionar título do gráfico
        const chartTitle = chart.querySelector('h3')?.textContent || '';
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(chartTitle, margin, yOffset);
        yOffset += 8;

        // Adicionar imagem do gráfico
        const imgWidth = pageWidth - (2 * margin);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight);
        yOffset += imgHeight + 20;
      }

      // Adicionar rodapé em todas as páginas
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(128, 128, 128); // Cor cinza
        pdf.text(
          `Página ${i} de ${totalPages}`,
          pageWidth / 2,
          pdf.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Salvar o PDF
      pdf.save(`relatorio-ocorrencias-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <button
      onClick={handleExportPDF}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      <Download className="w-4 h-4" />
      <span>Exportar PDF</span>
    </button>
  );
};

export default ExportPDF; 