using Microsoft.EntityFrameworkCore;
using ToDoListAPI.Data;
using ToDoListAPI.Models;
using ToDoListAPI.Models.DTOs;

namespace ToDoListAPI.Services;

public class TodoService : ITodoService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TodoService> _logger;

    public TodoService(ApplicationDbContext context, ILogger<TodoService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<TodoItemDto>> GetAllAsync(int userId, string? filter = null)
    {
        try
        {
            var query = _context.TodoItems.Where(t => t.UserId == userId);

            query = filter?.ToLower() switch
            {
                "completed" => query.Where(t => t.IsCompleted),
                "pending" => query.Where(t => !t.IsCompleted),
                _ => query
            };

            var items = await query
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} tasks for user {UserId} with filter {Filter}", items.Count, userId, filter ?? "all");

            return items.Select(MapToDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tasks for user {UserId}", userId);
            throw;
        }
    }

    public async Task<TodoItemDto?> GetByIdAsync(int id, int userId)
    {
        try
        {
            var item = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (item == null)
            {
                _logger.LogWarning("Task {TaskId} not found for user {UserId}", id, userId);
                return null;
            }

            return MapToDto(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving task {TaskId} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<TodoItemDto> CreateAsync(CreateTodoItemDto dto, int userId)
    {
        try
        {
            var item = new TodoItem
            {
                Title = dto.Title,
                Description = dto.Description,
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                UserId = userId
            };

            _context.TodoItems.Add(item);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Task {TaskId} created for user {UserId}", item.Id, userId);

            return MapToDto(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating task for user {UserId}", userId);
            throw;
        }
    }

    public async Task<TodoItemDto?> UpdateAsync(int id, UpdateTodoItemDto dto, int userId)
    {
        try
        {
            var item = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (item == null)
            {
                _logger.LogWarning("Task {TaskId} not found for update by user {UserId}", id, userId);
                return null;
            }

            item.Title = dto.Title;
            item.Description = dto.Description;
            
            if (dto.IsCompleted && !item.IsCompleted)
            {
                item.CompletedAt = DateTime.UtcNow;
            }
            else if (!dto.IsCompleted)
            {
                item.CompletedAt = null;
            }
            
            item.IsCompleted = dto.IsCompleted;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Task {TaskId} updated by user {UserId}", id, userId);

            return MapToDto(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task {TaskId} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        try
        {
            var item = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (item == null)
            {
                _logger.LogWarning("Task {TaskId} not found for deletion by user {UserId}", id, userId);
                return false;
            }

            _context.TodoItems.Remove(item);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Task {TaskId} deleted by user {UserId}", id, userId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting task {TaskId} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<TodoItemDto?> ToggleCompleteAsync(int id, int userId)
    {
        try
        {
            var item = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (item == null)
            {
                _logger.LogWarning("Task {TaskId} not found for toggle by user {UserId}", id, userId);
                return null;
            }

            item.IsCompleted = !item.IsCompleted;
            item.CompletedAt = item.IsCompleted ? DateTime.UtcNow : null;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Task {TaskId} toggled to {IsCompleted} by user {UserId}", id, item.IsCompleted, userId);

            return MapToDto(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling task {TaskId} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<DashboardDto> GetDashboardAsync(int userId)
    {
        try
        {
            var tasks = await _context.TodoItems
                .Where(t => t.UserId == userId)
                .ToListAsync();

            var dashboard = new DashboardDto
            {
                TotalTasks = tasks.Count,
                CompletedTasks = tasks.Count(t => t.IsCompleted),
                PendingTasks = tasks.Count(t => !t.IsCompleted)
            };

            _logger.LogInformation("Dashboard retrieved for user {UserId}: Total={Total}, Completed={Completed}, Pending={Pending}",
                userId, dashboard.TotalTasks, dashboard.CompletedTasks, dashboard.PendingTasks);

            return dashboard;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving dashboard for user {UserId}", userId);
            throw;
        }
    }

    private static TodoItemDto MapToDto(TodoItem item) => new()
    {
        Id = item.Id,
        Title = item.Title,
        Description = item.Description,
        IsCompleted = item.IsCompleted,
        CreatedAt = item.CreatedAt,
        CompletedAt = item.CompletedAt
    };
}
