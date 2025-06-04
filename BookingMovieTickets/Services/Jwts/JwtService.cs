using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookingMovieTickets.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace BookingMovieTickets.Services.Jwts
{
    public interface IJwtService
    {
        string GenerateAccessToken(IEnumerable<Claim> claims);
        string GenerateRefreshToken();
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    }

    public class JwtService : IJwtService
    {
        private readonly JwtSettings _jwtSettings;

        public JwtService(IOptions<JwtSettings> jwtSettings)
        {
            _jwtSettings = jwtSettings.Value;
        }

        public string GenerateAccessToken(IEnumerable<Claim> claims)
        {
            throw new NotImplementedException();
        }

        public string GenerateRefreshToken()
        {
            throw new NotImplementedException();
        }

        

        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            throw new NotImplementedException();
        }

        
    }
}