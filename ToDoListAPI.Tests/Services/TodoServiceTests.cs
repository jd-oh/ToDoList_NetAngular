using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using ToDoListAPI.Data;
using ToDoListAPI.Models;
using ToDoListAPI.Models.DTOs;
using ToDoListAPI.Services;
using Xunit;

namespace ToDoListAPI.Tests.Services;

public class TodoServiceTests
{
    private readonly ApplicationDbContext _context;
    private readonly TodoService _todoService;
    private readonly Mock<ILogger<TodoService>> _loggerMock;

    public TodoServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _loggerMock = new Mock<ILogger<TodoService>>();
        _todoService = new TodoService(_context, _loggerMock.Object);

        SeedDatabase();
    }

    private void SeedDatabase()
    {
        var user = new User
        {
            Id = 1,
            Email = "test@example.com",
            Name = "Test User",
            PasswordHash = "hashedpassword"
        };
        _context.Users.Add(user);

        var tasks = new List<TodoItem>
        {
            new() { Id = 1, Title = "Task 1", Description = "Description 1", IsCompleted = false, UserId = 1 },
            new() { Id = 2, Title = "Task 2", Description = "Description 2", IsCompleted = true, UserId = 1 },
            new() { Id = 3, Title = "Task 3", Description = "Description 3", IsCompleted = false, UserId = 1 },
            new() { Id = 4, Title = "Other User Task", Description = "Other", IsCompleted = false, UserId = 2 }
        };
        _context.TodoItems.AddRange(tasks);
        _context.SaveChanges();
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllUserTasks()
    {
        // Act
        var result = await _todoService.GetAllAsync(1);

        // Assert
        Assert.Equal(3, result.Count());
    }

    [Fact]
    public async Task GetAllAsync_WithCompletedFilter_ReturnsOnlyCompletedTasks()
    {
        // Act
        var result = await _todoService.GetAllAsync(1, "completed");

        // Assert
        Assert.Single(result);
        Assert.True(result.First().IsCompleted);
    }

    [Fact]
    public async Task GetAllAsync_WithPendingFilter_ReturnsOnlyPendingTasks()
    {
        // Act
        var result = await _todoService.GetAllAsync(1, "pending");

        // Assert
        Assert.Equal(2, result.Count());
        Assert.All(result, item => Assert.False(item.IsCompleted));
    }

    [Fact]
    public async Task GetByIdAsync_ExistingTask_ReturnsTask()
    {
        // Act
        var result = await _todoService.GetByIdAsync(1, 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Task 1", result.Title);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingTask_ReturnsNull()
    {
        // Act
        var result = await _todoService.GetByIdAsync(999, 1);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetByIdAsync_TaskOfOtherUser_ReturnsNull()
    {
        // Act
        var result = await _todoService.GetByIdAsync(4, 1);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_ValidTask_ReturnsCreatedTask()
    {
        // Arrange
        var dto = new CreateTodoItemDto
        {
            Title = "New Task",
            Description = "New Description"
        };

        // Act
        var result = await _todoService.CreateAsync(dto, 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("New Task", result.Title);
        Assert.Equal("New Description", result.Description);
        Assert.False(result.IsCompleted);
    }

    [Fact]
    public async Task UpdateAsync_ExistingTask_ReturnsUpdatedTask()
    {
        // Arrange
        var dto = new UpdateTodoItemDto
        {
            Title = "Updated Task",
            Description = "Updated Description",
            IsCompleted = true
        };

        // Act
        var result = await _todoService.UpdateAsync(1, dto, 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Updated Task", result.Title);
        Assert.Equal("Updated Description", result.Description);
        Assert.True(result.IsCompleted);
        Assert.NotNull(result.CompletedAt);
    }

    [Fact]
    public async Task UpdateAsync_NonExistingTask_ReturnsNull()
    {
        // Arrange
        var dto = new UpdateTodoItemDto
        {
            Title = "Updated Task",
            Description = "Updated Description",
            IsCompleted = true
        };

        // Act
        var result = await _todoService.UpdateAsync(999, dto, 1);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ExistingTask_ReturnsTrue()
    {
        // Act
        var result = await _todoService.DeleteAsync(1, 1);

        // Assert
        Assert.True(result);
        
        var deletedTask = await _context.TodoItems.FindAsync(1);
        Assert.Null(deletedTask);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingTask_ReturnsFalse()
    {
        // Act
        var result = await _todoService.DeleteAsync(999, 1);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task ToggleCompleteAsync_ExistingTask_TogglesState()
    {
        // Act - Toggle from incomplete to complete
        var result = await _todoService.ToggleCompleteAsync(1, 1);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.IsCompleted);
        Assert.NotNull(result.CompletedAt);
    }

    [Fact]
    public async Task ToggleCompleteAsync_CompletedTask_TogglesBack()
    {
        // Act - Toggle from complete to incomplete
        var result = await _todoService.ToggleCompleteAsync(2, 1);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.IsCompleted);
        Assert.Null(result.CompletedAt);
    }

    [Fact]
    public async Task GetDashboardAsync_ReturnsCorrectMetrics()
    {
        // Act
        var result = await _todoService.GetDashboardAsync(1);

        // Assert
        Assert.Equal(3, result.TotalTasks);
        Assert.Equal(1, result.CompletedTasks);
        Assert.Equal(2, result.PendingTasks);
    }
}
