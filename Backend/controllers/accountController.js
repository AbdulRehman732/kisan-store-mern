const Account = require('../models/Account');

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.json({ accounts });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { name, type, bankName, accountNumber } = req.body;
    if (!name || !type) return res.status(400).json({ message: 'Name and type are required' });
    const account = await Account.create({ name, type, bankName, accountNumber });
    res.status(201).json({ account });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.json({ message: 'Account removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.transferFunds = async (req, res) => {
  try {
    const Transfer = require('../models/Transfer');
    const { fromAccountId, toAccountId, amount, date, note } = req.body;
    
    const fromAcc = await Account.findById(fromAccountId);
    const toAcc = await Account.findById(toAccountId);
    if (!fromAcc || !toAcc) return res.status(404).json({ message: 'Account(s) not found' });
    if (fromAcc.balance < Number(amount)) return res.status(400).json({ message: 'Insufficient funds' });

    fromAcc.balance -= Number(amount);
    toAcc.balance += Number(amount);
    await fromAcc.save();
    await toAcc.save();

    const transfer = await Transfer.create({
      fromAccount: fromAccountId,
      toAccount: toAccountId,
      amount: Number(amount),
      recordedBy: req.user._id,
      date: date || new Date(),
      note: note || ''
    });

    res.status(201).json({ transfer });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.adminWithdraw = async (req, res) => {
  try {
    const AdminUsage = require('../models/AdminUsage');
    const Product = require('../models/Product');
    const { type, amount, items, accountId, note, date } = req.body;

    if (amount > 0) {
      const account = await Account.findById(accountId);
      if (account) {
        account.balance -= Number(amount);
        await account.save();
      }
    }

    if (items && items.length > 0) {
      for (const it of items) {
        await Product.findByIdAndUpdate(it.product, { $inc: { stock: -Number(it.quantity) } });
      }
    }

    const usage = await AdminUsage.create({
      type, amount: Number(amount)||0, items: items||[], account: accountId, recordedBy: req.user._id, note, date
    });

    res.status(201).json({ usage });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

