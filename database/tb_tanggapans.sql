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
-- Table structure for table `tb_tanggapans`
--

CREATE TABLE `tb_tanggapans` (
  `id_tanggapan` int(11) NOT NULL,
  `id_pengaduans` int(16) NOT NULL,
  `tgl_tanggapan` varchar(16) NOT NULL,
  `tanggapan` text NOT NULL,
  `id_petugas_` int(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_tanggapans`
--

INSERT INTO `tb_tanggapans` (`id_tanggapan`, `id_pengaduans`, `tgl_tanggapan`, `tanggapan`, `id_petugas_`) VALUES
(7, 13, '123', 'MANTAPPPP TERIMA KASIH MONYET', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_tanggapans`
--
ALTER TABLE `tb_tanggapans`
  ADD PRIMARY KEY (`id_tanggapan`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_tanggapans`
--
ALTER TABLE `tb_tanggapans`
  MODIFY `id_tanggapan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
