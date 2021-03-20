const skemaMasyarakat = require('../models/tb_masyarakat'),
  skemaPengaduan = require('../models/tb_pengaduan'),
  queryJoin = require('../middleware/join'),
  jwt = require('jsonwebtoken'),
  ejs = require('ejs'),
  md5 = require('md5'),
  path = require('path'),
  pdf = require('html-pdf'),
  fs = require('fs'),
  { Op } = require('sequelize'),
  angka = /^[0-9]+$/;

module.exports.postLoginUser = (req, res) => {
  var username = req.body.username,
    password = req.body.password;

  if (
    username != null &&
    password != null &&
    username != '' &&
    password != ''
  ) {
    skemaMasyarakat
      .findOne({ where: { username: username } })
      .then((dataLogin) => {
        if (dataLogin) {
          if (md5(password) == dataLogin.password) {
            let token = jwt.sign(
              // <= generate Token
              {
                id: dataLogin.nik,
                nama: dataLogin.nama, // <= isi Token
                us: dataLogin.username,
              },
              'bebasMauDiisiApawkwk', // <= key token
              { expiresIn: '2 days' }
            );
            res.json({
              success: true,
              data: { accessToken: token },
              message: 'Login success',
              code: 200,
            });
          } else {
            res.json({
              success: false,
              data: {},
              message: 'User Not Found',
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

module.exports.getProfileUser = (req, res) => {
  if (!req.dataToken.id) {
    return res.json({
      success: false,
      data: {},
      message: 'User Not Found',
      code: 404,
    });
  }
  skemaMasyarakat
    .findOne({ where: { nik: req.dataToken.id } })
    .then((dataUser) => {
      res.json({
        success: true,
        data: dataUser,
        message: 'Get Profile success',
        code: 200,
      });
    });
};

module.exports.postDaftarUser = (req, res) => {
  var dataDaftar = {
    nik: req.body.nik,
    nama: req.body.name,
    username: req.body.username,
    password: md5(req.body.password),
    telp: req.body.phone,
    createAt_masyarakat: req.body.createAt,
  };
  if (angka.test(dataDaftar.nik) == false) {
    return res.json({
      success: false,
      data: {},
      message: 'NIK harus angka',
      code: 404,
    });
  }

  skemaMasyarakat
    .findOne({
      where: {
        //JIKA nik ATAU username sudah ada
        [Op.or]: [{ nik: dataDaftar.nik }, { username: dataDaftar.username }],
      },
    })
    .then((dataUser) => {
      if (dataUser) {
        res.json({
          success: false,
          data: {},
          message: 'User sudah terdaftar',
          code: 404,
        });
      } else {
        skemaMasyarakat.create(dataDaftar);
        res.json({
          success: true,
          data: {},
          message: 'Register success',
          code: 200,
        });
      }
    });
};

module.exports.getUserStatistic = (req, res) => {
  skemaPengaduan
    .findAll({ where: { nik_pengaduan: req.dataToken.id } })
    .then((dataPengaduan) => {
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

module.exports.getPengaduanUsers = (req, res) => {
  var halaman, halamanSekarang;
  var NIKuser = req.dataToken.id;
  halaman = halamanSekarang = req.query.page;
  if (angka.test(halaman) == false) {
    return res.json({
      success: false,
      data: {},
      message: 'missing pengaduan?page=',
      code: 404,
    });
  }

  if (halaman > 1) {
    halaman = halaman * 10 - 9;
  }

  queryJoin.leftOuterJoin4tabel(
    ' WHERE nik_pengaduan = ' +
      NIKuser +
      ' ORDER BY id_pengaduan DESC LIMIT 10 OFFSET ' +
      (halaman - 1),
    '',
    (dataPengaduan) => {
      skemaPengaduan
        .findAndCountAll({ where: { nik_pengaduan: NIKuser } })
        .then((dataPengaduans) => {
          var totalHalaman = parseInt(dataPengaduan.length) / 10; // <= Per halaman terdapat 10 data
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
              userName: dataPengaduan[i].username,
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
      'WHERE id_pengaduan = ' +
        idPengaduan +
        ' AND nik_pengaduan = ' +
        req.dataToken.id,
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
                createAt: dataPengaduan.tgl_pengaduan,
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

module.exports.postPengaduan = (req, res) => {
  if (req.files) {
    console.log(req);
    var dataGambar = req.files.image,
      formatGambar = dataGambar.mimetype.split('image/')[1],
      namaFile = new Date().getTime() + dataGambar.md5 + '.' + formatGambar;
    if (
      formatGambar != 'jpeg' &&
      formatGambar != 'jpg' &&
      formatGambar != 'png'
    ) {
      return res.json({
        success: false,
        data: {},
        message: 'Format gambar tidak direstui :v',
        code: 404,
      });
    }
    //Simpan gambar ke /public/images
    fs.writeFile('./public/images/' + namaFile, dataGambar.data, (err) => {
      if (err) {
        console.log(err);
      }
    });

    var dataPengaduan = {
      nik_pengaduan: req.dataToken.id,
      subjek: req.body.subject,
      isi_laporan: req.body.description,
      foto: 'http://localhost:8080/images/' + namaFile,
      tgl_pengaduan: req.body.createAt,
      status: 'submitted',
    };
    //Simpan database
    skemaPengaduan.create(dataPengaduan);
    res.json({
      success: true,
      data: {},
      message: 'Sukses',
      code: 200,
    });
  } else {
    res.json({
      success: false,
      data: {},
      message: 'Gambar dibutuhkan',
      code: 404,
    });
  }
};

module.exports.putEditProfile = (req, res) => {
  var dataInput = {
    nama: req.body.name,
    username: req.body.username,
    telp: req.body.phone,
  };

  skemaMasyarakat
    .findOne({ where: { username: dataInput.username } })
    .then((cekData) => {
      if (cekData.nik !== req.dataToken.id) {
        return res.json({
          success: false,
          data: {},
          message: 'Username sudah dipakai',
          code: 404,
        });
      }
      skemaMasyarakat.update(dataInput, { where: { nik: req.dataToken.id } });
      res.json({
        success: true,
        data: {},
        message: 'Update profile success',
        code: 200,
      });
    });
};

module.exports.putEditPassword = (req, res) => {
  var passwordBaru = md5(req.body.password);
  skemaMasyarakat
    .findOne({ where: { nik: req.dataToken.id } })
    .then((dataUser) => {
      if (dataUser.password == passwordBaru) {
        res.json({
          success: false,
          data: {},
          message: 'Password baru dengan yang lama tidak boleh sama',
          code: 404,
        });
      } else {
        skemaMasyarakat.update(
          { password: passwordBaru },
          { where: { nik: req.dataToken.id } }
        );
        res.json({
          success: true,
          data: {},
          message: 'Update Password sukses',
          code: 200,
        });
      }
    });
};

module.exports.putEditStatus = (req, res) => {
  var dataInput = req.body.status,
    idPengaduan = req.params.pengaduanId;

  skemaPengaduan
    .findOne({
      where: {
        nik_pengaduan: req.dataToken.id,
        id_pengaduan: idPengaduan,
      },
    })
    .then((dataPengaduan) => {
      //Jika data ditemukan
      if (dataPengaduan) {
        // Jika data yang dikirim sesuai
        if (dataInput == 'canceled' || dataInput == 'done') {
          skemaPengaduan.update(
            { status: dataInput },
            {
              where: {
                id_pengaduan: req.params.pengaduanId,
              },
            }
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

module.exports.getLaporan = (req, res) => {
  queryJoin.leftOuterJoin4tabel(
    ' WHERE nik_pengaduan = ' + req.dataToken.id,
    '',
    (dataSemua) => {
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
              './public/5090c3c8bb81ab2d70d2470ed41aef02.pdf',
              function (err, data) {
                //setelah generate pdf , akan menampilkan pdf tersebut pada endpoint ini
                fs.readFile(
                  path.join(
                    __dirname,
                    '../public',
                    '5090c3c8bb81ab2d70d2470ed41aef02.pdf'
                  ),
                  function (err, data) {
                    res.contentType('application/pdf');
                    res.send(data);
                  }
                );
              }
            );
        }
      );
    }
  );
};
