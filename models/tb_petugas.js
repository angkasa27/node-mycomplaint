const   Seq     =   require('sequelize'),
        koneksi =   require('./koneksi');

module.exports  = koneksi.Seq_.define("tb_petugas",{
        id_petugas      : {type : Seq.INTEGER , primaryKey : true},
        nama_petugas    : {type : Seq.STRING} ,
        Username        : {type : Seq.STRING} ,
        Password        : {type : Seq.STRING} ,
        telp            : {type : Seq.STRING} ,
        level           : {type : Seq.STRING} ,
    },{timestamps : false}
)