using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace BookingMovieTickets.Services.Implements
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(Cloudinary cloudinary)
        {
            _cloudinary = cloudinary;
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File upload is empty");
            }

            using (var stream = file.OpenReadStream())
            {
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "user_avatars"
                };
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return uploadResult.SecureUrl.ToString();
                }
                else
                {
                    throw new Exception($"Upload image failed: {uploadResult.Error?.Message}");
                }
            }
        }
    }
} 