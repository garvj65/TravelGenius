export async function queryWithRetry(queryFn, maxRetries = 3) {
  let retries = 0;
  
  const delay = (attempts) => new Promise(r => 
    setTimeout(r, Math.pow(2, attempts) * 1000)
  );
  
  while (retries < maxRetries) {
    try {
      const result = await queryFn();
      if (result.error) throw result.error;
      return result.data;
    } catch (error) {
      retries++;
      if (retries === maxRetries) throw error;
      await delay(retries);
    }
  }
} 