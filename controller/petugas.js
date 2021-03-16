const skemaMasyarakat = require('../models/tb_masyarakat'),
  skemaPengaduan = require('../models/tb_pengaduan'),
  skemaPetugas = require('../models/tb_petugas'),
  skemaTanggapan = require('../models/tb_tanggapan'),
  queryJoin = require('../middleware/join'),
  md5 = require('md5'),
  jwt = require('jsonwebtoken'),
  fs = require('fs'),
  ejs = require('ejs'),
  path = require('path'),
  pdf = require('html-pdf'),
  angka = /^[0-9]+$/;

//***NOTE
// ADMIN = Username , Password
// USERS = username , password

module.exports.postLoginAdmin = (req, res) => {
  var username = req.body.username,
    password = req.body.password;

  if (
    username != null &&
    password != null &&
    username != '' &&
    password != ''
  ) {
    // <= jika tidak ada input username
    skemaPetugas
      .findOne({ where: { Username: username } })
      .then((hasilQueryPetugas) => {
        // <= Query berdasarkan username
        if (hasilQueryPetugas) {
          // <= jika ada
          if (hasilQueryPetugas.Password == md5(password)) {
            // <= jika password nya sama
            let token = jwt.sign(
              // <= generate Token
              {
                id: hasilQueryPetugas.id_petugas,
                nama: hasilQueryPetugas.nama_petugas, // <= isi Token
                us: hasilQueryPetugas.Username,
                level: hasilQueryPetugas.level,
              },
              'bebasMauDiisiApawkwk', // <= key token
              { expiresIn: '2 days' }
            );
            res.json({
              success: true,
              data: {
                accessToken: token,
                level: hasilQueryPetugas.level,
              },
              message: 'Login success',
              code: 200,
            });
          } else {
            res.json({
              success: false,
              data: {},
              message: 'User Not Founds',
              code: 404,
            });
          }
        } else {
          res.json({
            success: false,
            data: {},
            message: 'User Not Found',
            code: 404,
          });
        }
      });
  }
};

module.exports.getProfileAdmin = (req, res) => {
  var dataToken = req.dataToken; // <= req.dataToken diambil dari jwt
  res.json({
    success: true,
    data: {
      username: dataToken.us,
      name: dataToken.nama,
    },
    message: 'Get Profile success',
    code: 200,
  });
};

module.exports.getStaticAdmin = (req, res) => {
  skemaPengaduan.findAll().then((dataPengaduan) => {
    var proses = 0,
      selesai = 0,
      ditolak = 0,
      terkirim = 0,
      tanggap = 0,
      batal = 0;

    for (let i = 0; i < dataPengaduan.length; i++) {
      // <= kalkulasi
      if (dataPengaduan[i].status == 'onProgress') {
        proses += 1;
      }
      if (dataPengaduan[i].status == 'done') {
        selesai += 1;
      }
      if (dataPengaduan[i].status == 'rejected') {
        ditolak += 1;
      }
      if (dataPengaduan[i].status == 'submitted') {
        terkirim += 1;
      }
      if (dataPengaduan[i].status == 'responded') {
        tanggap += 1;
      }
      if (dataPengaduan[i].status == 'canceled') {
        batal += 1;
      }
    }
    res.json({
      success: true,
      data: {
        submitted: terkirim,
        onProgress: proses,
        responded: tanggap,
        done: selesai,
        rejected: ditolak,
        canceled: batal,
      },
      message: 'Get Statistic success',
      code: 200,
    });
  });
};

