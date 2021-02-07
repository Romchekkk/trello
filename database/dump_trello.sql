-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Фев 07 2021 г., 23:34
-- Версия сервера: 8.0.19
-- Версия PHP: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `trello`
--

-- --------------------------------------------------------

--
-- Структура таблицы `desks`
--

CREATE TABLE `desks` (
  `id` bigint UNSIGNED NOT NULL COMMENT 'Уникальный идентификатор',
  `desk_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'Название доски',
  `creator_id` bigint UNSIGNED NOT NULL COMMENT 'Уникальный идентификатора пользователя, создавшего доску',
  `access_rights` int NOT NULL DEFAULT '0' COMMENT 'Режим доступа к доске'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `desks`
--

INSERT INTO `desks` (`id`, `desk_name`, `creator_id`, `access_rights`) VALUES
(1, 'test', 1, 0),
(4, 'test1', 1, 0),
(5, 'test2', 1, 0),
(6, 'test3', 1, 0),
(7, 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq', 1, 0),
(8, 'test5', 1, 0),
(9, 'test6', 1, 0),
(10, 'test7', 1, 0),
(11, 'test8', 1, 0),
(12, 'test9', 1, 0),
(13, 'test10', 1, 0),
(14, 'test11', 1, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint UNSIGNED NOT NULL COMMENT 'Уникальный идентификатор',
  `task` text NOT NULL COMMENT 'Текст задания',
  `importance` varchar(65) NOT NULL COMMENT 'Важность задания',
  `category` varchar(65) NOT NULL COMMENT 'Категория задания',
  `complete_date` date NOT NULL COMMENT 'Дата, когда задание должно быть выполнено',
  `complete_time` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'null' COMMENT 'Время, к которому задание должно быть выполнено',
  `adder_id` bigint UNSIGNED NOT NULL COMMENT 'Уникальный идентификатор пользователя, добавившего задание',
  `desk_id` bigint UNSIGNED NOT NULL COMMENT 'Уникальный идентификатор доски, которой принадлежит задание',
  `is_complete` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Выполнено ли задание',
  `day_order` int NOT NULL COMMENT 'Порядок, занимаемый заданием среди всех в день'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `tasks`
--

INSERT INTO `tasks` (`id`, `task`, `importance`, `category`, `complete_date`, `complete_time`, `adder_id`, `desk_id`, `is_complete`, `day_order`) VALUES
(38, 's', 'Срочно', 'Дом', '2021-02-10', 'null', 1, 1, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL COMMENT 'Уникальный идентификатор',
  `nickname` varchar(65) NOT NULL COMMENT 'Имя пользователя',
  `login` varchar(65) NOT NULL COMMENT 'Логин пользователя',
  `password` varchar(256) NOT NULL COMMENT 'Пароль пользователя'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `nickname`, `login`, `password`) VALUES
(1, 'test', 'test', 'test');

-- --------------------------------------------------------

--
-- Структура таблицы `user_desks_memory`
--

CREATE TABLE `user_desks_memory` (
  `user_id` bigint UNSIGNED NOT NULL,
  `desk_id` bigint UNSIGNED NOT NULL,
  `last_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` varchar(65) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `user_desks_memory`
--

INSERT INTO `user_desks_memory` (`user_id`, `desk_id`, `last_date`, `type`) VALUES
(1, 4, '2021-02-06 18:40:57', 'own'),
(1, 5, '2021-02-06 18:41:00', 'own'),
(1, 6, '2021-02-06 18:41:07', 'own'),
(1, 7, '2021-02-06 18:41:10', 'own'),
(1, 8, '2021-02-06 18:41:15', 'own'),
(1, 9, '2021-02-06 18:41:18', 'own'),
(1, 11, '2021-02-06 18:41:27', 'own'),
(1, 7, '2021-02-06 20:37:40', 'history'),
(1, 11, '2021-02-07 20:25:12', 'history'),
(1, 9, '2021-02-06 20:36:42', 'history'),
(1, 8, '2021-02-06 20:37:02', 'history'),
(1, 4, '2021-02-07 20:25:36', 'history'),
(1, 1, '2021-02-07 20:25:16', 'history');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `desks`
--
ALTER TABLE `desks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `creator_id` (`creator_id`);

--
-- Индексы таблицы `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `tasks_ibfk_1` (`desk_id`),
  ADD KEY `tasks_ibfk_2` (`adder_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`) USING BTREE;

--
-- Индексы таблицы `user_desks_memory`
--
ALTER TABLE `user_desks_memory`
  ADD KEY `user_desks_memory_ibfk_1` (`desk_id`),
  ADD KEY `user_desks_memory_ibfk_2` (`user_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `desks`
--
ALTER TABLE `desks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Уникальный идентификатор', AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT для таблицы `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Уникальный идентификатор', AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Уникальный идентификатор', AUTO_INCREMENT=4;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `desks`
--
ALTER TABLE `desks`
  ADD CONSTRAINT `desks_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`desk_id`) REFERENCES `desks` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`adder_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `user_desks_memory`
--
ALTER TABLE `user_desks_memory`
  ADD CONSTRAINT `user_desks_memory_ibfk_1` FOREIGN KEY (`desk_id`) REFERENCES `desks` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_desks_memory_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
