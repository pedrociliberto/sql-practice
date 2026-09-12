import { Database } from 'sql.js';

export interface EvaluationResult {
  isCorrect: boolean;
  message: string;
  userRows?: any[];
  expectedRows?: any[];
}

export function evaluateQuery(db: Database, userQuery: string, expectedQuery: string): EvaluationResult {
  try {
    // 1. Ejecutar ambas consultas en el entorno de SQLite local
    const userRes = db.exec(userQuery);
    const expectedRes = db.exec(expectedQuery);

    if (userRes.length === 0) {
      return { 
        isCorrect: false, 
        message: "La consulta se ejecutó pero no devolvió ninguna fila de resultados." 
      };
    }

    const userData = userRes[0];
    const expectedData = expectedRes[0];

    // 2. Comparar si coinciden las columnas
    const sameColumns = JSON.stringify(userData.columns) === JSON.stringify(expectedData.columns);
    
    // 3. Comparar si coinciden los contenidos (valores de las filas)
    const sameValues = JSON.stringify(userData.values) === JSON.stringify(expectedData.values);

    if (sameColumns && sameValues) {
      return {
        isCorrect: true,
        message: "¡Excelente! Tu consulta devolvió exactamente los datos esperados.",
        userRows: userData.values
      };
    } else {
      return {
        isCorrect: false,
        message: "Resultado incorrecto. La estructura o los datos no coinciden con la respuesta esperada.",
        userRows: userData.values,
        expectedRows: expectedData.values
      };
    }
  } catch (err: any) {
    return {
      isCorrect: false,
      message: `Error de sintaxis SQL: ${err.message}`
    };
  }
}