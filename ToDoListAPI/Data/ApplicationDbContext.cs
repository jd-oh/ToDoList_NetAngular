using Microsoft.EntityFrameworkCore;
using ToDoListAPI.Models;

namespace ToDoListAPI.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<TodoItem> TodoItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
        });

        modelBuilder.Entity<TodoItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed a default user for testing (password: "password123")
        modelBuilder.Entity<User>().HasData(new User
        {
            Id = 1,
            Email = "test@example.com",
            Name = "Usuario de Prueba",
            PasswordHash = BCryptHelper.HashPassword("password123"),
            CreatedAt = DateTime.UtcNow
        });

        // Seed some sample tasks
        modelBuilder.Entity<TodoItem>().HasData(
            new TodoItem { Id = 1, Title = "Completar el proyecto", Description = "Finalizar todas las funcionalidades del proyecto To-Do List", IsCompleted = false, UserId = 1, CreatedAt = DateTime.UtcNow },
            new TodoItem { Id = 2, Title = "Escribir documentación", Description = "Documentar el código y crear el README", IsCompleted = false, UserId = 1, CreatedAt = DateTime.UtcNow },
            new TodoItem { Id = 3, Title = "Configurar el entorno", Description = "Instalar todas las dependencias necesarias", IsCompleted = true, UserId = 1, CreatedAt = DateTime.UtcNow, CompletedAt = DateTime.UtcNow }
        );
    }
}

// Simple BCrypt helper for password hashing
public static class BCryptHelper
{
    public static string HashPassword(string password)
    {
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password + "ToDoListSalt2024"));
        return Convert.ToBase64String(hashedBytes);
    }

    public static bool VerifyPassword(string password, string hash)
    {
        return HashPassword(password) == hash;
    }
}
