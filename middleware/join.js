const koneksi_ = require('../models/koneksi_')
var x ={}

exports.innerJoin2tabel = (tb1 , tb2 , keyKolom1Tabel1 , key_tb2 , cb )=>{
    // Contoh =  SELECT * FROM tabel1 INNER JOIN tabel2 ON tabel1.kolom1Tabel1 = tabel2.key_tb2

    // INNER JOIN digunakan saat akan menampilkan DATA 'YANG ADA' SAJA
    // jadi jika datanya NULL pada tabel yang diJOIN maka tidak akan ditampilkan.

    var query = 'SELECT * FROM ' + tb1 + ' INNER JOIN ' + tb2 + ' ON ' + tb1 + '.'+ keyKolom1Tabel1 + ' = '+tb2 + '.'+ key_tb2 
    koneksi_.query( query ,(err , dataQuery) => {
        return cb(err , dataQuery)
    })
}

exports.leftOuterJoin4tabel = ( Keterangan , offset , cb )=>{
    // Contoh =  SELECT * FROM tabel1 LEFT OUTER JOIN tabel2 ON tabel1.kolom1Tabel1 = tabel2.key_tb2 
    //                                LEFT OUTER JOIN tabel3 ON tabel1.kolom2Tabel1 = tabel3.key_tb3

    // LEFT OUTER JOIN digunakan saat akan menampilkan SEMUA DATA yang sudah didefinisikan
    // jadi semua data akan ditampilkan meskipun itu datanya NULL di tabel lain.
    var query = 'SELECT * FROM tb_pengaduans'
                +' LEFT OUTER JOIN tb_tanggapans    ON tb_pengaduans.id_pengaduan   = tb_tanggapans.id_pengaduans'
                +' LEFT OUTER JOIN tb_masyarakats   ON tb_pengaduans.nik_pengaduan  = tb_masyarakats.nik'
                +' LEFT OUTER JOIN tb_petugas       ON tb_tanggapans.id_petugas_    = tb_petugas.id_petugas '

    if(Keterangan != ''){                              //Jika terdapat Keterangan saat query
        query +=  Keterangan
    }
    console.log(query);
    koneksi_.query( query ,(err , dataQuery) => {
        return cb(dataQuery)
    })
}