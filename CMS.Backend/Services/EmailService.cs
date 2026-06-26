using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace CMS.Backend.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string htmlMessage);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var senderEmail = _config["EmailSettings:SenderEmail"];
            var senderName = _config["EmailSettings:SenderName"] ?? "HuyCMS System";
            var appPassword = _config["EmailSettings:AppPassword"];

            if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(appPassword))
            {
                System.Console.WriteLine("Lỗi: Chưa cấu hình EmailSettings trong appsettings.json");
                return;
            }

            var mail = new MailMessage();
            mail.To.Add(email);
            mail.From = new MailAddress(senderEmail, senderName);
            mail.Subject = subject;
            mail.Body = htmlMessage;
            mail.IsBodyHtml = true;

            using (var smtp = new SmtpClient("smtp.gmail.com", 587))
            {
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential(senderEmail, appPassword);
                smtp.EnableSsl = true;

                try 
                {
                    await smtp.SendMailAsync(mail);
                }
                catch (System.Exception ex)
                {
                    System.Console.WriteLine($"Error sending email: {ex.Message}");
                }
            }
        }
    }
}
