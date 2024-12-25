export const logQueryPerformance = async (queryName, queryFn) => {
  const start = performance.now();
  try {
    const result = await queryFn();
    const duration = performance.now() - start;
    
    // Log to your analytics service
    console.log(`Query ${queryName} took ${duration}ms`);
    return result;
  } catch (error) {
    console.error(`Query ${queryName} failed after ${performance.now() - start}ms`);
    throw error;
  }
}; 