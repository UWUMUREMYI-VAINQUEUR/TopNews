exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

  res.json({
    message: 'Image uploaded successfully',
    filePath: `/uploads/${req.file.filename}`
  });
};

exports.uploadVideo = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No video uploaded' });

  res.json({
    message: 'Video uploaded successfully',
    filePath: `/uploads/${req.file.filename}`
  });
};
