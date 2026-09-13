import React, { useState } from 'react';

interface SchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: any;
}

interface Column {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  refTable?: string;
}

interface TableData {
  name: string;
  columns: Column[];
}

const SCHEMA: TableData[] = [
  {
    name: 'bandas',
    columns: [
      { name: 'id', type: 'INTEGER', isPk: true },
      { name: 'nombre', type: 'TEXT' },
      { name: 'pais_origen', type: 'TEXT' },
      { name: 'genero', type: 'TEXT' },
      { name: 'cant_integrantes', type: 'INTEGER' },
      { name: 'fecha_creacion', type: 'INTEGER' },
    ],
  },
  {
    name: 'albumes',
    columns: [
      { name: 'id', type: 'INTEGER', isPk: true },
      { name: 'nombre', type: 'TEXT' },
      { name: 'banda_id', type: 'INTEGER', isFk: true, refTable: 'bandas' },
      { name: 'duracion', type: 'INTEGER' },
      { name: 'ranking', type: 'INTEGER' },
      { name: 'lanzamiento', type: 'INTEGER' },
    ],
  },
  {
    name: 'canciones',
    columns: [
      { name: 'id', type: 'INTEGER', isPk: true },
      { name: 'nombre', type: 'TEXT' },
      { name: 'banda_id', type: 'INTEGER', isFk: true, refTable: 'bandas' },
      { name: 'album_id', type: 'INTEGER', isFk: true, refTable: 'albumes' },
      { name: 'duracion', type: 'INTEGER' },
      { name: 'ranking', type: 'INTEGER' },
    ],
  },
  {
    name: 'conciertos',
    columns: [
      { name: 'id', type: 'INTEGER', isPk: true },
      { name: 'nombre', type: 'TEXT' },
      { name: 'pais', type: 'TEXT' },
      { name: 'fecha', type: 'INTEGER' },
    ],
  },
  {
    name: 'conciertos_musicos',
    columns: [
      { name: 'concierto_id', type: 'INTEGER', isFk: true, refTable: 'conciertos' },
      { name: 'banda_id', type: 'INTEGER', isFk: true, refTable: 'bandas' },
    ],
  },
];

export const SchemaModal: React.FC<SchemaModalProps> = ({ isOpen, onClose, theme }) => {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '1100px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: "'Fira Code', monospace", fontSize: '24px' }}>🗄️ Relaciones entre Tablas</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.text,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: '8px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Layout en Grid tipo Grafo/Entidades */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {SCHEMA.map((table) => {
            const isHovered = hoveredTable === table.name;
            const isDimmed = hoveredTable !== null && !isHovered;

            return (
              <div
                key={table.name}
                onMouseEnter={() => setHoveredTable(table.name)}
                onMouseLeave={() => setHoveredTable(null)}
                style={{
                  background: theme.bg,
                  borderRadius: '12px',
                  border: `2px solid ${isHovered ? '#007bff' : theme.border}`,
                  overflow: 'hidden',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isHovered ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
                  opacity: isDimmed ? 0.4 : 1,
                  boxShadow: isHovered ? '0 12px 30px rgba(0,123,255,0.3)' : 'none',
                  zIndex: isHovered ? 10 : 1,
                }}
              >
                {/* Header de la Tabla */}
                <div
                  style={{
                    background: isHovered ? '#007bff' : theme.headerBg,
                    color: isHovered ? '#ffffff' : theme.text,
                    padding: '12px 16px',
                    fontWeight: 700,
                    fontFamily: "'Fira Code', monospace",
                    fontSize: '15px',
                    borderBottom: `1px solid ${theme.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>📌</span> {table.name}
                </div>

                {/* Lista de Columnas y Atributos Formateados */}
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {table.columns.map((col) => (
                    <div
                      key={col.name}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        fontFamily: "'Fira Code', monospace",
                        padding: '4px 0',
                      }}
                    >
                      <span style={{ fontWeight: col.isPk || col.isFk ? 700 : 400, color: theme.text }}>
                        {col.name}
                      </span>

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {col.isPk && (
                          <span style={{ background: '#ffc10722', color: '#ffc107', border: '1px solid #ffc107', fontSize: '10px', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                            PK
                          </span>
                        )}
                        {col.isFk && (
                          <span style={{ background: '#17a2b822', color: '#17a2b8', border: '1px solid #17a2b8', fontSize: '10px', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                            FK → {col.refTable}
                          </span>
                        )}
                        <span style={{ background: theme.cardBg, color: theme.textMuted, fontSize: '11px', padding: '2px 6px', borderRadius: '4px', border: `1px solid ${theme.border}` }}>
                          {col.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};