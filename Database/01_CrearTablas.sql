-- Script para crear la base de datos y tablas del proyecto ToDoList

-- Crear la base de datos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ToDoListDB')
BEGIN
    CREATE DATABASE ToDoListDB;
END
GO

USE ToDoListDB;
GO

-- Crear tabla de Usuarios
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(500) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- Crear tabla de Tareas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TodoItems')
BEGIN
    CREATE TABLE TodoItems (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        Description NVARCHAR(1000) NULL,
        IsCompleted BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NULL,
        UserId INT NOT NULL,
        CONSTRAINT FK_TodoItems_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
    );

END
GO

