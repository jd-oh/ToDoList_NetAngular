using ToDoListAPI.Models;
using ToDoListAPI.Models.DTOs;

namespace ToDoListAPI.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
    Task<User?> GetUserByIdAsync(int userId);
}
