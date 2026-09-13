import { useState, useEffect } from 'react';
import initSqlJs, { Database } from 'sql.js';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { bbedit } from '@uiw/codemirror-theme-bbedit';
import { INITIAL_SCHEMA } from './schema';
import { EXERCISES, Exercise } from './exercises';
import { SchemaModal } from './SchemaModal';
import { evaluateQuery, EvaluationResult } from './utils/evaluator';
import { supabase } from './supabaseClient';

export default function App() {
  const [db, setDb] = useState<Database | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise>(EXERCISES[0]);
  const [userQuery, setUserQuery] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  // Estados de navegación
  const [hasStarted, setHasStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSchemaModal, setShowSchemaModal] = useState(false);

  // Auth & Leaderboard States
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    initSqlJs({ locateFile: () => `/sql-wasm.wasm` }).then((SQL) => {
      const database = new SQL.Database();
      database.run(INITIAL_SCHEMA);
      setDb(database);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('username, points')
      .order('points', { ascending: false })
      .limit(10);
    if (data) setLeaderboard(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = `${username.toLowerCase().replace(/\s+/g, '')}@estudiante.com`;
    const password = 'Password123!';
    
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      const reg = await supabase.auth.signUp({ email, password });
      if (reg.data.user) {
        await supabase.from('profiles').insert([{ id: reg.data.user.id, username, points: 0 }]);
        setUser(reg.data.user);
      }
    } else {
      setUser(data.user);
    }
    fetchLeaderboard();
  };

  const handleVerify = async () => {
    if (!db) return;
    const result = evaluateQuery(db, userQuery, currentExercise.expectedQuery);
    setEvaluation(result);

    if (result.isCorrect && user) {
      const { data: existing } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('exercise_id', currentExercise.id);

      if (!existing || existing.length === 0) {
        await supabase.from('user_progress').insert([{ user_id: user.id, exercise_id: currentExercise.id }]);
        
        const pointsToAdd = currentExercise.points || 1;
        const { data: profile } = await supabase.from('profiles').select('points').eq('id', user.id).single();
        const currentPoints = profile?.points || 0;

        await supabase.from('profiles').update({ points: currentPoints + pointsToAdd }).eq('id', user.id);
        fetchLeaderboard();
      }
    }
  };

  const theme = {
    bg: darkMode ? '#181825' : '#f8f9fa',
    headerBg: darkMode ? '#1e1e2e' : '#ffffff',
    sidebarBg: darkMode ? '#1e1e2e' : '#ffffff',
    cardBg: darkMode ? '#313244' : '#ffffff',
    text: darkMode ? '#cdd6f4' : '#212529',
    textMuted: darkMode ? '#a6adc8' : '#6c757d',
    border: darkMode ? '#45475a' : '#dee2e6',
    inputBg: darkMode ? '#313244' : '#ffffff',
    editorTheme: darkMode ? vscodeDark : bbedit
  };

  // 1. PÁGINA DE BIENVENIDA / LANDING
  if (!hasStarted) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: theme.bg,
        color: theme.text,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ maxWidth: '700px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
          <h1 style={{ fontSize: '40px', fontWeight: 800, fontFamily: "'Fira Code', monospace", marginBottom: '16px' }}>
            SQL Practice <span style={{ color: '#007bff' }}>Camejo & CO</span>
          </h1>
          <p style={{ fontSize: '18px', color: theme.textMuted, lineHeight: '1.6', marginBottom: '36px' }}>
            Plataforma interactiva para dominar consultas SQL relacionales con bases de datos en tiempo real. Resolvé ejercicios por niveles, ganá puntos y competí en el ranking.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '16px', 
            marginBottom: '40px',
            textAlign: 'left' 
          }}>
            <div style={{ background: theme.cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>🌱 Nivel 0 - 1</h4>
              <p style={{ margin: 0, fontSize: '13px', color: theme.textMuted }}>`SELECT`, `WHERE`, `ORDER BY` y filtrados básicos.</p>
            </div>
            <div style={{ background: theme.cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#28a745' }}>🚀 Nivel 2 - 3</h4>
              <p style={{ margin: 0, fontSize: '13px', color: theme.textMuted }}>`JOIN`, agregaciones (`SUM`, `COUNT`) y subconsultas.</p>
            </div>
            <div style={{ background: theme.cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#ffc107' }}>🔥 Nivel 4</h4>
              <p style={{ margin: 0, fontSize: '13px', color: theme.textMuted }}>Consultas complejas con `HAVING` y subqueries avanzadas.</p>
            </div>
          </div>

          <button 
            onClick={() => setHasStarted(true)}
            style={{ 
              backgroundColor: '#007bff', 
              color: '#fff', 
              border: 'none', 
              padding: '16px 40px', 
              borderRadius: '10px', 
              fontSize: '18px', 
              fontWeight: 700, 
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 123, 255, 0.4)'
            }}
          >
            Comenzar Práctica →
          </button>
        </div>
      </div>
    );
  }

  // 2. VISTA INTERACTIVA PRINCIPAL
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      width: '100vw',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: theme.bg,
      color: theme.text,
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <header style={{ 
        background: theme.headerBg, 
        borderBottom: `1px solid ${theme.border}`,
        padding: '16px 32px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} onClick={() => setHasStarted(false)}>
          <span style={{ fontSize: '24px' }}>⚡</span>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, fontFamily: "'Fira Code', monospace", display: 'flex', alignItems: 'center', gap: '10px' }}>
            SQL Practice <span style={{ color: '#007bff', fontSize: '12px', background: '#007bff15', padding: '4px 8px', borderRadius: '4px' }}>Camejo & CO</span>
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setShowSchemaModal(true)}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              color: theme.text,
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📊 Ver Tablas / Esquema
          </button>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              color: theme.text,
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button 
            onClick={() => setShowLeaderboard(!showLeaderboard)} 
            style={{ 
              background: showLeaderboard ? '#007bff' : 'transparent',
              color: showLeaderboard ? '#fff' : theme.text,
              border: `1px solid ${showLeaderboard ? '#007bff' : theme.border}`,
              borderRadius: '8px',
              padding: '8px 18px', 
              fontWeight: 600,
              cursor: 'pointer' 
            }}
          >
            {showLeaderboard ? '📘 Ejercicios' : '🏆 Ranking'}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: theme.textMuted }}>Alumno activo</span>
              <button 
                onClick={() => supabase.auth.signOut().then(() => setUser(null))}
                style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Salir
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Padrón o Usuario" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                style={{ 
                  background: theme.inputBg,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  padding: '8px 14px',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '14px'
                }} 
              />
              <button type="submit" style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                Ingresar
              </button>
            </form>
          )}
        </div>
      </header>

      {/* MODAL INTERACTIVO DE ESQUEMA */}
      <SchemaModal 
        isOpen={showSchemaModal} 
        onClose={() => setShowSchemaModal(false)} 
        theme={theme} 
      />

      {/* Contenido Interactivo */}
      {showLeaderboard ? (
        <div style={{ padding: '48px 24px', maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '24px' }}>🏆 Ranking Global de Alumnos</h2>
          <div style={{ background: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}`, background: theme.headerBg }}>
                  <th style={{ padding: '16px 24px' }}>Puesto</th>
                  <th style={{ padding: '16px 24px' }}>Alumno</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Puntos</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <tr key={index} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>#{index + 1}</td>
                    <td style={{ padding: '16px 24px' }}>{item.username}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700, color: '#28a745' }}>{item.points} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, width: '100%' }}>
          {/* Sidebar */}
          <aside style={{ 
            width: '340px', 
            borderRight: `1px solid ${theme.border}`, 
            padding: '24px 16px', 
            background: theme.sidebarBg,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <h4 style={{ margin: '0 0 12px 12px', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1.2px', color: theme.textMuted, fontWeight: 700 }}>
              Lista de Consignas
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: 'calc(100vh - 140px)', paddingRight: '4px' }}>
              {EXERCISES.map((ex) => {
                const isActive = currentExercise.id === ex.id;
                return (
                  <div 
                    key={ex.id} 
                    onClick={() => { setCurrentExercise(ex); setUserQuery(''); setEvaluation(null); }}
                    style={{
                      padding: '14px 16px',
                      cursor: 'pointer',
                      borderRadius: '10px',
                      border: `1px solid ${isActive ? '#007bff' : theme.border}`,
                      background: isActive ? (darkMode ? '#0056b3' : '#e7f1ff') : theme.cardBg,
                      color: isActive ? (darkMode ? '#ffffff' : '#004085') : theme.text,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{ex.title}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      {ex.level} • 🏆 {ex.points} {ex.points === 1 ? 'pto' : 'ptos'}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Área de Workspace */}
          <main style={{ flex: 1, padding: '40px 48px', maxWidth: '1000px', margin: '0 auto', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '32px' }}>
              <span style={{ 
                background: '#007bff20', 
                color: '#007bff', 
                padding: '6px 12px', 
                borderRadius: '6px', 
                fontSize: '13px', 
                fontWeight: 600 
              }}>
                {currentExercise.level}
              </span>
              <h1 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '28px', fontWeight: 700 }}>{currentExercise.title}</h1>
              <p style={{ color: theme.textMuted, fontSize: '16px', lineHeight: '1.6', margin: 0 }}>{currentExercise.description}</p>
            </div>

            <div style={{ 
              borderRadius: '10px', 
              overflow: 'hidden', 
              border: `1px solid ${theme.border}`,
              marginBottom: '20px'
            }}>
              <CodeMirror 
                value={userQuery} 
                height="200px" 
                theme={theme.editorTheme}
                extensions={[sql()]} 
                onChange={(val) => setUserQuery(val)} 
              />
            </div>

            <button 
              onClick={handleVerify} 
              style={{ 
                padding: '14px 32px', 
                cursor: 'pointer', 
                backgroundColor: '#28a745', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '15px'
              }}
            >
              Ejecutar y Verificar
            </button>

            {evaluation && (
              <div style={{ 
                marginTop: '24px', 
                padding: '20px', 
                borderRadius: '10px', 
                border: `1px solid ${evaluation.isCorrect ? '#28a745' : '#dc3545'}`,
                background: evaluation.isCorrect ? '#28a74515' : '#dc354515', 
                color: evaluation.isCorrect ? '#28a745' : '#dc3545',
                fontFamily: "'Fira Code', monospace",
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                <strong>{evaluation.isCorrect ? '✅ ¡Correcto! ' : '❌ Error: '}</strong>
                {evaluation.message}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}