using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using ToDoListAPI.Data;
using ToDoListAPI.Models;
using ToDoListAPI.Models.DTOs;
using ToDoListAPI.Services;
using Xunit;

namespace ToDoListAPI.Tests.Services;

public class AuthServiceTests
{
    private readonly ApplicationDbContext _context;
    private readonly AuthService _authService;
    private readonly Mock<ILogger<AuthService>> _loggerMock;
    private readonly Mock<IConfiguration> _configurationMock;

    public AuthServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _loggerMock = new Mock<ILogger<AuthService>>();
        _configurationMock = new Mock<IConfiguration>();

        _configurationMock.Setup(x => x["Jwt:Key"]).Returns("ToDoListAPI_SuperSecretKey_2024_MinLength32Chars!");
        _configurationMock.Setup(x => x["Jwt:Issuer"]).Returns("ToDoListAPI");
        _configurationMock.Setup(x => x["Jwt:Audience"]).Returns("ToDoListClient");

        _authService = new AuthService(_context, _configurationMock.Object, _loggerMock.Object);

        SeedDatabase();
    }

    private void SeedDatabase()
    {
        var user = new User
        {
            Id = 1,
            Email = "existing@example.com",
            Name = "Existing User",
            PasswordHash = BCryptHelper.HashPassword("password123")
        };
        _context.Users.Add(user);
        _context.SaveChanges();
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsAuthResponse()
    {
        // Arrange
        var loginDto = new LoginDto
        {
            Email = "existing@example.com",
            Password = "password123"
        };

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("existing@example.com", result.Email);
        Assert.Equal("Existing User", result.Name);
        Assert.False(string.IsNullOrEmpty(result.Token));
    }

    [Fact]
    public async Task LoginAsync_InvalidEmail_ReturnsNull()
    {
        // Arrange
        var loginDto = new LoginDto
        {
            Email = "nonexistent@example.com",
            Password = "password123"
        };

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task LoginAsync_InvalidPassword_ReturnsNull()
    {
        // Arrange
        var loginDto = new LoginDto
        {
            Email = "existing@example.com",
            Password = "wrongpassword"
        };

        // Act
        var result = await _authService.LoginAsync(loginDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task RegisterAsync_NewUser_ReturnsAuthResponse()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "newuser@example.com",
            Name = "New User",
            Password = "password123"
        };

        // Act
        var result = await _authService.RegisterAsync(registerDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("newuser@example.com", result.Email);
        Assert.Equal("New User", result.Name);
        Assert.False(string.IsNullOrEmpty(result.Token));
    }

    [Fact]
    public async Task RegisterAsync_ExistingEmail_ReturnsNull()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "existing@example.com",
            Name = "Another User",
            Password = "password123"
        };

        // Act
        var result = await _authService.RegisterAsync(registerDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetUserByIdAsync_ExistingUser_ReturnsUser()
    {
        // Act
        var result = await _authService.GetUserByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("existing@example.com", result.Email);
    }

    [Fact]
    public async Task GetUserByIdAsync_NonExistingUser_ReturnsNull()
    {
        // Act
        var result = await _authService.GetUserByIdAsync(999);

        // Assert
        Assert.Null(result);
    }
}
