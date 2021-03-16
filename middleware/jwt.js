const jwt = require('jsonwebtoken');

exports.jalankan = (req, res, next) => {
  const tokens = req.headers.authorization;
  if (!tokens) {
    return res.json({
      success: false,
      data: {},
      message: 'Tidak ada Token',
      code: 504,
    });
  } else {
    jwt.verify(tokens, 'bebasMauDiisiApawkwk', (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          data: {},
          message: 'token tidak valid',
          code: 504,
        });
      } else {
        req.dataToken = decoded; //<= req.dataToken = berisikan data Decode
        req.isiToken = tokens; //<= req.isiToken  = berisikan token
        next();
      }
    });
  }
};
