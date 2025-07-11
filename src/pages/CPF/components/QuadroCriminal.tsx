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
  const [isDragging, setIsDragging] = useState(false);
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

    // Criar nodes para CPFs com posições mais espaçadas
    const cpfNodes: Node[] = filteredCPFs.map((cpf, index) => ({
      id: `cpf-${cpf.id}`,
      name: cpf.nome,
      cpf: cpf.cpf,
      photo: cpf.foto,
      x: 150 + (index % 3) * 300,
      y: 100 + Math.floor(index / 3) * 250,
      type: 'cpf',
      data: cpf
    }));

    let allNodes = [...cpfNodes];
    const allConnections: Connection[] = [];

    // Vínculos de CNPJs
    cnpjs.forEach((cnpj, index) => {
      if (cnpj.cpfVinculoPrimario) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === cnpj.cpfVinculoPrimario);
        if (cpfVinculado) {
          const nodeId = `cnpj-${cnpj.id}`;
          allConnections.push({
            from: `cpf-${cpfVinculado.id}`,
            to: nodeId,
            label: 'CNPJ',
            type: 'cnpj'
          });
          allNodes.push({
            id: nodeId,
            name: cnpj.nomeEmpresa,
            cpf: cnpj.cnpj,
            x: 500 + (index % 3) * 300,
            y: 100 + Math.floor(index / 3) * 250,
            type: 'cnpj',
            data: cnpj
          });
        }
      }
    });

    // Vínculos de Veículos
    veiculos.forEach((veiculo, index) => {
      if (veiculo.cpfVinculoPrimario) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === veiculo.cpfVinculoPrimario);
        if (cpfVinculado) {
          const nodeId = `veiculo-${veiculo.id}`;
          allConnections.push({
            from: `cpf-${cpfVinculado.id}`,
            to: nodeId,
            label: 'Veículo',
            type: 'veiculo'
          });
          allNodes.push({
            id: nodeId,
            name: `${veiculo.marca} ${veiculo.modelo}`,
            cpf: veiculo.placa,
            x: 850 + (index % 3) * 300,
            y: 100 + Math.floor(index / 3) * 250,
            type: 'veiculo',
            data: veiculo
          });
        }
      }
    });

    // Vínculos de Imóveis
    imoveis.forEach((imovel, index) => {
      if (imovel.cpfVinculoPrimario) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === imovel.cpfVinculoPrimario);
        if (cpfVinculado) {
          const nodeId = `imovel-${imovel.id}`;
          allConnections.push({
            from: `cpf-${cpfVinculado.id}`,
            to: nodeId,
            label: 'Imóvel',
            type: 'imovel'
          });
          allNodes.push({
            id: nodeId,
            name: imovel.endereco.substring(0, 30) + '...',
            cpf: imovel.imovel,
            x: 150 + (index % 3) * 300,
            y: 400 + Math.floor(index / 3) * 250,
            type: 'imovel',
            data: imovel
          });
        }
      }
    });

    // Vínculos de Telefones
    telefones.forEach((telefone, index) => {
      if (telefone.cpfVinculoPrimario) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === telefone.cpfVinculoPrimario);
        if (cpfVinculado) {
          const nodeId = `telefone-${telefone.id}`;
          allConnections.push({
            from: `cpf-${cpfVinculado.id}`,
            to: nodeId,
            label: 'Telefone',
            type: 'telefone'
          });
          allNodes.push({
            id: nodeId,
            name: telefone.proprietarioLinha,
            cpf: telefone.numero,
            x: 500 + (index % 3) * 300,
            y: 400 + Math.floor(index / 3) * 250,
            type: 'telefone',
            data: telefone
          });
        }
      }
    });

    // Vínculos de Redes Sociais
    redesSociais.forEach((rede, index) => {
      if (rede.cpfVinculoPrimario) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === rede.cpfVinculoPrimario);
        if (cpfVinculado) {
          const nodeId = `redeSocial-${rede.id}`;
          allConnections.push({
            from: `cpf-${cpfVinculado.id}`,
            to: nodeId,
            label: 'Rede Social',
            type: 'redeSocial'
          });
          allNodes.push({
            id: nodeId,
            name: rede.nomeRede,
            cpf: rede.redeSocial,
            x: 850 + (index % 3) * 300,
            y: 400 + Math.floor(index / 3) * 250,
            type: 'redeSocial',
            data: rede
          });
        }
      }
    });

    // Vínculos Financeiros
    financeiros.forEach((financeiro, index) => {
      if (financeiro.cpfVinculoPrimario) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === financeiro.cpfVinculoPrimario);
        if (cpfVinculado) {
          const nodeId = `financeiro-${financeiro.id}`;
          allConnections.push({
            from: `cpf-${cpfVinculado.id}`,
            to: nodeId,
            label: 'Financeiro',
            type: 'financeiro'
          });
          allNodes.push({
            id: nodeId,
            name: financeiro.nomeProprietario,
            cpf: financeiro.cpfProprietario,
            x: 150 + (index % 3) * 300,
            y: 700 + Math.floor(index / 3) * 250,
            type: 'financeiro',
            data: financeiro
          });
        }
      }
    });

    // Vínculos Empresariais
    empresariais.forEach((empresarial, index) => {
      if (empresarial.cpfEnvolvido) {
        const cpfVinculado = filteredCPFs.find(c => c.cpf === empresarial.cpfEnvolvido);
        if (cpfVinculado) {
          const nodeId = `empresarial-${empresarial.id}`;
          allConnections.push({
            from: `cpf-${cpfVinculado.id}`,
            to: nodeId,
            label: 'Empresarial',
            type: 'empresarial'
          });
          allNodes.push({
            id: nodeId,
            name: empresarial.nomeEnvolvido,
            cpf: empresarial.cpfEnvolvido,
            x: 500 + (index % 3) * 300,
            y: 700 + Math.floor(index / 3) * 250,
            type: 'empresarial',
            data: empresarial
          });
        }
      }
    });

    setNodes(allNodes);
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
    e.preventDefault();
    e.stopPropagation();
    
    const node = nodes.find(n => n.id === nodeId);
    if (node && canvasRef.current) {
      setDraggedNode(nodeId);
      setIsDragging(true);
      
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left) / zoom;
      const canvasY = (e.clientY - rect.top) / zoom;
      
      setDragOffset({
        x: canvasX - node.x,
        y: canvasY - node.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode && isDragging && canvasRef.current) {
      e.preventDefault();
      
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left) / zoom;
      const canvasY = (e.clientY - rect.top) / zoom;
      
      const newX = canvasX - dragOffset.x;
      const newY = canvasY - dragOffset.y;

      setNodes(prev => prev.map(node =>
        node.id === draggedNode
          ? { ...node, x: Math.max(0, newX), y: Math.max(0, newY) }
          : node
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsDragging(false);
  };

  const resetPositions = () => {
    const cpfNodes = nodes.filter(n => n.type === 'cpf');
    const otherNodes = nodes.filter(n => n.type !== 'cpf');
    
    const resetNodes: Node[] = [
      ...cpfNodes.map((node, index) => ({
        ...node,
        x: 150 + (index % 3) * 300,
        y: 100 + Math.floor(index / 3) * 250
      })),
      ...otherNodes.map((node, index) => {
        const typeIndex = otherNodes.filter(n => n.type === node.type).indexOf(node);
        switch (node.type) {
          case 'cnpj':
            return { ...node, x: 500 + (typeIndex % 3) * 300, y: 100 + Math.floor(typeIndex / 3) * 250 };
          case 'veiculo':
            return { ...node, x: 850 + (typeIndex % 3) * 300, y: 100 + Math.floor(typeIndex / 3) * 250 };
          case 'imovel':
            return { ...node, x: 150 + (typeIndex % 3) * 300, y: 400 + Math.floor(typeIndex / 3) * 250 };
          case 'telefone':
            return { ...node, x: 500 + (typeIndex % 3) * 300, y: 400 + Math.floor(typeIndex / 3) * 250 };
          case 'redeSocial':
            return { ...node, x: 850 + (typeIndex % 3) * 300, y: 400 + Math.floor(typeIndex / 3) * 250 };
          case 'financeiro':
            return { ...node, x: 150 + (typeIndex % 3) * 300, y: 700 + Math.floor(typeIndex / 3) * 250 };
          case 'empresarial':
            return { ...node, x: 500 + (typeIndex % 3) * 300, y: 700 + Math.floor(typeIndex / 3) * 250 };
          default:
            return node;
        }
      })
    ];
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
        className="relative overflow-auto bg-gray-50 select-none"
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

              const midX = (fromNode.x + toNode.x + 80) / 2;
              const midY = (fromNode.y + toNode.y + 80) / 2;

              return (
                <g key={index}>
                  <line
                    x1={fromNode.x + 50}
                    y1={fromNode.y + 50}
                    x2={toNode.x + 50}
                    y2={toNode.y + 50}
                    stroke="#374151"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <text
                    x={midX}
                    y={midY - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
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
              className={`absolute cursor-move group ${
                draggedNode === node.id ? 'z-50 scale-105' : 'z-10'
              } transition-transform duration-100`}
              style={{
                left: node.x,
                top: node.y,
                userSelect: 'none'
              }}
              onMouseDown={(e) => handleMouseDown(node.id, e)}
            >
              <div className="flex flex-col items-center space-y-2 pointer-events-none">
                {/* Foto/Avatar */}
                <div className={`w-20 h-20 rounded-full border-2 overflow-hidden bg-white shadow-lg ${
                  node.type === 'cpf' ? 'border-blue-500' : 
                  node.type === 'cnpj' ? 'border-green-500' :
                  node.type === 'veiculo' ? 'border-purple-500' :
                  node.type === 'imovel' ? 'border-orange-500' :
                  node.type === 'telefone' ? 'border-pink-500' :
                  node.type === 'redeSocial' ? 'border-indigo-500' :
                  node.type === 'financeiro' ? 'border-yellow-500' :
                  'border-red-500'
                }`}>
                  {node.photo ? (
                    <img
                      src={node.photo}
                      alt={node.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {getNodeIcon(node.type)}
                    </div>
                  )}
                </div>
                
                {/* Informações */}
                <div className="bg-white rounded-lg shadow-md p-2 text-center min-w-24 max-w-32">
                  <p className="text-xs font-semibold text-gray-900 truncate" title={node.name}>
                    {node.name.length > 15 ? node.name.substring(0, 15) + '...' : node.name}
                  </p>
                  <p className="text-xs text-gray-600 truncate" title={node.cpf}>
                    {node.cpf}
                  </p>
                  <p className={`text-xs font-medium ${
                    node.type === 'cpf' ? 'text-blue-600' : 
                    node.type === 'cnpj' ? 'text-green-600' :
                    node.type === 'veiculo' ? 'text-purple-600' :
                    node.type === 'imovel' ? 'text-orange-600' :
                    node.type === 'telefone' ? 'text-pink-600' :
                    node.type === 'redeSocial' ? 'text-indigo-600' :
                    node.type === 'financeiro' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {node.type.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Menu contextual */}
              <div className="absolute top-0 right-0 pointer-events-auto">
                <button
                  className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Editar:', node);
                  }}
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