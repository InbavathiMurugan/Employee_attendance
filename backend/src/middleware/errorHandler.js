module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Server Error';
  // handle mongoose duplicate key
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue || {}).join(', ');
    return res.status(400).json({ message: `Duplicate field: ${key}` });
  }
  res.status(status).json({ message });
};
