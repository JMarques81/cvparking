const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registar = async (req, res) => {
  const { nome, email, password, permissoes } = req.body;

  try {
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ mensagem: 'Email já registado.' });

    const hash = await bcrypt.hash(password, 10);

    const novoUser = new User({
      nome,
      email,
      passwordHash: hash,
      permissoes: permissoes || ['publico']
    });

    await novoUser.save();

    res.status(201).json({ mensagem: 'Utilizador registado com sucesso.' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro no registo.', erro: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ mensagem: 'Utilizador não encontrado.' });

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) return res.status(401).json({ mensagem: 'Senha incorreta.' });

    const token = jwt.sign(
      { id: user._id, nome: user.nome, permissoes: user.permissoes },
      process.env.JWT_SECRET || 'segredo123',
      { expiresIn: '1d' }
    );


    res.json({ mensagem: 'Login efetuado com sucesso.', token, permissoes: user.permissoes });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro no login.', erro: err.message });
  }
};

module.exports = { registar, login };

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const registar = async (req, res) => {
//   const { nome, email, password, permissoes } = req.body;

//   try {
//     const existe = await User.findOne({ email });
//     if (existe) return res.status(400).json({ mensagem: 'Email já registado.' });

//     const hash = await bcrypt.hash(password, 10);
//     console.log('🔐 Password original:', password);
//     console.log('🔒 Password hash gerado:', hash);

//     const novoUser = new User({
//       nome,
//       email,
//       passwordHash: hash,
//       permissoes: permissoes || ['publico']
//     });

//     await novoUser.save();

//     res.status(201).json({ mensagem: 'Utilizador registado com sucesso.' });
//   } catch (err) {
//     console.error('❌ Erro no registo:', err);
//     res.status(500).json({ mensagem: 'Erro no registo.', erro: err.message });
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ mensagem: 'Utilizador não encontrado.' });

//     console.log('🔓 Password recebida no login:', password);
//     console.log('🧾 Hash guardado:', user.passwordHash);

//     const passwordMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!passwordMatch) return res.status(401).json({ mensagem: 'Senha incorreta.' });

//     const token = jwt.sign(
//       { id: user._id, permissoes: user.permissoes },
//       process.env.JWT_SECRET || 'segredo123',
//       { expiresIn: '1d' }
//     );

//     res.json({ mensagem: 'Login efetuado com sucesso.', token, permissoes: user.permissoes });
//   } catch (err) {
//     console.error('❌ Erro no login:', err);
//     res.status(500).json({ mensagem: 'Erro no login.', erro: err.message });
//   }
// };

// module.exports = { registar, login };
