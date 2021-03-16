-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 09, 2021 at 02:41 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pengaduan_masyarakat`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_pengaduans`
--

CREATE TABLE `tb_pengaduans` (
  `id_pengaduan` int(16) NOT NULL,
  `tgl_pengaduan` varchar(16) NOT NULL,
  `nik_pengaduan` char(16) NOT NULL,
  `subjek` varchar(25) NOT NULL,
  `isi_laporan` text NOT NULL,
  `foto` varchar(255) NOT NULL,
  `status` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_pengaduans`
--

INSERT INTO `tb_pengaduans` (`id_pengaduan`, `tgl_pengaduan`, `nik_pengaduan`, `subjek`, `isi_laporan`, `foto`, `status`) VALUES
(13, '12 Apil 2003', '1234512345999999', 'Bom Nuklir', 'ini adalah bom NUKLIR', 'aowdkaowdk.com', 'responded'),
(14, '12 Apil 2001', '1234512345999999', 'Bom Atom', 'ini adalah bom ATOM', 'gugel.com', 'canceled'),
(15, '2021-03-17', '125124125122131', 'testing', 'ini testing', '12312', 'submitted'),
(17, '12 09 20201', '1234512345999999', 'WOADKAWOKDOk', 'testing lagi bos', 'http://localhost:8080/images/16150269037953ecd20255173bc20a5c96d923ad6b27f.jpeg', 'submitted');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_pengaduans`
--
ALTER TABLE `tb_pengaduans`
  ADD PRIMARY KEY (`id_pengaduan`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_pengaduans`
--
ALTER TABLE `tb_pengaduans`
  MODIFY `id_pengaduan` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
