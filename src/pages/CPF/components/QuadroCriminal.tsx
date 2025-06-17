import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, FileDown, Search, User, Building2, Car, Home, Phone, Share2, DollarSign, Briefcase } from 'lucide-react';
import { useDataStore } from '../../../store/dataStore';

interface Node {
  id: string;
  name: string;
  cpf: string;
  photo?: string;
  x: number;
  y: number;
  type: 'cpf' | 'cnpj' | 'veiculo' | 'imovel' | 'telefone' | 'redeSocial' | 'financeiro' | 'empresarial';
  data: any;
}

interface Connection {
  from: string;
  to: string;
  label: string;
  type: string;
}

const QuadroCriminal: React.FC = () => {
  const { cpfs, cnpjs, veiculos, imoveis, telefones, redesSociais, financeiros, empresariais } = useDataStore();
  const [zoom, setZoom] = useState(1);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'cpf'>('all');
  const canvasRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  const getNodeIcon = (type: Node['type']) => {
    switch (type) {
      case 'cpf':
        return <User className="w-4 h-4" />;
      case 'cnpj':
        return <Building2 className="w-4 h-4" />;
      case 'veiculo':
        return <Car className="w-4 h-4" />;
      case 'imovel':
        return <Home className="w-4 h-4" />;
      case 'telefone':
        return <Phone className="w-4 h-4" />;
      case 'redeSocial':
        return <Share2 className="w-4 h-4" />;
      case 'financeiro':
        return <DollarSign className="w-4 h-4" />;
      case 'empresarial':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    if (!showResults) {
      setNodes([]);
      setConnections([]);
      return;
    }

    // Filtrar CPFs
    const filteredCPFs = cpfs.filter(cpf => {
      if (searchType === 'cpf') {
        return cpf.cpf.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return cpf.cpf.toLowerCase().includes(searchTerm.toLowerCase()) ||
             cpf.nome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Criar nodes para CPFs
    const cpfNodes: Node[] = filteredCPFs.map((cpf, index) => ({
      id: cpf.id,
      name: cpf.nome,
      cpf: cpf.cpf,
      photo: cpf.foto,
      x: 200 + (index % 4) * 200,
      y: 150 + Math.floor(index / 4) * 200,
      type: 'cpf',
      data: cpf
    }));

    // Encontrar todos os vínculos
    const allConnections: Connection[] = [];

    // Vínculos de CNPJs
    cnpjs.forEach(cnpj => {
      if (cnpj.cpfVinculoPrimario) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === cnpj.cpfVinculoPrimario);
        if (cpfVinculado) {
          allConnections.push({
            from: cpfVinculado.id,
            to: cnpj.id,
            label: 'CNPJ',
            type: 'cnpj'
          });
          cpfNodes.push({
            id: cnpj.id,
            name: cnpj.nomeEmpresa,
            cpf: cnpj.cnpj,
            x: 200 + (cpfNodes.length % 4) * 200,
            y: 150 + Math.floor(cpfNodes.length / 4) * 200,
            type: 'cnpj',
            data: cnpj
          });
        }
      }
    });

    // Vínculos de Veículos
    veiculos.forEach(veiculo => {
      if (veiculo.cpfVinculoPrimario) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === veiculo.cpfVinculoPrimario);
        if (cpfVinculado) {
          allConnections.push({
            from: cpfVinculado.id,
            to: veiculo.id,
            label: 'Veículo',
            type: 'veiculo'
          });
          cpfNodes.push({
            id: veiculo.id,
            name: `${veiculo.marca} ${veiculo.modelo}`,
            cpf: veiculo.placa,
            x: 200 + (cpfNodes.length % 4) * 200,
            y: 150 + Math.floor(cpfNodes.length / 4) * 200,
            type: 'veiculo',
            data: veiculo
          });
        }
      }
    });

    // Vínculos de Imóveis
    imoveis.forEach(imovel => {
      if (imovel.cpfVinculoPrimario) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === imovel.cpfVinculoPrimario);
        if (cpfVinculado) {
          allConnections.push({
            from: cpfVinculado.id,
            to: imovel.id,
            label: 'Imóvel',
            type: 'imovel'
          });
          cpfNodes.push({
            id: imovel.id,
            name: imovel.endereco,
            cpf: imovel.imovel,
            x: 200 + (cpfNodes.length % 4) * 200,
            y: 150 + Math.floor(cpfNodes.length / 4) * 200,
            type: 'imovel',
            data: imovel
          });
        }
      }
    });

    // Vínculos de Telefones
    telefones.forEach(telefone => {
      if (telefone.cpfVinculoPrimario) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === telefone.cpfVinculoPrimario);
        if (cpfVinculado) {
          allConnections.push({
            from: cpfVinculado.id,
            to: telefone.id,
            label: 'Telefone',
            type: 'telefone'
          });
          cpfNodes.push({
            id: telefone.id,
            name: telefone.proprietarioLinha,
            cpf: telefone.telefone,
            x: 200 + (cpfNodes.length % 4) * 200,
            y: 150 + Math.floor(cpfNodes.length / 4) * 200,
            type: 'telefone',
            data: telefone
          });
        }
      }
    });

    // Vínculos de Redes Sociais
    redesSociais.forEach(rede => {
      if (rede.cpfVinculoPrimario) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === rede.cpfVinculoPrimario);
        if (cpfVinculado) {
          allConnections.push({
            from: cpfVinculado.id,
            to: rede.id,
            label: 'Rede Social',
            type: 'redeSocial'
          });
          cpfNodes.push({
            id: rede.id,
            name: rede.nomeRede,
            cpf: rede.redeSocial,
            x: 200 + (cpfNodes.length % 4) * 200,
            y: 150 + Math.floor(cpfNodes.length / 4) * 200,
            type: 'redeSocial',
            data: rede
          });
        }
      }
    });

    // Vínculos Financeiros
    financeiros.forEach(financeiro => {
      if (financeiro.cpfVinculoPrimario) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === financeiro.cpfVinculoPrimario);
        if (cpfVinculado) {
          allConnections.push({
            from: cpfVinculado.id,
            to: financeiro.id,
            label: 'Financeiro',
            type: 'financeiro'
          });
          cpfNodes.push({
            id: financeiro.id,
            name: financeiro.nomeProprietario,
            cpf: financeiro.cpfProprietario,
            x: 200 + (cpfNodes.length % 4) * 200,
            y: 150 + Math.floor(cpfNodes.length / 4) * 200,
            type: 'financeiro',
            data: financeiro
          });
        }
      }
    });

    // Vínculos Empresariais
    empresariais.forEach(empresarial => {
      if (empresarial.cpfEnvolvido) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === empresarial.cpfEnvolvido);
        if (cpfVinculado) {
          allConnections.push({
            from: cpfVinculado.id,
            to: empresarial.id,
            label: 'Empresarial',
            type: 'empresarial'
          });
          cpfNodes.push({
            id: empresarial.id,
            name: empresarial.nomeEnvolvido,
            cpf: empresarial.cpfEnvolvido,
            x: 200 + (cpfNodes.length % 4) * 200,
            y: 150 + Math.floor(cpfNodes.length / 4) * 200,
            type: 'empresarial',
            data: empresarial
          });
        }
      }
    });

    setNodes(cpfNodes);
    setConnections(allConnections);
  }, [cpfs, cnpjs, veiculos, imoveis, telefones, redesSociais, financeiros, empresariais, searchTerm, showResults, searchType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const handleCPFSearch = () => {
    setSearchType('cpf');
    setShowResults(true);
  };

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node && canvasRef.current) {
      setDraggedNode(nodeId);
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = (e.clientX - rect.left - dragOffset.x) / zoom;
      const newY = (e.clientY - rect.top - dragOffset.y) / zoom;

      setNodes(prev => prev.map(node =>
        node.id === draggedNode
          ? { ...node, x: newX, y: newY }
          : node
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const resetPositions = () => {
    const resetNodes: Node[] = nodes.map((node, index) => ({
      ...node,
      x: 200 + (index % 4) * 200,
      y: 150 + Math.floor(index / 4) * 200
    }));
    setNodes(resetNodes);
  };

  const exportPDF = () => {
    // Implementar exportação do quadro para PDF
    alert('Funcionalidade de exportação em desenvolvimento');
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Controles */}
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleSearch} className="flex items-center mb-4">
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por CPF ou nome..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              <button
                type="button"
                onClick={handleCPFSearch}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
              >
                <User className="w-4 h-4" />
                <span>Buscar CPF</span>
              </button>
            </div>
          </div>
        </form>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <ZoomIn className="w-4 h-4" />
            <span>Zoom +</span>
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <ZoomOut className="w-4 h-4" />
            <span>Zoom -</span>
          </button>
          <button
            onClick={resetPositions}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Resetar</span>
          </button>
        <button
          onClick={exportPDF}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <FileDown className="w-4 h-4" />
          <span>Exportar PDF</span>
        </button>
        </div>
      </div>

      {/* Canvas do Quadro Criminal */}
      <div
        ref={canvasRef}
        className="relative overflow-auto bg-gray-50"
        style={{ height: '600px' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            width: '2000px',
            height: '1500px'
          }}
        >
          {/* Renderizar conexões */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {connections.map((connection, index) => {
              const fromNode = nodes.find(n => n.id === connection.from);
              const toNode = nodes.find(n => n.id === connection.to);
              
              if (!fromNode || !toNode) return null;

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              return (
                <g key={index}>
                  <line
                    x1={fromNode.x + 40}
                    y1={fromNode.y + 40}
                    x2={toNode.x + 40}
                    y2={toNode.y + 40}
                    stroke="#374151"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <text
                    x={midX}
                    y={midY - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-600 bg-white"
                    fontSize="12"
                  >
                    {connection.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Renderizar nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute cursor-move group ${draggedNode === node.id ? 'z-50' : 'z-2'}`}
              style={{
                left: node.x,
                top: node.y,
                transform: draggedNode === node.id ? 'scale(1.05)' : 'none',
                transition: 'transform 0.1s ease'
              }}
              onMouseDown={(e) => handleMouseDown(node.id, e)}
            >
              <div className="flex flex-col items-center space-y-2">
                {/* Foto/Avatar */}
                <div className="w-20 h-20 rounded-full border-2 border-blue-500 overflow-hidden bg-white shadow-lg">
                  {node.photo ? (
                    <img
                      src={node.photo}
                      alt={node.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      {getNodeIcon(node.type)}
                    </div>
                  )}
                </div>
                
                {/* Informações */}
                <div className="bg-white rounded-lg shadow-md p-2 text-center min-w-24">
                  <p className="text-xs font-semibold text-gray-900">{node.name}</p>
                  <p className="text-xs text-gray-600">{node.cpf}</p>
                  <p className="text-xs text-blue-600">{node.type}</p>
                </div>
              </div>

              {/* Menu contextual */}
              <div className="absolute top-0 right-0">
                <button
                  className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-700"
                  onClick={() => console.log('Editar:', node)}
                >
                  ✏️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informações do quadro */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total de pessoas: {nodes.filter(n => n.type === 'cpf').length}</span>
          <span>Total de vínculos: {connections.length}</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default QuadroCriminal;