module.exports.getPengaduanAdmin = (req, res) => {
  var halaman, halamanSekarang;
  halaman = halamanSekarang = req.query.page; // <= mengambil data dari query pengaduan?page=

  if (angka.test(halaman) == false) {
    return res.json({
      success: false,
      data: {},
      message: 'missing pangaduan?page=',
      code: 404,
    });
  }

  if (halaman > 1) {
    // <= jika ?page=2++ , maka akan menambahkan angka 0 dibelakang nya
    // Dikurangi 9 karena OFFSET dimulai dari data ke bukan Hingga data ke
    // berarti page - 10 (-9 disini, yang -1 di bawah)
    // Contoh page nya 2
    //berarti 2*10 = 20 -> 20-10 = 10 -> berarti mulai dari data ke 10
    halaman = halaman * 10 - 9;
  }

  queryJoin.leftOuterJoin4tabel(
    //nih yang ketinggalan -1
    'ORDER BY id_pengaduan DESC LIMIT 10 OFFSET ' + (halaman - 1),
    '',
    (dataPengaduan) => {
      skemaPengaduan.findAndCountAll().then((dataPengaduans) => {
        var totalHalaman = parseInt(dataPengaduans.count) / 10; // <= Per halaman terdapat 10 data
        var arrayDataPengaduan = [];
        if (totalHalaman > 0 && totalHalaman <= 1) {
          // <= Jika halaman > 0 dan <= 1
          totalHalaman = 1; // <= Maka totalhalaman menjadi 1
        }
        for (let i = 0; i < dataPengaduan.length; i++) {
          let status = false;
          if (
            dataPengaduan[i].status == 'responded' ||
            dataPengaduan[i].status == 'done'
          ) {
            // <= jika status sudah dtanggapi maka akan berubah menjadi true
            status = true;
          }

          arrayDataPengaduan.push({
            // <= menambahkan Array
            pengaduanId: dataPengaduan[i].id_pengaduan,
            subject: dataPengaduan[i].subjek,
            userName: dataPengaduan[i].nama,
            detail: true,
            response: status,
            operatorName: dataPengaduan[i].nama_petugas,
            createAt: dataPengaduan[i].tgl_pengaduan,
            status: dataPengaduan[i].status,
          });
        }
        res.json({
          success: true,
          data: arrayDataPengaduan,
          meta: {
            page: halamanSekarang,
            count: dataPengaduan.length,
            totalPage: Math.ceil(totalHalaman),
            totalData: dataPengaduans.count,
          },
          message: 'Get All Pengaduan success',
          code: 200,
        });
      });
    }
  );
};

module.exports.getDetailPengaduan = (req, res) => {
  var idPengaduan = req.params.pengaduanId;
  if (angka.test(idPengaduan)) {
    //Jika input adalah angka
    queryJoin.leftOuterJoin4tabel(
      'WHERE id_pengaduan = ' + idPengaduan,
      '',
      (dataPengaduan) => {
        if (dataPengaduan.length > 0) {
          dataPengaduan = dataPengaduan[0];
          res.json({
            success: true,
            data: {
              pengaduanId: dataPengaduan.id_pengaduan,
              subject: dataPengaduan.subjek,
              userName: dataPengaduan.nama,
              detail: {
                description: dataPengaduan.isi_laporan,
                image: dataPengaduan.foto,
              },
              response: {
                description: dataPengaduan.tanggapan,
                createAt: dataPengaduan.tgl_tanggapan,
              },
              operatorName: dataPengaduan.nama_petugas,
              createAt: dataPengaduan.tgl_pengaduan,
              status: dataPengaduan.status,
            },
            message: 'Get Detail ${pengaduanName} success',
            code: 200,
          });
        } else {
          res.json({
            success: false,
            data: {},
            message: 'data not found',
            code: 404,
          });
        }
      }
    );
  } else {
    res.json({
      success: false,
      data: {},
      message: 'data not found',
      code: 404,
    });
  }
};

module.exports.putEditStatus = (req, res) => {
  var dataInput = req.body.status,
    idPengaduan = req.params.pengaduanId;

  skemaPengaduan
    .findOne({ where: { id_pengaduan: idPengaduan } })
    .then((dataPengaduan) => {
      //Jika data ditemukan
      if (dataPengaduan) {
        // Jika data yang dikirim sesuai
        if (
          dataInput == 'onProgress' ||
          dataInput == 'responded' ||
          dataInput == 'rejected'
        ) {
          skemaPengaduan.update(
            { status: dataInput },
            { where: { id_pengaduan: idPengaduan } }
          );
          res.json({
            success: true,
            data: {},
            message: 'Update status pengaduan sukses',
            code: 200,
          });
        } else {
          res.json({
            success: false,
            data: {},
            message: 'Data input tidak sesuai',
            code: 404,
          });
        }
      } else {
        res.json({
          success: false,
          data: {},
          message: 'Data tidak ditemukan',
          code: 404,
        });
      }
    });
};

