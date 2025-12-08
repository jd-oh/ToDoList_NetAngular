using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToDoListAPI.Models.DTOs;
using ToDoListAPI.Services;

namespace ToDoListAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;
    private readonly ILogger<TodosController> _logger;

    public TodosController(ITodoService todoService, ILogger<TodosController> logger)
    {
        _todoService = todoService;
        _logger = logger;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    /// <summary>
    /// Obtener todas las tareas del usuario
    /// </summary>
    /// <param name="filter">Filtro: all, completed, pending</param>
    /// <returns>Lista de tareas</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TodoItemDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] string? filter = null)
    {
        try
        {
            var userId = GetUserId();
            var items = await _todoService.GetAllAsync(userId, filter);
            return Ok(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener las tareas");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Obtener una tarea por ID
    /// </summary>
    /// <param name="id">ID de la tarea</param>
    /// <returns>Datos de la tarea</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TodoItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var userId = GetUserId();
            var item = await _todoService.GetByIdAsync(id, userId);

            if (item == null)
            {
                return NotFound(new { message = "Tarea no encontrada" });
            }

            return Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener la tarea {Id}", id);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Crear una nueva tarea
    /// </summary>
    /// <param name="dto">Datos de la tarea</param>
    /// <returns>Tarea creada</returns>
    [HttpPost]
    [ProducesResponseType(typeof(TodoItemDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateTodoItemDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var userId = GetUserId();
            var item = await _todoService.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear la tarea");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Actualizar una tarea existente
    /// </summary>
    /// <param name="id">ID de la tarea</param>
    /// <param name="dto">Datos actualizados</param>
    /// <returns>Tarea actualizada</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(TodoItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTodoItemDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var userId = GetUserId();
            var item = await _todoService.UpdateAsync(id, dto, userId);

            if (item == null)
            {
                return NotFound(new { message = "Tarea no encontrada" });
            }

            return Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar la tarea {Id}", id);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Eliminar una tarea
    /// </summary>
    /// <param name="id">ID de la tarea</param>
    /// <returns>Sin contenido</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var userId = GetUserId();
            var result = await _todoService.DeleteAsync(id, userId);

            if (!result)
            {
                return NotFound(new { message = "Tarea no encontrada" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar la tarea {Id}", id);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Alternar el estado de completado de una tarea
    /// </summary>
    /// <param name="id">ID de la tarea</param>
    /// <returns>Tarea actualizada</returns>
    [HttpPatch("{id}/toggle")]
    [ProducesResponseType(typeof(TodoItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleComplete(int id)
    {
        try
        {
            var userId = GetUserId();
            var item = await _todoService.ToggleCompleteAsync(id, userId);

            if (item == null)
            {
                return NotFound(new { message = "Tarea no encontrada" });
            }

            return Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al cambiar estado de la tarea {Id}", id);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Obtener estadísticas del dashboard
    /// </summary>
    /// <returns>Métricas de las tareas</returns>
    [HttpGet("dashboard")]
    [ProducesResponseType(typeof(DashboardDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDashboard()
    {
        try
        {
            var userId = GetUserId();
            var dashboard = await _todoService.GetDashboardAsync(userId);
            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener el dashboard");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
}
