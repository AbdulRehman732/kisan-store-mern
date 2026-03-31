const SoilReport = require('../models/SoilReport');
const AuditLog = require('../models/AuditLog');

exports.getReports = async (req, res) => {
  try {
    const reports = await SoilReport.find({ farmer: req.user._id }).sort({ testDate: -1 });
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addReport = async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, ph, organicMatter, location, notes, testDate } = req.body;
    const report = await SoilReport.create({
      farmer: req.user._id,
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      ph: ph ? Number(ph) : undefined,
      organicMatter: organicMatter ? Number(organicMatter) : undefined,
      location,
      notes,
      testDate: testDate || new Date()
    });

    // Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: 'ADD_SOIL_REPORT',
      targetType: 'SoilReport',
      targetId: report._id,
      details: { farmer: req.user._id }
    });

    res.status(201).json({ report });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await SoilReport.findOneAndDelete({ _id: req.params.id, farmer: req.user._id });
    if (!report) return res.status(404).json({ message: 'Soil report not found' });
    res.json({ message: 'Soil report deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
