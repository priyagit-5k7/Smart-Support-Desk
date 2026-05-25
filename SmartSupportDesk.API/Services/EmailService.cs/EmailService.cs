using MailKit.Net.Smtp;
using MimeKit;

namespace SmartSupportDesk.API.Services
{
    public class EmailService
    {
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var email = new MimeMessage();

            email.From.Add(new MailboxAddress("Smart Support Desk", "krishna.indira5k7@gmail.com"));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            email.Body = new TextPart("plain")
            {
                Text = body
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync("smtp.gmail.com", 587, false);

            await smtp.AuthenticateAsync("krishna.indira5k7@gmail.com", "iltgldkqhtrjmelx");

            await smtp.SendAsync(email);

            await smtp.DisconnectAsync(true);
        }
    }
}