import jsPDF from 'jspdf';
import { Ocorrencia, CPF } from '../types';

interface TextStyle {
  fontSize: number;
  fontStyle: 'normal' | 'bold';
  textColor: [number, number, number];
}

export const generateOcorrenciaPDF = (ocorrencias: Ocorrencia[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const lineHeight = 7;
  
  // Configuração de estilo
  const titleStyle: TextStyle = {
    fontSize: 16,
    fontStyle: 'bold',
    textColor: [0, 0, 0]
  };
  
  const subtitleStyle: TextStyle = {
    fontSize: 12,
    fontStyle: 'bold',
    textColor: [0, 0, 0]
  };
  
  const labelStyle: TextStyle = {
    fontSize: 10,
    fontStyle: 'bold',
    textColor: [100, 100, 100]
  };
  
  const valueStyle: TextStyle = {
    fontSize: 10,
    fontStyle: 'normal',
    textColor: [0, 0, 0]
  };

  // Função auxiliar para adicionar texto com estilo
  const addText = (text: string, x: number, y: number, style: TextStyle) => {
    doc.setFontSize(style.fontSize);
    doc.setFont('helvetica', style.fontStyle);
    doc.setTextColor(style.textColor[0], style.textColor[1], style.textColor[2]);
    doc.text(text, x, y);
  };

  // Função auxiliar para adicionar linha de dados
  const addDataLine = (label: string, value: string, x: number, y: number) => {
    addText(label + ':', x, y, labelStyle);
    addText(value, x + 40, y, valueStyle);
    return y + lineHeight;
  };

  ocorrencias.forEach((ocorrencia, index) => {
    if (index > 0) {
      doc.addPage();
    }

    let yPosition = margin;

    // Cabeçalho
    addText('Relatório de Ocorrência', margin, yPosition, titleStyle);
    yPosition += lineHeight * 2;

    // Informações Básicas
    addText('Informações Básicas', margin, yPosition, subtitleStyle);
    yPosition += lineHeight * 1.5;

    yPosition = addDataLine('Nome da Ocorrência', ocorrencia.nomeOcorrencia, margin, yPosition);
    yPosition = addDataLine('Tipo', ocorrencia.tipo, margin, yPosition);
    yPosition = addDataLine('Tipo de Comunicação', ocorrencia.tipoComunicacao, margin, yPosition);
    yPosition = addDataLine('Unidade', ocorrencia.unidade, margin, yPosition);
    yPosition = addDataLine('Responsável', ocorrencia.responsavel, margin, yPosition);
    yPosition = addDataLine('Status', ocorrencia.status, margin, yPosition);
    yPosition = addDataLine('Gravidade', ocorrencia.gravidade, margin, yPosition);
    yPosition = addDataLine('Data Início', new Date(ocorrencia.dataInicio).toLocaleDateString('pt-BR'), margin, yPosition);
    if (ocorrencia.dataFim) {
      yPosition = addDataLine('Data Fim', new Date(ocorrencia.dataFim).toLocaleDateString('pt-BR'), margin, yPosition);
    }

    yPosition += lineHeight;

    // Envolvidos
    addText('Envolvidos', margin, yPosition, subtitleStyle);
    yPosition += lineHeight * 1.5;
    ocorrencia.envolvidos.forEach(envolvido => {
      addText('• ' + envolvido, margin + 5, yPosition, valueStyle);
      yPosition += lineHeight;
    });

    yPosition += lineHeight;

    // Localização
    addText('Localização', margin, yPosition, subtitleStyle);
    yPosition += lineHeight * 1.5;
    yPosition = addDataLine('Latitude', ocorrencia.latitude.toString(), margin, yPosition);
    yPosition = addDataLine('Longitude', ocorrencia.longitude.toString(), margin, yPosition);

    yPosition += lineHeight;

    // Observações
    if (ocorrencia.observacoes) {
      addText('Observações', margin, yPosition, subtitleStyle);
      yPosition += lineHeight * 1.5;
      const observacoesLines = doc.splitTextToSize(ocorrencia.observacoes, pageWidth - (margin * 2));
      observacoesLines.forEach((line: string) => {
        addText(line, margin, yPosition, valueStyle);
        yPosition += lineHeight;
      });
      yPosition += lineHeight;
    }

    // Considerações Finais
    if (ocorrencia.consideracoesFinais) {
      addText('Considerações Finais', margin, yPosition, subtitleStyle);
      yPosition += lineHeight * 1.5;
      const consideracoesLines = doc.splitTextToSize(ocorrencia.consideracoesFinais, pageWidth - (margin * 2));
      consideracoesLines.forEach((line: string) => {
        addText(line, margin, yPosition, valueStyle);
        yPosition += lineHeight;
      });
      yPosition += lineHeight;
    }

    // Documentos
    if (ocorrencia.documentos.length > 0) {
      addText('Documentos Anexos', margin, yPosition, subtitleStyle);
      yPosition += lineHeight * 1.5;
      ocorrencia.documentos.forEach(doc => {
        addText('• ' + doc, margin + 5, yPosition, valueStyle);
        yPosition += lineHeight;
      });
    }

    // Rodapé
    const footerText = `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`;
    addText(footerText, margin, doc.internal.pageSize.getHeight() - margin, {
      fontSize: 8,
      fontStyle: 'normal',
      textColor: [100, 100, 100]
    });
  });

  doc.save('relatorio-ocorrencias.pdf');
};

export const generateCPFPDF = (cpfs: CPF[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Relatório de CPFs', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
  
  let yPosition = 50;
  
  cpfs.forEach((cpf, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.text(`${index + 1}. ${cpf.nome}`, 20, yPosition);
    
    doc.setFontSize(10);
    yPosition += 10;
    doc.text(`CPF: ${cpf.cpf}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Tipo: ${cpf.tipoCpf}`, 25, yPosition);
    yPosition += 8;
    if (cpf.antecedentesCriminais) {
      doc.text(`Antecedentes: ${cpf.antecedentesCriminais.substring(0, 50)}...`, 25, yPosition);
      yPosition += 8;
    }
    
    yPosition += 15;
  });
  
  doc.save('relatorio-cpfs.pdf');
};

export const generateGeneralPDF = (title: string, data: any[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
  doc.text(`Total de registros: ${data.length}`, 20, 45);
  
  let yPosition = 65;
  
  data.forEach((item, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${JSON.stringify(item).substring(0, 100)}...`, 20, yPosition);
    yPosition += 15;
  });
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};