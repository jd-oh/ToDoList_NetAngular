using ToDoListAPI.Models.DTOs;

namespace ToDoListAPI.Services;

public interface ITodoService
{
    Task<IEnumerable<TodoItemDto>> GetAllAsync(int userId, string? filter = null);
    Task<TodoItemDto?> GetByIdAsync(int id, int userId);
    Task<TodoItemDto> CreateAsync(CreateTodoItemDto dto, int userId);
    Task<TodoItemDto?> UpdateAsync(int id, UpdateTodoItemDto dto, int userId);
    Task<bool> DeleteAsync(int id, int userId);
    Task<TodoItemDto?> ToggleCompleteAsync(int id, int userId);
    Task<DashboardDto> GetDashboardAsync(int userId);
}
