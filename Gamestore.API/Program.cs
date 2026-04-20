using Gamestore.API.Data;
using Gamestore.API.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();

builder.AddGameStoreDb();

var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>() ?? ["http://localhost:3000", "http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors();

app.MapGamesEndpoints();
app.MapGenresEndpoints();

app.MigrateDb();

var port = Environment.GetEnvironmentVariable("PORT") ?? "5129";
app.Run($"http://0.0.0.0:{port}");