module.exports.postTambahTanggapan = (req, res) => {
  var dataDeskripsi = req.body.description,
    dataWaktu = req.body.createAt,
    idPengaduan = req.params.pengaduanId;

  skemaPengaduan
    .findOne({ where: { id_pengaduan: idPengaduan } })
    .then((dataPengaduan) => {
      //Jika Data pengaduan ditemukan
      if (dataPengaduan) {
        //Jika Status pengaduan belum dijawab / belum selesai
        if (
          dataPengaduan.status != 'responded' &&
          dataPengaduan.status != 'done'
        ) {
          //Set Payload
          let dataTanggapanBaru = {
            id_pengaduans: idPengaduan,
            tgl_tanggapan: dataWaktu,
            tanggapan: dataDeskripsi,
            id_petugas_: req.dataToken.id,
          };
          //Tambah Tanggapan
          skemaTanggapan.create(dataTanggapanBaru);
          //Update Status Pengaduan sesuai ID
          skemaPengaduan.update(
            { status: 'responded' },
            { where: { id_pengaduan: idPengaduan } }
          );
          res.json({
            success: true,
            data: {},
            message: 'Add Response Success',
            code: 200,
          });
        } else {
          res.json({
            success: false,
            data: {},
            message: 'Data Sudah ditanggapi / sudah selesai',
            code: 404,
          });
        }
      } else {
        res.json({
          success: false,
          data: {},
          message: 'Data tidak ditemukan',
          code: 404,
        });
      }
    });
};

module.exports.deletePengaduan = (req, res) => {
  var idPengaduan = req.params.pengaduanId;
  skemaPengaduan
    .destroy({ where: { id_pengaduan: idPengaduan } })
    .then((hapusPengaduan) => {
      //menghapus tanggapan *jika ada
      skemaTanggapan.destroy({ where: { id_pengaduans: idPengaduan } });
      if (hapusPengaduan == 1) {
        res.json({
          success: true,
          data: {},
          message: 'Delete data success',
          code: 200,
        });
      } else {
        res.json({
          success: false,
          data: {},
          message: 'Data tidak ditemukan',
          code: 404,
        });
      }
    });
};

module.exports.getLaporan = (req, res) => {
  //Mencari semua data Tanggapan
  queryJoin.leftOuterJoin4tabel('', '', (dataSemua) => {
    ejs.renderFile(
      path.join(__dirname, '../views/', 'Laporan.ejs'),
      //Variabel laporan menyimpan semua data
      { laporan: dataSemua },
      (err, dataPdf) => {
        //setting layout pdf
        let options = {
          height: '11.25in',
          width: '8.5in',
          header: { height: '20mm' },
          footer: { height: '20mm' },
        };
        //Membuat pdf berdasarkan OUTPUT HTML pada file /views/Laporan.ejs
        pdf
          .create(dataPdf, options)
          .toFile(
            './public/03cd430ca4a29c5f77341bdb2fd20210.pdf',
            function (err, data) {
              //setelah generate pdf , akan menampilkan pdf tersebut pada endpoint ini
              fs.readFile(
                path.join(
                  __dirname,
                  '../public',
                  '03cd430ca4a29c5f77341bdb2fd20210.pdf'
                ),
                function (err, data) {
                  res.contentType('application/pdf');
                  // res.setHeader(
                  //   'Content-disposition',
                  //   'attachment; filename=' + 'Example.pdf'
                  // );
                  res.send(data);
                }
              );
            }
          );
      }
    );
  });
};

module.exports.getAllUser = (req, res) => {
  var halaman, halamanSekarang;
  halaman = halamanSekarang = req.query.page; // <= mengambil data dari query pengaduan?page=

  if (angka.test(halaman) == false) {
    return res.json({
      success: false,
      data: {},
      message: 'missing user?page=',
      code: 404,
    });
  }

  if (halaman > 1) {
    // <= jika ?page=2++ , maka akan menambahkan angka 0 dibelakang nya
    // Dikurangi 9 karena OFFSET dimulai dari data ke bukan Hingga data ke
    // berarti page - 10 (-9 disini, yang -1 di bawah)
    // Contoh page nya 2
    //berarti 2*10 = 20 -> 20-10 = 10 -> berarti mulai dari data ke 10
    halaman = halaman * 10 - 9;
  }

  skemaMasyarakat
    .findAndCountAll({
      attributes: ['nik', 'nama', 'username', 'telp'],
      limit: 10,
      offset: halaman - 1,
    })
    .then((dataMasyarakat) => {
      var totalHalaman = parseInt(dataMasyarakat.count) / 10; // <= Per halaman terdapat 10 data
      if (totalHalaman > 0 && totalHalaman <= 1) {
        // <= Jika halaman > 0 dan <= 1
        totalHalaman = 1; // <= Maka totalhalaman menjadi 1
      }
      res.json({
        success: true,
        data: dataMasyarakat.rows,
        meta: {
          page: halamanSekarang,
          count: dataMasyarakat.rows.length,
          totalPage: Math.ceil(totalHalaman),
          totalData: dataMasyarakat.count,
        },
        message: 'Get All User success',
        code: 200,
      });
    });
};

