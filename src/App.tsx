import { useState, useEffect } from 'react';
import initSqlJs, { Database } from 'sql.js';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { INITIAL_SCHEMA } from './schema';
import { EXERCISES, Exercise } from './exercises';
import { evaluateQuery, EvaluationResult } from './utils/evaluator';

export default function App() {
  const [db, setDb] = useState<Database | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise>(EXERCISES[0]);
  const [userQuery, setUserQuery] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    initSqlJs({ locateFile: () => `/sql-wasm.wasm` })
      .then((SQL) => {
        const database = new SQL.Database();
        database.run(INITIAL_SCHEMA);
        setDb(database);
      });
  }, []);

  const handleVerify = () => {
    if (!db) return;
    const result = evaluateQuery(db, userQuery, currentExercise.expectedQuery);
    setEvaluation(result);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Panel Izquierdo: Lista de Ejercicios */}
      <div style={{ width: '280px', borderRight: '1px solid #ddd', padding: '15px', background: '#f8f9fa' }}>
        <h3 style={{ marginTop: 0 }}>Guía 3 - SQL</h3>
        {EXERCISES.map((ex) => (
          <div 
            key={ex.id}
            onClick={() => {
              setCurrentExercise(ex);
              setUserQuery('');
              setEvaluation(null);
            }}
            style={{
              padding: '10px',
              margin: '6px 0',
              cursor: 'pointer',
              borderRadius: '6px',
              background: currentExercise.id === ex.id ? '#007bff' : '#ffffff',
              color: currentExercise.id === ex.id ? '#000000' : '#333333',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{ex.title}</div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>{ex.level}</div>
          </div>
        ))}
      </div>

      {/* Panel Derecho: Workspace del Alumno */}
      <div style={{ flex: 1, padding: '20px', maxWidth: '800px' }}>
        <h2 style={{ marginTop: 0 }}>{currentExercise.title}</h2>
        <p style={{ fontSize: '15px', color: '#444' }}>{currentExercise.description}</p>

        <CodeMirror
          value={userQuery}
          height="140px"
          extensions={[sql()]}
          onChange={(val) => setUserQuery(val)}
          theme="dark"
        />

        <button 
          onClick={handleVerify}
          style={{ 
            marginTop: '12px', 
            padding: '10px 24px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Verificar Respuesta
        </button>

        {/* Mensaje de Corrección */}
        {evaluation && (
          <div style={{ 
            marginTop: '15px', 
            padding: '12px', 
            borderRadius: '6px',
            background: evaluation.isCorrect ? '#d4edda' : '#f8d7da',
            color: evaluation.isCorrect ? '#155724' : '#721c24',
            border: `1px solid ${evaluation.isCorrect ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            <strong>{evaluation.isCorrect ? '✅ ' : '❌ '} {evaluation.message}</strong>
          </div>
        )}
      </div>
    </div>
  );
}