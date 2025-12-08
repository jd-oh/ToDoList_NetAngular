using Microsoft.AspNetCore.Mvc;
using ToDoListAPI.Models.DTOs;
using ToDoListAPI.Services;

namespace ToDoListAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Iniciar sesión con email y contraseña
    /// </summary>
    /// <param name="loginDto">Credenciales de usuario</param>
    /// <returns>Token JWT y datos del usuario</returns>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _authService.LoginAsync(loginDto);

            if (result == null)
            {
                _logger.LogWarning("Login fallido para el email: {Email}", loginDto.Email);
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante el inicio de sesión para el email: {Email}", loginDto.Email);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Registrar un nuevo usuario
    /// </summary>
    /// <param name="registerDto">Datos de registro</param>
    /// <returns>Token JWT y datos del usuario</returns>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _authService.RegisterAsync(registerDto);

            if (result == null)
            {
                _logger.LogWarning("Registro fallido para el email: {Email}", registerDto.Email);
                return BadRequest(new { message = "El email ya está registrado" });
            }

            return CreatedAtAction(nameof(Login), result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante el registro para el email: {Email}", registerDto.Email);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    
}
