using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartSupportDesk.API.Models;

namespace SmartSupportDesk.API.Services
{
    public class AIService
    {
        // 🤖 AI Solution Suggestion  
        public Task<string> GenerateResponse(string description)
        {
            description = description.ToLower();

            if (description.Contains("login"))
            {
                return Task.FromResult(
                    "Possible Solution:\n" +
                    "1. Verify the username and password.\n" +
                    "2. Ensure the account is not locked.\n" +
                    "3. Clear browser cache and cookies.\n" +
                    "4. Try resetting the password again.\n" +
                    "5. Check if the authentication server is running."
                );
            }

            if (description.Contains("network") || description.Contains("connection"))
            {
                return Task.FromResult(
                    "Possible Solution:\n" +
                    "1. Check network cable connection.\n" +
                    "2. Restart router or modem.\n" +
                    "3. Verify IP configuration.\n" +
                    "4. Ping the gateway to check connectivity."
                );
            }

            if (description.Contains("email"))
            {
                return Task.FromResult(
                    "Possible Solution:\n" +
                    "1. Check email server connectivity.\n" +
                    "2. Verify account credentials.\n" +
                    "3. Ensure mailbox storage is not full.\n" +
                    "4. Reconfigure the email client settings."
                );
            }

            if (description.Contains("server down") || description.Contains("system down"))
            {
                return Task.FromResult(
                    "Possible Solution:\n" +
                    "1. Check if the server service is running.\n" +
                    "2. Restart the server application.\n" +
                    "3. Verify server resource usage.\n" +
                    "4. Check server logs for errors."
                );
            }

            return Task.FromResult(
                "General Troubleshooting Steps:\n" +
                "1. Restart the application.\n" +
                "2. Verify system configuration.\n" +
                "3. Check system logs for errors.\n" +
                "4. Contact system administrator if issue persists."
            );
        }


        // 🤖 AI Ticket Analysis (Category + Priority)
        public (string Category, string Priority) AnalyzeTicket(string description)
        {
            description = description.ToLower();

            if (description.Contains("login") || description.Contains("password"))
            {
                return ("Authentication", "High");
            }

            if (description.Contains("network") || description.Contains("connection"))
            {
                return ("Network", "High");
            }

            if (description.Contains("email"))
            {
                return ("Email", "Medium");
            }

            if (description.Contains("server down") || description.Contains("system down"))
            {
                return ("System", "Critical");
            }

            if (description.Contains("payment") || description.Contains("billing"))
            {
                return ("Billing", "High");
            }

            return ("General", "Low");
        }


        // 🤖 Duplicate Ticket Detection
        public Ticket? FindDuplicateTicket(string description, List<Ticket> tickets)
        {
            description = description.ToLower();

            foreach (var ticket in tickets)
            {
                if (!string.IsNullOrEmpty(ticket.Description) &&
                    ticket.Description.ToLower().Contains(description))
                {
                    return ticket;
                }
            }

            return null;
        }
    }
}