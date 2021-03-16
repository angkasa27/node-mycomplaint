const   Seq     =   require('sequelize'),
        koneksi =   require('./koneksi');

module.exports  =   koneksi.Seq_.define("tb_pengaduan",{
        id_pengaduan    : {type : Seq.INTEGER , primaryKey : true},
        tgl_pengaduan   : {type : Seq.STRING } ,
        nik_pengaduan   : {type : Seq.CHAR},
        subjek          : {type : Seq.STRING},
        isi_laporan     : {type : Seq.TEXT},
        foto            : {type : Seq.STRING},
        status          : {type : Seq.STRING}
    },{ timestamps: false }
)