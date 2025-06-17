import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Ocorrencia } from '../../../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Criar ícones personalizados para diferentes gravidades
const createCustomIcon = (gravidade: string) => {
  const color = gravidade === 'Crítica' ? '#EF4444' : 
                gravidade === 'Média' ? '#F59E0B' : '#10B981';
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

// Componente para ajustar o zoom do mapa
const MapController: React.FC<{ ocorrencias: Ocorrencia[] }> = ({ ocorrencias }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (ocorrencias.length > 0) {
      const bounds = L.latLngBounds(ocorrencias.map(o => [o.latitude, o.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [ocorrencias, map]);

  return null;
};

interface CriminalMapProps {
  ocorrencias: Ocorrencia[];
}

const CriminalMap: React.FC<CriminalMapProps> = ({ ocorrencias }) => {
  // Filtrar ocorrências com coordenadas válidas
  const validOcorrencias = useMemo(() => 
    ocorrencias.filter(ocorrencia => 
      ocorrencia.latitude && 
      ocorrencia.longitude &&
      !isNaN(ocorrencia.latitude) && 
      !isNaN(ocorrencia.longitude)
    ),
    [ocorrencias]
  );

  // Calcular o centro do mapa baseado nas ocorrências
  const center = useMemo(() => {
    if (validOcorrencias.length === 0) return [-23.5505, -46.6333]; // São Paulo como centro padrão
    
    const sumLat = validOcorrencias.reduce((sum, o) => sum + o.latitude, 0);
    const sumLng = validOcorrencias.reduce((sum, o) => sum + o.longitude, 0);
    return [sumLat / validOcorrencias.length, sumLng / validOcorrencias.length];
  }, [validOcorrencias]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapa Criminal</h3>
      <div className="h-96 rounded-lg overflow-hidden">
        <MapContainer
          center={center as [number, number]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController ocorrencias={validOcorrencias} />
          {validOcorrencias.map((ocorrencia) => (
            <Marker
              key={ocorrencia.id}
              position={[ocorrencia.latitude, ocorrencia.longitude]}
              icon={createCustomIcon(ocorrencia.gravidade)}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold">{ocorrencia.tipo}</h4>
                  <p className="text-sm text-gray-600">Gravidade: {ocorrencia.gravidade}</p>
                  <p className="text-sm text-gray-600">Unidade: {ocorrencia.unidade}</p>
                  <p className="text-sm text-gray-600">
                    Data: {new Date(ocorrencia.dataInicio).toLocaleDateString('pt-BR')}
                  </p>
                  {ocorrencia.descricao && (
                    <p className="text-sm text-gray-600 mt-2">{ocorrencia.descricao}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {validOcorrencias.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          <p>Nenhuma ocorrência com coordenadas disponíveis para exibição no mapa.</p>
        </div>
      )}
    </div>
  );
};

export default CriminalMap;