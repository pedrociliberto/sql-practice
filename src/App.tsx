import { useState, useEffect } from 'react';
import initSqlJs, { Database } from 'sql.js';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { INITIAL_SCHEMA } from './schema';

export default function App() {
  const [db, setDb] = useState<Database | null>(null);
  const [userQuery, setUserQuery] = useState('SELECT * FROM bandas;');
  const [results, setResults] = useState<{ columns: string[]; values: any[][] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initSqlJs({ locateFile: () => `/sql-wasm.wasm` })
      .then((SQL) => {
        const database = new SQL.Database();
        database.run(INITIAL_SCHEMA);
        setDb(database);
      })
      .catch((err) => setError("Error cargando motor SQL: " + err.message));
  }, []);

  const handleExecute = () => {
    if (!db) return;
    setError(null);
    try {
      const res = db.exec(userQuery);
      if (res.length > 0) {
        setResults(res[0]);
      } else {
        setResults(null);
      }
    } catch (err: any) {
      setError(err.message);
      setResults(null);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Guia de SQL</h2>
      
      <p>Escribí tu consulta SQL y ejecutala:</p>
      <CodeMirror
        value={userQuery}
        height="140px"
        extensions={[sql()]}
        onChange={(val) => setUserQuery(val)}
      />
      
      <button 
        onClick={handleExecute} 
        style={{ marginTop: '12px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Ejecutar Consulta
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '15px' }}>
          <strong>Error SQL:</strong> {error}
        </div>
      )}

      {results && (
        <div style={{ marginTop: '20px' }}>
          <h3>Resultados:</h3>
          <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                {results.columns.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.values.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{String(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}