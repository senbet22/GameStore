using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gamestore.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePriceProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "price",
                table: "Games",
                newName: "Price");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Games",
                newName: "price");
        }
    }
}
