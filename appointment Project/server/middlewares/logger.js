const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, body = {}, query = {}, params = {} } = req;

  // Log request details
  console.log(`\n=== Request Details ===`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`${method} ${url}`);
  
  if (body && Object.keys(body).length > 0) {
    const sanitizedBody = { ...body };
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    console.log('Body:', sanitizedBody);
  }
  
  if (query && Object.keys(query).length > 0) {
    console.log('Query:', query);
  }
  
  if (params && Object.keys(params).length > 0) {
    console.log('Params:', params);
  }

  // Log response details
  const oldJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - start;
    console.log(`\n=== Response Details ===`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Duration: ${duration}ms`);
    
    // Only log response data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Response:', data);
    }
    
    console.log('=== End ===\n');
    return oldJson.apply(res, arguments);
  };

  next();
};

module.exports = requestLogger;