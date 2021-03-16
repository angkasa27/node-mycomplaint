// File koneksi_
// Digunakan untuk Query Manual 
const mysql     = require('mysql')
module.exports  = mysql.createConnection({
    host               : 'localhost',
    user               : 'root',
    password           : '',
    database           : 'pengaduan_masyarakat',
    multipleStatements : true           //mengizinkan beberapa query
})