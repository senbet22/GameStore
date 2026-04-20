using Gamestore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Gamestore.API.Data;

public static class DataExtentions
{
  public static void MigrateDb(this WebApplication app)
  {
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<GameStoreContext>();
    dbContext.Database.Migrate();
  }

  public static void AddGameStoreDb(this WebApplicationBuilder builder)
  {
    var connString = builder.Configuration.GetConnectionString("GameStore");
      
    builder.Services.AddSqlite<GameStoreContext>(
      connString,
      optionsAction: options => options.UseSeeding((context, _) =>
      {
        if (!context.Set<Genre>().Any())
        {
          context.Set<Genre>().AddRange(
            new Genre {Name = "Exploration"},
            new Genre {Name = "Action RPG"},
            new Genre {Name = "Roguelike Action"},
            new Genre {Name = "Puzzle Platformer"},
            new Genre {Name = "Action Adventure"}
          );

          context.SaveChanges();
        }
      })
    );

  }

}
