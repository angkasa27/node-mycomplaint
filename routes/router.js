const   customer    =   require('../controller/customer'),
        petugas     =   require('../controller/petugas'),
        cekSession  =   require('../middleware/jwt');

module.exports  =   app     => {
    app.get('/admin/profile'                            , cekSession.jalankan , petugas.getProfileAdmin)
    app.get('/admin/statistic'                          , cekSession.jalankan , petugas.getStaticAdmin)
    app.get('/admin/pengaduan'                          , cekSession.jalankan , petugas.getPengaduanAdmin) // pangaduan?page=
    app.get('/admin/pengaduan/:pengaduanId'             , cekSession.jalankan , petugas.getDetailPengaduan)
    app.get('/admin/laporan/pengaduan'                  , cekSession.jalankan , petugas.getLaporan)
    app.get('/admin/user'                               , cekSession.jalankan , petugas.getAllUser) // user?page=
    app.get('/admin/operator'                           , cekSession.jalankan , petugas.getAllPetugas) // operator?page=
    app.get('/users/profile'                            , cekSession.jalankan , customer.getProfileUser)
    app.get('/users/statistic'                          , cekSession.jalankan , customer.getUserStatistic)
    app.get('/users/pengaduan'                          , cekSession.jalankan , customer.getPengaduanUsers)// pengaduan?page=
    app.get('/users/pengaduan/:pengaduanId'             , cekSession.jalankan , customer.getDetailPengaduan)
    app.get('/users/laporan/pengaduan'                  , cekSession.jalankan , customer.getLaporan)

    app.post('/admin/login'                             , petugas.postLoginAdmin)
    app.post('/users/login'                             , customer.postLoginUser)
    app.post('/users/register'                          , customer.postDaftarUser)
    app.post('/admin/pengaduan/:pengaduanId/response'   , cekSession.jalankan , petugas.postTambahTanggapan)
    app.post('/users/pengaduan'                         , cekSession.jalankan , customer.postPengaduan)
    
    app.put('/admin/pengaduan/:pengaduanId/status'      , cekSession.jalankan , petugas.putEditStatus)
    app.put('/admin/user/:userId'                       , cekSession.jalankan , petugas.putEditUser)
    app.put('/admin/operator/:operatorId'               , cekSession.jalankan , petugas.putEditPetugas)
    app.put('/users/pengaduan/:pengaduanId/status'      , cekSession.jalankan , customer.putEditStatus)
    app.put('/users/profile'                            , cekSession.jalankan , customer.putEditProfile)
    app.put('/users/password'                           , cekSession.jalankan , customer.putEditPassword)

    app.delete('/admin/pengaduan/:pengaduanId'          , cekSession.jalankan , petugas.deletePengaduan)
    app.delete('/admin/user/:userId'                    , cekSession.jalankan , petugas.deleteUser)
    app.delete('/admin/operator/:operatorId'            , cekSession.jalankan , petugas.deletePetugas)
}