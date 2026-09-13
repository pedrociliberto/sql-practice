export interface EvaluationResult {
  isCorrect: boolean;
  message: string;
  suggestion?: string; // Pista inteligente generada
}

export function evaluateQuery(db: any, userQuery: string, expectedQuery: string): EvaluationResult {
  const cleanQuery = userQuery.trim().toLowerCase();

  // Validaciones preventivas de sintaxis SQL
  if (!cleanQuery) {
    return { isCorrect: false, message: 'La consulta está vacía.', suggestion: 'Escribí una instrucción SQL como `SELECT ...`' };
  }

  if (!cleanQuery.includes('select')) {
    return { isCorrect: false, message: 'Falta la cláusula SELECT.', suggestion: 'Toda consulta de lectura debe comenzar con `SELECT`.' };
  }

  if (!cleanQuery.includes('from') && !cleanQuery.includes('select 1')) {
    return { isCorrect: false, message: 'Falta indicar la tabla origen (FROM).', suggestion: 'Asegurate de especificar `FROM nombre_tabla`.' };
  }

  try {
    // Ejecución en SQLite de la query del usuario
    const userRes = db.exec(userQuery);
    const expectedRes = db.exec(expectedQuery);

    if (userRes.length === 0 && expectedRes.length > 0) {
      return { 
        isCorrect: false, 
        message: 'La consulta no devolvió ninguna fila.', 
        suggestion: 'Revisá los filtros en el `WHERE` o los nombres de las condiciones (sensible a mayúsculas/minúsculas en texto).' 
      };
    }

    // Comparación de columnas o valores devueltos
    const userCols = userRes[0]?.columns.length || 0;
    const expectedCols = expectedRes[0]?.columns.length || 0;

    if (userCols !== expectedCols) {
      return { 
        isCorrect: false, 
        message: `Cantidad incorrecta de columnas (${userCols} devueltas, se esperaban ${expectedCols}).`, 
        suggestion: 'Verificá si estás seleccionando más o menos campos de los pedidos en la consigna.' 
      };
    }

    const userRows = userRes[0]?.values.length || 0;
    const expectedRows = expectedRes[0]?.values.length || 0;

    if (userRows !== expectedRows) {
      return { 
        isCorrect: false, 
        message: `La cantidad de filas devueltas no coincide (${userRows} vs ${expectedRows} esperadas).`, 
        suggestion: 'Revisá los criterios de filtrado (`WHERE`) o las condiciones de unión (`JOIN`).' 
      };
    }

    // Comprobación exacta de resultados
    const isSameData = JSON.stringify(userRes[0]?.values) === JSON.stringify(expectedRes[0]?.values);
    if (!isSameData) {
      return { 
        isCorrect: false, 
        message: 'Los datos devueltos no coinciden con lo esperado.', 
        suggestion: 'Comprobá el orden de los datos (`ORDER BY`) o si hay diferencias en los valores elegidos.' 
      };
    }

    return { isCorrect: true, message: '¡Consulta correcta! Los resultados coinciden a la perfección.' };

  } catch (error: any) {
    // Diagnóstico de errores nativos de SQLite
    const errMessage = error.message || '';
    let suggestion = 'Revisá la sintaxis general de la query.';

    if (errMessage.includes('no such table')) {
      suggestion = 'Verificá el nombre de la tabla en el botón "📊 Ver Tablas / Esquema".';
    } else if (errMessage.includes('no such column')) {
      suggestion = 'Alguna columna especificada no existe en la tabla. Comprobá los nombres exactos.';
    } else if (errMessage.includes('syntax error')) {
      suggestion = 'Hay un error de tipeo. Controlá si faltan comas entre columnas o comillas en valores de texto.';
    }

    return { isCorrect: false, message: `Error SQL: ${errMessage}`, suggestion };
  }
}