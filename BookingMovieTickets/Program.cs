using BookingMovieTickets.Data;
using BookingMovieTickets.Extensions;
using BookingMovieTickets.Models;
using BookingMovieTickets.Services.Jwts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Microsoft.AspNetCore.OData;
using Microsoft.OData.ModelBuilder;
using CloudinaryDotNet;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddApplicationServices();
builder.Services.AddRepositories();

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddControllers().AddOData(opt =>
{
    var odataBuilder = new ODataConventionModelBuilder();
    odataBuilder.EntitySet<Movie>("MoviesOData");
    opt.AddRouteComponents("odata", odataBuilder.GetEdmModel())
        .Select()
        .Filter()
        .OrderBy()
        .Expand()
        .SetMaxTop(100)
        .Count()
        .SkipToken();
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<BookingMovieTicketsContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddIdentity<User, IdentityRole<Guid>>()
    .AddEntityFrameworkStores<BookingMovieTicketsContext>()
    .AddDefaultTokenProviders();

// Configure JWT Authentication

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
    var key = Encoding.UTF8.GetBytes(jwtSettings.Secret);

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddRedisServices(builder.Configuration);

builder.Services.AddSwaggerGen(c =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Name = "JWT Authentication",
        Description = "JWT Authentication for Booking Movie Tickets",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    };

    c.AddSecurityDefinition("Bearer", jwtSecurityScheme);

    var securityRequirement = new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    };

    c.AddSecurityRequirement(securityRequirement);
});

builder.Services.AddSingleton(provider =>
{
    var config = provider.GetRequiredService<IConfiguration>();
    var cloudinaryAccount = new CloudinaryDotNet.Account(
        config["CloudinarySettings:CloudName"],
        config["CloudinarySettings:ApiKey"],
        config["CloudinarySettings:ApiSecret"]
    );
    return new CloudinaryDotNet.Cloudinary(cloudinaryAccount);
});

var app = builder.Build();
app.UseCors("AllowFrontend");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await BookingMovieTickets.Data.SeedData.SeedAsync(services);
}
app.Run();
