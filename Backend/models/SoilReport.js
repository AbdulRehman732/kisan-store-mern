const mongoose = require('mongoose');

const SoilReportSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testDate: { type: Date, default: Date.now },
    location: { type: String, trim: true },
    nitrogen: { type: Number, required: true }, // mg/kg or %
    phosphorus: { type: Number, required: true },
    potassium: { type: Number, required: true },
    ph: { type: Number },
    organicMatter: { type: Number },
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SoilReport', SoilReportSchema);
