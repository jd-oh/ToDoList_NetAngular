using System.ComponentModel.DataAnnotations;

namespace ToDoListAPI.Models.DTOs;

public class CreateTodoItemDto
{
    [Required(ErrorMessage = "El título es requerido")]
    [MinLength(1, ErrorMessage = "El título no puede estar vacío")]
    [MaxLength(200, ErrorMessage = "El título no puede exceder 200 caracteres")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string? Description { get; set; }
}
