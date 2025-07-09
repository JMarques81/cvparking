
// Middleware: Verificar token JWT
const jwt = require('jsonwebtoken');

// Middleware: Verificar token JWT
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo123');

    
    req.utilizador = {
      id: decoded.id,
      nome: decoded.nome,
      permissoes: decoded.permissoes
    };
    console.log('🧾 Token verificado para:', req.utilizador);

    next();
  } catch (err) {
    console.error('❌ Erro ao verificar token:', err);
    return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
  }
};


// Middleware: Verificar se é admin
const verificarAdmin = (req, res, next) => {
  if (req.utilizador && req.utilizador.permissoes?.includes('admin')) {
    return next();
  }
  return res.status(403).json({ mensagem: 'Acesso restrito a administradores.' });
};

// Middleware: Verificar se é fiscal
const verificarFiscal = (req, res, next) => {
  if (req.utilizador && req.utilizador.permissoes?.includes('fiscal')) {
    return next();
  }
  return res.status(403).json({ mensagem: 'Acesso restrito a fiscais.' });
};

module.exports = {
  verificarToken,
  verificarAdmin,
  verificarFiscal,
};


//3

// const jwt = require('jsonwebtoken');

// // Middleware: Verificar token JWT
// const verificarToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ mensagem: 'Token não fornecido.' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo123');
//     req.user = decoded; // { id, tipo }
//     next();
//   } catch (err) {
//     return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
//   }
// };

// // Middleware: Verificar se é admin
// const verificarAdmin = (req, res, next) => {
//   if (req.user && req.user.tipo === 'admin') {
//     return next();
//   }
//   return res.status(403).json({ mensagem: 'Acesso restrito a administradores.' });
// };

// module.exports = {
//   verificarToken,
//   verificarAdmin
// };
