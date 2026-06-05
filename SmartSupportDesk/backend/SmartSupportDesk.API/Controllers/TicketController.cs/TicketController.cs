using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSupportDesk.API.Data;
using SmartSupportDesk.API.Models;
using SmartSupportDesk.API.Services;
using System.IO;

namespace SmartSupportDesk.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AIService _aiService;
        private readonly EmailService _emailService;

        public TicketController(AppDbContext context, AIService aiService, EmailService emailService)
        {
            _context = context;
            _aiService = aiService;
            _emailService = emailService;
        }

        // ------------------ GET ALL TICKETS ------------------
        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.Comments)
                .ToListAsync();
            return Ok(tickets);
        }

        // ------------------ GET TICKET BY ID ------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketById(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Comments)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
                return NotFound("Ticket not found");

            return Ok(ticket);
        }

        // ------------------ CREATE TICKET ------------------
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromForm] Ticket ticket, IFormFile file)
        {
            if (ticket == null || string.IsNullOrEmpty(ticket.Title) || string.IsNullOrEmpty(ticket.Description))
                return BadRequest("Title and Description are required");

            // Generate backend fields
            ticket.TicketNumber = "TKT-" + DateTime.UtcNow.Ticks;
            ticket.Status = "Pending";
            ticket.CreatedAt = DateTime.UtcNow;

            // ----- FILE UPLOAD -----
            if (file != null)
            {
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                var filePath = Path.Combine(uploadPath, file.FileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                ticket.AttachmentPath = file.FileName;
            }

            // ----- AI ANALYSIS -----
            if (!string.IsNullOrEmpty(ticket.Description))
            {
                var analysis = _aiService.AnalyzeTicket(ticket.Description);
                ticket.Category = analysis.Category;
                ticket.Priority = analysis.Priority;

                ticket.AISuggestion = await _aiService.GenerateResponse(ticket.Description);
                ticket.ResolutionNotes = ticket.AISuggestion;
            }

            // ----- SLA CALCULATION -----
            ticket.DueDate = ticket.Priority switch
            {
                "Critical" => DateTime.UtcNow.AddHours(1),
                "High" => DateTime.UtcNow.AddHours(4),
                "Medium" => DateTime.UtcNow.AddHours(24),
                _ => DateTime.UtcNow.AddHours(48)
            };

            // ----- DUPLICATE DETECTION -----
            var existingTickets = await _context.Tickets.ToListAsync();
            var duplicate = _aiService.FindDuplicateTicket(ticket.Description, existingTickets);
            if (duplicate != null)
                ticket.ResolutionNotes += $"\n\n⚠ Possible duplicate ticket detected: {duplicate.TicketNumber}";

            await _context.Tickets.AddAsync(ticket);
            await _context.SaveChangesAsync();

            // ----- SEND EMAIL -----
            await _emailService.SendEmailAsync(
                "yourgmail@gmail.com",
                "New Support Ticket Created",
                $@"Ticket Number: {ticket.TicketNumber}
Title: {ticket.Title}
Description: {ticket.Description}
Priority: {ticket.Priority}
Category: {ticket.Category}

AI Suggested Solution:
{ticket.AISuggestion}

Created At: {ticket.CreatedAt}

Smart Support Desk System"
            );

            return CreatedAtAction(nameof(GetTicketById), new { id = ticket.Id }, ticket);
        }

        // ------------------ UPDATE TICKET ------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, Ticket updatedTicket)
        {
            if (id != updatedTicket.Id)
                return BadRequest("Ticket ID mismatch");

            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return NotFound("Ticket not found");

            _context.Entry(ticket).CurrentValues.SetValues(updatedTicket);
            await _context.SaveChangesAsync();

            return Ok(ticket);
        }

        // ------------------ UPDATE STATUS ------------------
        [HttpPut("status/{id}")]
        public async Task<IActionResult> UpdateTicketStatus(int id, [FromBody] string status)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return NotFound("Ticket not found");

            ticket.Status = status;
            await _context.SaveChangesAsync();

            return Ok(ticket);
        }

        // ------------------ DELETE TICKET ------------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return NotFound("Ticket not found");

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return Ok("Ticket deleted successfully");
        }

        // ------------------ SEARCH TICKETS ------------------
        [HttpGet("search")]
        public async Task<IActionResult> SearchTickets([FromQuery] string keyword)
        {
            var tickets = await _context.Tickets
                .Where(t => t.Title.Contains(keyword) || t.Description.Contains(keyword))
                .ToListAsync();

            return Ok(tickets);
        }

        // ------------------ ANALYTICS ------------------
        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics()
        {
            var tickets = await _context.Tickets.ToListAsync();

            var totalTickets = tickets.Count;
            var pendingTickets = tickets.Count(t => t.Status == "Pending");
            var resolvedTickets = tickets.Count(t => t.Status == "Resolved");
            var highPriorityTickets = tickets.Count(t => t.Priority == "High");
            var authenticationIssues = tickets.Count(t => t.Category == "Authentication");

            // 🔵 LINE CHART → Tickets per day
            var byDay = tickets
                .GroupBy(t => t.CreatedAt.Date)
                .ToDictionary(
                    g => g.Key.ToString("dd-MM"),
                    g => g.Count()
                );

            // 🟠 BAR CHART → Status vs Priority
            var statusPriority = tickets
                .GroupBy(t => t.Status)
                .ToDictionary(
                    g => g.Key,
                    g => new
                    {
                        High = g.Count(t => t.Priority == "High"),
                        Medium = g.Count(t => t.Priority == "Medium"),
                        Low = g.Count(t => t.Priority == "Low")
                    }
                );

            // 🟣 DOUGHNUT CHART → TEMP DATA (since no AssignedTo)
            var byAssignee = new Dictionary<string, int>
            {
                { "Tickets", totalTickets }
            };

            return Ok(new
            {
                totalTickets,
                pendingTickets,
                resolvedTickets,
                highPriorityTickets,
                authenticationIssues,
                byDay,
                statusPriority,
                byAssignee
            });
        }
    }
}