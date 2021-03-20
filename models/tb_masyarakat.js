const   Seq     =   require('sequelize'),
        koneksi =   require('./koneksi');

module.exports = koneksi.Seq_.define(
  'tb_masyarakat',
  {
    nik: { type: Seq.CHAR, primaryKey: true },
    nama: { type: Seq.STRING },
    username: { type: Seq.STRING },
    password: { type: Seq.STRING },
    telp: { type: Seq.STRING },
    createAt_masyarakat: { type: Seq.STRING },
  },
  { timestamps: false }
);