module.exports.putEditUser = (req, res) => {
  var dataNik = req.params.userId;
  var dataInput = {
    nama: req.body.name,
    username: req.body.username,
    telp: req.body.phone,
  };

  skemaMasyarakat
    .update(dataInput, { where: { nik: dataNik } })
    .then((updateUser) => {
      if (updateUser == 1) {
        res.json({
          success: true,
          data: {},
          message: 'Update user success',
          code: 200,
        });
      } else {
        res.json({
          success: false,
          data: {},
          message: 'Data tidak ditemukan',
          code: 404,
        });
      }
    });
};

module.exports.deleteUser = (req, res) => {
  var dataNik = req.params.userId;
  skemaMasyarakat.destroy({ where: { nik: dataNik } }).then((hapusUser) => {
    if (hapusUser == 1) {
      res.json({
        success: true,
        data: {},
        message: 'Delete user success',
        code: 200,
      });
    } else {
      res.json({
        success: false,
        data: {},
        message: 'Data tidak ditemukan',
        code: 404,
      });
    }
  });
};

module.exports.getAllPetugas = (req, res) => {
  var halaman, halamanSekarang;
  halaman = halamanSekarang = req.query.page; // <= mengambil data dari query pengaduan?page=
  // Jika tidak ada ?page= atau page= tidak angka
  if (angka.test(halaman) == false) {
    return res.json({
      success: false,
      data: {},
      message: 'missing operator?page=',
      code: 404,
    });
  }

  if (halaman > 1) {
    // <= jika ?page=2++ , maka akan menambahkan angka 0 dibelakang nya
    // Dikurangi 9 karena OFFSET dimulai dari data ke bukan Hingga data ke
    // berarti page - 10 (-9 disini, yang -1 di bawah)
    // Contoh page nya 2
    //berarti 2*10 = 20 -> 20-10 = 10 -> berarti mulai dari data ke 10
    halaman = halaman * 10 - 9;
  }

  if (req.dataToken.level == 'admin') {
    //mencari semua petugas dengan limi 10
    skemaPetugas
      .findAndCountAll({
        where: { level: 'petugas' },
        limit: 10,
        offset: halaman - 1,
      })
      .then((dataPetugas) => {
        var totalHalaman = parseInt(dataPetugas.count) / 10; // <= Per halaman terdapat 10 data
        if (totalHalaman > 0 && totalHalaman <= 1) {
          // <= Jika halaman > 0 dan <= 1
          totalHalaman = 1; // <= Maka totalhalaman menjadi 1
        }
        res.json({
          success: true,
          data: dataPetugas.rows,
          meta: {
            page: halamanSekarang,
            count: dataPetugas.rows.length,
            totalPage: Math.ceil(totalHalaman),
            totalData: dataPetugas.count,
          },
          message: 'Get All Petugas success',
          code: 200,
        });
      });
  } else {
    res.json({
      success: false,
      data: {},
      message: 'Bukan Admin',
      code: 404,
    });
  }
};

module.exports.putEditPetugas = (req, res) => {
  var operatorId = req.params.operatorId;
  var dataPetugas = {
    nama_petugas: req.body.name,
    Username: req.body.username,
  };
  if (req.dataToken.level == 'admin') {
    skemaPetugas
      .update(dataPetugas, { where: { id_petugas: operatorId } })
      .then((updatePetugas) => {
        if (updatePetugas == 1) {
          res.json({
            success: true,
            data: {},
            message: 'Update operator success',
            code: 200,
          });
        } else {
          res.json({
            success: false,
            data: {},
            message: 'Data tidak ditemukan',
            code: 404,
          });
        }
      });
  } else {
    res.json({
      success: false,
      data: {},
      message: 'Bukan Admin',
      code: 404,
    });
  }
};

module.exports.deletePetugas = (req, res) => {
  var operatorId = req.params.operatorId;

  if (req.dataToken.level == 'admin') {
    skemaPetugas
      .destroy({ where: { id_petugas: operatorId } })
      .then((hapusPetugas) => {
        if (hapusPetugas == 1) {
          res.json({
            success: true,
            data: {},
            message: 'Delete operator success',
            code: 200,
          });
        } else {
          res.json({
            success: false,
            data: {},
            message: 'Data tidak ditemukan',
            code: 404,
          });
        }
      });
  } else {
    res.json({
      success: false,
      data: {},
      message: 'Bukan Admin',
      code: 404,
    });
  }
};
