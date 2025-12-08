using System.ComponentModel.DataAnnotations;

namespace ToDoListAPI.Models.DTOs;

public class RegisterDto
{
    [Required(ErrorMessage = "El nombre es requerido")]
    [MinLength(2, ErrorMessage = "El nombre debe tener al menos 2 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "El email es requerido")]
    [EmailAddress(ErrorMessage = "El formato del email no es válido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es requerida")]
    [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
    public string Password { get; set; } = string.Empty;
}
