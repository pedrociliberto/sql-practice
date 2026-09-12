import { useState, useEffect } from 'react';
import initSqlJs, { Database } from 'sql.js';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { INITIAL_SCHEMA } from './schema';
import { EXERCISES, Exercise } from './exercises';
import { evaluateQuery, EvaluationResult } from './utils/evaluator';
import { supabase } from './supabaseClient';

export default function App() {
  const [db, setDb] = useState<Database | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise>(EXERCISES[0]);
  const [userQuery, setUserQuery] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  
  // Auth & Leaderboard States
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    // Inicializar SQLite
    initSqlJs({ locateFile: () => `/sql-wasm.wasm` }).then((SQL) => {
      const database = new SQL.Database();
      database.run(INITIAL_SCHEMA);
      setDb(database);
    });

    // Cargar sesión de usuario si existe
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
    const password = 'Password123!'; // Autenticación simplificada para aula
    
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      // Si no existe, registrar cuenta
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

    // Si es correcto y hay un alumno logueado, sumar puntaje
    if (result.isCorrect && user) {
      const { data: existing } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('exercise_id', currentExercise.id);

      // Si no lo había resuelto antes
      if (!existing || existing.length === 0) {
        await supabase.from('user_progress').insert([{ user_id: user.id, exercise_id: currentExercise.id }]);
        
        // Sumar 10 puntos al perfil del usuario
        const { data: profile } = await supabase.from('profiles').select('points').eq('id', user.id).single();
        const currentPoints = profile?.points || 0;

        await supabase.from('profiles').update({ points: currentPoints + 10 }).eq('id', user.id);
        fetchLeaderboard();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Top Header / Auth Bar */}
      <header style={{ background: '#343a40', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-[#343a40]', alignItems: 'center' }}>
        <h3 style={{ margin: 0, flex: 1 }}>SQL Practice - Camejo & CO</h3>
        <button onClick={() => setShowLeaderboard(!showLeaderboard)} style={{ marginRight: '15px', padding: '6px 12px', cursor: 'pointer' }}>
          {showLeaderboard ? 'Ver Ejercicios' : '🏆 Ranking'}
        </button>
        {user ? (
          <div>Bienvenido, alumno! <button onClick={() => supabase.auth.signOut().then(() => setUser(null))}>Salir</button></div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="Tu Nombre o Padron" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '4px 8px' }} />
            <button type="submit" style={{ padding: '4px 12px', cursor: 'pointer' }}>Ingresar</button>
          </form>
        )}
      </header>

      {/* Main Content Area */}
      {showLeaderboard ? (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <h2>🏆 Ranking Global de Alumnos</h2>
          <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f2f2f2' }}>
                <th>Puesto</th>
                <th>Alumno</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, index) => (
                <tr key={index}>
                  <td><strong>#{index + 1}</strong></td>
                  <td>{item.username}</td>
                  <td>{item.points} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Panel Izquierdo: Ejercicios */}
          <div style={{ width: '280px', borderRight: '1px solid #ddd', padding: '15px', background: '#f8f9fa' }}>
            <h3>Ejercicios</h3>
            {EXERCISES.map((ex) => (
              <div 
                key={ex.id} 
                onClick={() => { setCurrentExercise(ex); setUserQuery(''); setEvaluation(null); }}
                style={{
                  padding: '10px', margin: '6px 0', cursor: 'pointer', borderRadius: '6px',
                  background: currentExercise.id === ex.id ? '#007bff' : '#ffffff',
                  color: currentExercise.id === ex.id ? '#ffffff' : '#333333'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{ex.title}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>{ex.level}</div>
              </div>
            ))}
          </div>

          {/* Panel Derecho: Workspace */}
          <div style={{ flex: 1, padding: '20px' }}>
            <h2>{currentExercise.title}</h2>
            <p>{currentExercise.description}</p>
            <CodeMirror value={userQuery} height="150px" extensions={[sql()]} onChange={(val) => setUserQuery(val)} />
            <button onClick={handleVerify} style={{ marginTop: '12px', padding: '10px 24px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
              Verificar Respuesta
            </button>

            {evaluation && (
              <div style={{ marginTop: '15px', padding: '12px', borderRadius: '6px', background: evaluation.isCorrect ? '#d4edda' : '#f8d7da', color: evaluation.isCorrect ? '#155724' : '#721c24' }}>
                <strong>{evaluation.isCorrect ? '✅ ' : '❌ '} {evaluation.message}</strong>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}