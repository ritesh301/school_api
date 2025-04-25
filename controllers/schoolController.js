const db = require('../db');
const getDistance = require('../utils/distance');

// Add School API
exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: 'School added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List Schools API
exports.listSchools = async (req, res) => {
  // ✅ Convert user query input to float
  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }

  try {
    const [schools] = await db.execute('SELECT * FROM schools');

    // ✅ Parse each school's lat/lon to float before calculating distance
    const sorted = schools
      .map((school) => {
        const schoolLat = parseFloat(school.latitude);
        const schoolLon = parseFloat(school.longitude);

        const distance = getDistance(userLat, userLon, schoolLat, schoolLon);

        return {
          ...school,
          distance
        };
      })
      .sort((a, b) => a.distance - b.distance);

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
