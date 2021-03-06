CREATE DATABASE sw_edu;
USE sw_edu;

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `SKU` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `price` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

INSERT INTO products (SKU, name, type, price)
values ('DA0013', 'DVD-RW Disc', 'DVD-disc', '2.5'),
 ('DA0014', 'DVD Disc', 'DVD-disc', '2.0'),
 ('DA0015', 'Acme Disc', 'DVD-disc', '2.3'),
 ('DA0016', 'Harry Potter and the Internet History', 'Book', '8.99'),
 ('DA0017', 'Harry Potter and the Fatal Error', 'Book', '8.99'),
 ('DA0018', 'Harry Potter and the Mysterious Bug', 'Book', '8.99'),
 ('DA0019', 'Harry Potter and the JavaScript', 'Book', '8.99'),
 ('DA0020', 'Wood Table', 'Furniture', '299.0'),
 ('DA0067', 'Wood Chair', 'Furniture', '99.0'),
 ('DA0083', 'Couch', 'Furniture', '199.0'),
 ('DA0098', 'Shelf', 'Furniture', '9.0');

CREATE TABLE `attributes` (
  `SKU` VARCHAR(45) NOT NULL,
  `attribute` VARCHAR(45) NULL,
  `value` VARCHAR(60) NULL,
  PRIMARY KEY (`SKU`));

INSERT INTO attributes (SKU, attribute, value)
values ('DA0013', 'Size', '8'),
 ('DA0014', 'Size', '21'),
 ('DA0015', 'Size', '14'),
 ('DA0016', 'Weight', '3'),
 ('DA0017', 'Weight', '3'),
 ('DA0018', 'Weight', '3'),
 ('DA0019', 'Weight', '3'),
 ('DA0020', 'Dimensions', '120x80x210'),
 ('DA0067', 'Dimensions', '120x40x40'),
 ('DA0083', 'Dimensions', '120x100x220'),
 ('DA0098', 'Dimensions', '100x5x20');

CREATE TABLE `product_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

INSERT INTO product_types (type)
values ('Book'),
 ('DVD-Disc'),
 ('Furniture')