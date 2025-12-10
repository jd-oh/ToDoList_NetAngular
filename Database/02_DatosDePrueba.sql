-- Script para insertar datos de prueba

USE ToDoListDB;
GO

-- Insertar usuario de prueba
-- Contraseña: hola123 (hash generado con BCrypt)
IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'juandavidoh4@gmail.com')
BEGIN
    INSERT INTO Users (Name, Email, PasswordHash, CreatedAt)
    VALUES (
        'Juan David',
        'juandavidoh4@gmail.com',
        '$2a$11$rBNrXJQK8xvTxJQK8xvTxuOAEQvYJQK8xvTxJQK8xvTxJQK8xvTxu',
        GETDATE()
    );
END
GO
-- Obtener el ID del usuario de prueba
DECLARE @UserId INT;
SELECT @UserId = Id FROM Users WHERE Email = 'juandavidoh4@gmail.com';

-- Insertar tareas de prueba
IF @UserId IS NOT NULL AND NOT EXISTS (SELECT * FROM TodoItems WHERE UserId = @UserId)
BEGIN
    INSERT INTO TodoItems (Title, Description, IsCompleted, CreatedAt, UserId)
    VALUES 
        ('Completar proyecto Angular', 'Terminar el frontend con Angular 21 y NgRx', 1, DATEADD(DAY, -5, GETUTCDATE()), @UserId),
        ('Configurar autenticación JWT', 'Implementar login y registro con tokens JWT', 1, DATEADD(DAY, -4, GETUTCDATE()), @UserId),
        ('Escribir tests unitarios', 'Cubrir servicios y componentes principales', 0, DATEADD(DAY, -3, GETUTCDATE()), @UserId),
        ('Documentar API en Swagger', 'Agregar comentarios XML y ejemplos', 0, DATEADD(DAY, -2, GETUTCDATE()), @UserId),
        ('Revisar código antes de entregar', 'Hacer code review y limpiar código', 0, DATEADD(DAY, -1, GETUTCDATE()), @UserId);
    
END

