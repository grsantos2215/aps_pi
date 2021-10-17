CREATE TABLE `tb_usuarios` (
  `id` bigint(20) NOT NULL,
  `fk_usuario_nivel` bigint(20) NOT NULL DEFAULT '1',
  `nome` varchar(150) DEFAULT NULL,
  `usuario` varchar(25) DEFAULT NULL,
  `senha` varchar(40) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dt_insert` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tb_usuarios` (`id`, `fk_usuario_nivel`, `nome`, `usuario`, `senha`, `email`, `dt_insert`, `status`) VALUES
(1, 1, 'Gabriel', 'gabriel', SHA1('gabriel'), 'grsantos2215@gmail.com', now(), '1');


CREATE TABLE `tb_usuario_nivel` (
  `id` bigint(20) NOT NULL,
  `nome` varchar(40) DEFAULT NULL,
  `nivel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `tb_usuario_nivel`
--

INSERT INTO `tb_usuario_nivel` (`id`, `nome`, `nivel`) VALUES
(1, 'Ministro', 1),
(2, 'Diretor', 2),
(3, 'Usuario', 3);

ALTER TABLE `tb_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tb_usuarios_tb_usuario_nivel1_idx` (`fk_usuario_nivel`);
  
  ALTER TABLE `tb_usuario_nivel`
  ADD PRIMARY KEY (`id`);