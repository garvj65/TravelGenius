export async function queryWithRetry(queryFn, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const result = await queryFn();
      if (result.error) throw result.error;
      return result.data;
    } catch (error) {
      retries++;
      if (retries === maxRetries) throw error;
      // Exponential backoff
      await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000));
    }
  }
} 