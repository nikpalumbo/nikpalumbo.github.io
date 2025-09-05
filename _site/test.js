module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  res.status(200).json({
    message: "Root API is working!",
    timestamp: new Date().toISOString(),
    framework: "Node.js",
    deployment: "Vercel",
    method: req.method,
    url: req.url
  });
};

