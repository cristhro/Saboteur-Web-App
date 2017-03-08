-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 13-02-2017 a las 21:54:43
-- Versión del servidor: 5.7.17-0ubuntu0.16.04.1
-- Versión de PHP: 7.0.8-0ubuntu0.16.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `saboteurDB`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cartas_juegan`
--

CREATE TABLE `cartas_juegan` (
  `id_cartas_juegan` int(11) NOT NULL,
  `id_partida` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_carta` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cartas_partida`
--

CREATE TABLE `cartas_partida` (
  `id_cartas_partidas` int(11) NOT NULL,
  `id_partida` int(20) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_carta` varchar(20) NOT NULL,
  `activa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id_comentarios` int(11) NOT NULL,
  `id_partida` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `comentario` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `juegan`
--

CREATE TABLE `juegan` (
  `id_juegan` int(11) NOT NULL,
  `id_partida` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `rol` varchar(20) NOT NULL,
  `numero_turno` int(11) NOT NULL,
  `bloqueo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidas`
--

CREATE TABLE `partidas` (
  `id_partida` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `estado` varchar(10) NOT NULL,
  `creador` varchar(20) NOT NULL,
  `fecha` date NOT NULL,
  `num_jugadores` int(11) NOT NULL,
  `numMax_jugadores` int(11) NOT NULL,
  `turno` varchar(11) NOT NULL,
  `ganador` varchar(20) NOT NULL,
  `turnos_restantes` int(11) NOT NULL,
  `nombre_jugadores` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tableros_partidas`
--

CREATE TABLE `tableros_partidas` (
  `id_tableros_partidas` int(11) NOT NULL,
  `id_partida` int(11) NOT NULL,
  `fila` int(11) NOT NULL,
  `columna` int(11) NOT NULL,
  `carta` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `usuario` varchar(20) NOT NULL,
  `clave` varchar(20) NOT NULL,
  `nombre_completo` varchar(40) NOT NULL,
  `sexo` varchar(1) NOT NULL,
  `foto` longblob,
  `nacimiento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cartas_juegan`
--
ALTER TABLE `cartas_juegan`
  ADD PRIMARY KEY (`id_cartas_juegan`);

--
-- Indices de la tabla `cartas_partida`
--
ALTER TABLE `cartas_partida`
  ADD PRIMARY KEY (`id_cartas_partidas`);

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id_comentarios`);

--
-- Indices de la tabla `juegan`
--
ALTER TABLE `juegan`
  ADD PRIMARY KEY (`id_juegan`);

--
-- Indices de la tabla `partidas`
--
ALTER TABLE `partidas`
  ADD PRIMARY KEY (`id_partida`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `tableros_partidas`
--
ALTER TABLE `tableros_partidas`
  ADD PRIMARY KEY (`id_tableros_partidas`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cartas_juegan`
--
ALTER TABLE `cartas_juegan`
  MODIFY `id_cartas_juegan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;
--
-- AUTO_INCREMENT de la tabla `cartas_partida`
--
ALTER TABLE `cartas_partida`
  MODIFY `id_cartas_partidas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;
--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id_comentarios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT de la tabla `juegan`
--
ALTER TABLE `juegan`
  MODIFY `id_juegan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT de la tabla `partidas`
--
ALTER TABLE `partidas`
  MODIFY `id_partida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `tableros_partidas`
--
ALTER TABLE `tableros_partidas`
  MODIFY `id_tableros_partidas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=246;
--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
