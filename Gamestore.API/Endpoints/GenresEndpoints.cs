using System;
using Gamestore.API.Data;
using Gamestore.API.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Gamestore.API.Endpoints;

public static class GenresEndpoints
{
  public static void MapGenresEndpoints(this WebApplication app)
  {
    var group = app.MapGroup("/genres");

    // Get /genres
    group.MapGet("/", async (GameStoreContext dbContext) => 
      await dbContext.Genres
                      .Select(genre => new GenreDto(genre.Id, genre.Name))
                      .AsNoTracking()
                      .ToListAsync()
      );
  }
}
