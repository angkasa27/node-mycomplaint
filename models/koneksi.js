// File koneksi_
// Digunakan untuk Query menggunakan Sequelize
const   Seq     =   require('sequelize'),
        Seq_    =   new Seq("pengaduan_masyarakat","root","",{
                        host            :   'localhost',
                        dialect         :   'mysql'
                    }),
        koneksi =   {};

koneksi.Seq     = Seq
koneksi.Seq_    = Seq_

module.exports  = koneksi;