using System;
using Gamestore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Gamestore.API.Data;

public class GameStoreContext(DbContextOptions<GameStoreContext> options) : DbContext(options)
{
  public DbSet<Game> Games => Set<Game>();

  public DbSet<Genre> Genres => Set<Genre>();
}
