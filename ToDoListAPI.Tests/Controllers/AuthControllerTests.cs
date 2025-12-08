using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using ToDoListAPI.Controllers;
using ToDoListAPI.Models.DTOs;
using ToDoListAPI.Services;
using Xunit;

namespace ToDoListAPI.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly Mock<ILogger<AuthController>> _loggerMock;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _loggerMock = new Mock<ILogger<AuthController>>();
        _controller = new AuthController(_authServiceMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsOkWithAuthResponse()
    {
        // Arrange
        var loginDto = new LoginDto { Email = "test@example.com", Password = "password123" };
        var authResponse = new AuthResponseDto
        {
            Token = "jwt-token",
            Email = "test@example.com",
            Name = "Test User",
            UserId = 1,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };

        _authServiceMock.Setup(x => x.LoginAsync(loginDto)).ReturnsAsync(authResponse);

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<AuthResponseDto>(okResult.Value);
        Assert.Equal("test@example.com", returnValue.Email);
        Assert.Equal("jwt-token", returnValue.Token);
    }

    [Fact]
    public async Task Login_InvalidCredentials_ReturnsUnauthorized()
    {
        // Arrange
        var loginDto = new LoginDto { Email = "test@example.com", Password = "wrongpassword" };
        _authServiceMock.Setup(x => x.LoginAsync(loginDto)).ReturnsAsync((AuthResponseDto?)null);

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.NotNull(unauthorizedResult.Value);
    }

    [Fact]
    public async Task Register_NewUser_ReturnsCreatedWithAuthResponse()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "newuser@example.com",
            Name = "New User",
            Password = "password123"
        };
        var authResponse = new AuthResponseDto
        {
            Token = "jwt-token",
            Email = "newuser@example.com",
            Name = "New User",
            UserId = 1,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };

        _authServiceMock.Setup(x => x.RegisterAsync(registerDto)).ReturnsAsync(authResponse);

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        var returnValue = Assert.IsType<AuthResponseDto>(createdResult.Value);
        Assert.Equal("newuser@example.com", returnValue.Email);
    }

    [Fact]
    public async Task Register_ExistingEmail_ReturnsBadRequest()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "existing@example.com",
            Name = "User",
            Password = "password123"
        };

        _authServiceMock.Setup(x => x.RegisterAsync(registerDto)).ReturnsAsync((AuthResponseDto?)null);

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }
}
