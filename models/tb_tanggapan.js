const   Seq     =   require('sequelize'),
        koneksi =   require('./koneksi');
module.exports  =   koneksi.Seq_.define("tb_tanggapan",{
        id_tanggapan        :   { type : Seq.INTEGER , primaryKey : true},
        id_pengaduans       :   { type : Seq.INTEGER},
        tgl_tanggapan       :   { type : Seq.STRING},
        tanggapan           :   { type : Seq.TEXT},
        id_petugas_         :   { type : Seq.INTEGER}
    },{timestamps : false}
)