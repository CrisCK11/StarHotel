//============STAR HOTEL - VERSION01==================

DROP DATABASE bd_starhotelv1;

CREATE DATABASE bd_starhotelv1;

USE bd_starhotelv1;

insert into tb_rol (descripcion_rol, nombre_rol) values ("Rol de Administrador", "Administrador");
insert into tb_rol (descripcion_rol, nombre_rol) values ("Rol de Usuario", "Usuario");

insert into tb_usuario (nombre, apellido, email, contrasena, telefono, direccion, estado, id_rol) VALUES
('Belen', 'Chavez', 'bchavez@gmail.com', '$2a$10$qti88HX6XjdbrvIotkKOteiHwowvrZVQ42TQt2ziNnpdPmE8SGzY2', '980000678', 'Calle San Genaro 123', 'ACTIVO', 1);

//Constraseña : 123

insert into tb_usuario (nombre, apellido, email, contrasena, telefono, direccion, estado, id_rol) VALUES
('Luis', 'Ramirez', 'luis@gmail.com', '$2a$10$xQgmCW5A8MsAOCbP9IHzYOHsjIf.M8zmZLKWjLWVmkU.u2WjGshuu', '933029382', 'Jesus Maria', 'ACTIVO', 2);

//Constraseña : luis

select * from tb_tipo_habitacion;
DELIMITER //

CREATE PROCEDURE ObtenerHabitacionesDisponibles(
	IN capacidad INTEGER,
    IN fecha_entrada DATE,
    IN fecha_salida DATE
)
BEGIN
    SELECT *
    FROM tb_habitacion h
    WHERE h.estado = 'disponible'
      AND h.capacidad >= capacidad
      AND h.id_habitacion NOT IN (
          SELECT r.id_habitacion 
          FROM tb_reservacion r 
          WHERE (r.fecha_ini < fecha_salida AND r.fecha_fin > fecha_entrada)
      );
END //

DELIMITER ;

CALL ObtenerHabitacionesDisponibles(2, '2024-10-01', '2024-10-10');


//=========================================================

INSERT INTO tb_pago (id_reservacion, metodo_pago, titular_tarjeta, num_tarjeta, monto_pagado, fecha_pago)
VALUES (2, 'TARJETA_CREDITO', 'Juan Pérez', '1234567812345678', 100.50, NOW());

select * from tb_pago;

INSERT INTO tb_reservacion 
    (id_huesped, id_habitacion, fecha_ini, fecha_fin, estado_reservacion, total_pago, id_servicio)
VALUES 
    (1, 2, '2024-10-20', '2024-10-25', 'confirmada', 500.00, 3);

INSERT INTO tb_tipo_habitacion (descripcion) VALUES 
('Habitación Estándar'),
('Habitación Doble'),
('Suite Ejecutiva'),
('Habitación Familiar');

-- Insertar en tb_servicios
INSERT INTO tb_servicios (descripcion, precio) VALUES 
('Wi-Fi', 10.00),
('Desayuno Incluido', 15.00),
('Piscina', 20.00),
('Spa', 30.00),
('Servicio a la Habitación', 25.00);

-- Insertar en tb_huesped
INSERT INTO tb_huesped (nombre, apellido, email, nombreuser, telefono, direccion) VALUES 
('Juan', 'Pérez', 'juan.perez@email.com', 'jperez', '123456789', 'Calle Falsa 123'),
('María', 'González', 'maria.gonzalez@email.com', 'mgonzalez', '987654321', 'Avenida Siempre Viva 742'),
('Carlos', 'López', 'carlos.lopez@email.com', 'clopez', '543216789', 'Calle Nueva 456');

INSERT INTO tb_habitacion (numero_habitacion, id_tipo, precio_por_noche, estado, descripcion, image_habitacion, capacidad) VALUES
('101', 1, 120.00, 'disponible', 'Habitación con cama matrimonial, vista al jardín', 'https://www.hotelprincipecusco.com/wp-content/uploads/Habitacion-Familiar.webp', 1),
('102', 2, 150.00, 'ocupada', 'Habitación doble con balcón', 'https://www.tuoagency.com/uploads/sizes/blog/pequenos-hoteles-encanto-decoracion.jpg', 2),
('103', 3, 200.00, 'disponible', 'Suite junior con jacuzzi', 'https://st2.depositphotos.com/3386033/5559/i/450/depositphotos_55594355-stock-photo-modern-hotel-room-interior.jpg', 2),
('104', 4, 300.00, 'mantenimiento', 'Suite ejecutiva con vista al mar', 'https://elysees-paris-hotel.com/_novaimg/4820825-1465487_0_0_2400_1536_2000_1280.jpg', 1),
('105', 4, 180.00, 'disponible', 'Habitación familiar con dos camas', 'https://www.xotels.com/wp-content/uploads/2022/07/Executive-Room-XOTELS.webp', 4),
('106', 3, 250.00, 'ocupada', 'Habitación deluxe con cama king', 'https://hotelesjoseantonio.com/wp-content/uploads/2021/01/Double-1-PORTADA-HOTEL-420x341.jpg', 2),
('107', 3, 500.00, 'disponible', 'Suite presidencial con sala de estar y terraza', 'https://media-cdn.tripadvisor.com/media/photo-m/1280/13/d1/aa/b9/master-suite.jpg', 1),
('108', 1, 150.00, 'disponible', 'Habitación estándar con vista al jardín', 'https://dmhoteles.pe/wp-content/uploads/2019/06/dm-hoteles-hotel-dm-moquegua-habitacion-estandar-individual-2-1024x478.jpeg', 1),
('109', 2, 200.00, 'ocupada', 'Suite con terraza y vista al mar', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh6j_wRlADGZ7ZE209RfzsSQZLnn4KqseOn1DZRKtz3Q&s', 2),
('110', 1, 120.00, 'disponible', 'Habitación estándar con dos camas individuales', 'https://i.pinimg.com/736x/9f/72/e7/9f72e70220722776dd8def0cbfcbb7f1.jpg', 1),
('111', 3, 250.00, 'mantenimiento', 'Suite con jacuzzi privado y balcón', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-MbTptOGhLzvReuLhPLniVTECIJLMGPr5VkE15GvxHQ&s', 3),
('112', 1, 160.00, 'disponible', 'Habitación estándar con vista a la piscina', 'https://www.lavanguardia.com/files/article_gallery_microformat/uploads/2018/03/21/5fa43a00e9195.jpeg', 2),
('113', 1, 170.00, 'ocupada', 'Habitación estándar con cama king size', 'https://www.shutterstock.com/image-photo/clean-bedding-sheets-pillow-on-600nw-1928427665.jpg', 1),
('114', 3, 210.00, 'disponible', 'Suite con sala de estar y baño privado', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZAhCe6-DRVc7G23e1UzCIBO9Up4TK2Uq8pt7BDiQqlQ&s', 4),
('115', 4, 230.00, 'disponible', 'Suite familiar con dos habitaciones conectadas', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZvxTC_j14uarFmH0fP_g3FAo-hqFGJ1FVSvGZbTqLQ&s', 2);

//=========================================================