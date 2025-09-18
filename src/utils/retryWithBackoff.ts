/**
 * Utilidad para reintentar llamadas con exponential backoff
 * Crítico para manejar rate limits de Claude API
 */

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, error: any) => void;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    onRetry
  } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // No reintentar si es un error de cliente (4xx excepto 429)
      if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }

      // Si es el último intento, lanzar el error
      if (attempt === maxRetries) {
        console.error(`❌ Fallo después de ${maxRetries} intentos:`, error);
        throw error;
      }

      // Calcular delay con backoff exponencial
      const delay = Math.min(
        initialDelay * Math.pow(backoffFactor, attempt - 1),
        maxDelay
      );

      // Si es rate limit (429), usar el delay sugerido por el servidor si está disponible
      const retryAfter = error.headers?.['retry-after'];
      const finalDelay = retryAfter ? parseInt(retryAfter) * 1000 : delay;

      console.warn(`⚠️ Intento ${attempt}/${maxRetries} falló. Reintentando en ${finalDelay}ms...`);

      // Callback opcional para logging
      if (onRetry) {
        onRetry(attempt, error);
      }

      // Esperar antes de reintentar
      await new Promise(resolve => setTimeout(resolve, finalDelay));
    }
  }

  throw lastError;
}

/**
 * Wrapper específico para llamadas a Claude API
 */
export async function callClaudeWithRetry<T>(
  apiCall: () => Promise<T>,
  context?: string
): Promise<T> {
  return retryWithBackoff(apiCall, {
    maxRetries: 3,
    initialDelay: 2000,
    maxDelay: 60000,
    backoffFactor: 3, // Más agresivo para Claude
    onRetry: (attempt, error) => {
      console.log(`🔄 Claude API retry ${attempt} para: ${context || 'llamada'}`);

      // Log específico por tipo de error
      if (error.status === 429) {
        console.warn('⏱️ Rate limit alcanzado, esperando...');
      } else if (error.status === 503) {
        console.warn('🔧 Servicio temporalmente no disponible');
      } else if (error.message?.includes('timeout')) {
        console.warn('⏰ Timeout detectado, reintentando...');
      }
    }
  });
}