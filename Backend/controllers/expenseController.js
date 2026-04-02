const Expense = require('../models/Expense');
const Account = require('../models/Account');

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('account', 'name type bankName')
      .populate('recordedBy', 'first_name last_name')
      .sort({ spentAt: -1 });
    res.json({ expenses });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, method, accountId, spentAt, note } = req.body;
    if (!title || !amount || amount <= 0) return res.status(400).json({ message: 'Title and valid amount are required' });
    if (!method) return res.status(400).json({ message: 'Payment method required' });

    const expenseData = {
      title,
      amount: Number(amount),
      category: category || 'Other',
      method,
      spentAt: spentAt ? new Date(spentAt) : new Date(),
      note: note || '',
      recordedBy: req.user._id
    };

    if (accountId) {
      const account = await Account.findById(accountId);
      if (!account) return res.status(404).json({ message: 'Account not found' });
      if (account.balance < Number(amount)) {
        return res.status(400).json({ message: `Insufficient balance in ${account.name}. Available: Rs. ${account.balance.toLocaleString()}` });
      }
      account.balance -= Number(amount);
      await account.save();
      expenseData.account = accountId;
    }

    const expense = await Expense.create(expenseData);
    const populated = await Expense.findById(expense._id).populate('account', 'name type bankName');
    res.status(201).json({ expense: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // Refund the account balance if applicable
    if (expense.account) {
      const account = await Account.findById(expense.account);
      if (account) {
        account.balance += expense.amount;
        await account.save();
      }
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense removed and balance refunded' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, category, method, accountId, spentAt, note } = req.body;
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    const newAmount = Number(amount);
    const oldAmount = expense.amount;
    const oldAccountId = expense.account ? expense.account.toString() : null;
    const newAccountId = accountId || null;

    if (oldAccountId === newAccountId) {
      if (oldAccountId) {
        const account = await Account.findById(oldAccountId);
        if (account) {
          const diff = newAmount - oldAmount;
          account.balance -= diff;
          await account.save();
        }
      }
    } else {
      if (oldAccountId) {
        const oldAccount = await Account.findById(oldAccountId);
        if (oldAccount) {
          oldAccount.balance += oldAmount;
          await oldAccount.save();
        }
      }
      if (newAccountId) {
        const newAccount = await Account.findById(newAccountId);
        if (newAccount) {
          newAccount.balance -= newAmount;
          await newAccount.save();
        }
      }
    }

    expense.title = title || expense.title;
    expense.amount = newAmount;
    expense.category = category || expense.category;
    expense.method = method || expense.method;
    expense.account = newAccountId || undefined;
    expense.spentAt = spentAt ? new Date(spentAt) : expense.spentAt;
    expense.note = note || expense.note;

    await expense.save();
    const populated = await Expense.findById(expense._id).populate('account', 'name type bankName');
    res.json({ expense: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

