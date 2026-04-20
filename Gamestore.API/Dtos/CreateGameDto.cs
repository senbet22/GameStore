using System.ComponentModel.DataAnnotations;

namespace Gamestore.API.Dtos;

public record  CreateGameDto(
  [Required][StringLength(50)] string Name,
  [Range(1, 50)] int GenreId,
  [Range(1, 100)] decimal Price,
  DateOnly ReleaseDate,
  [Required][StringLength(30)] string Studio
);