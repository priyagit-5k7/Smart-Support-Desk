using Microsoft.AspNetCore.Mvc;
using SmartSupportDesk.API.Data;
using SmartSupportDesk.API.Models;

namespace SmartSupportDesk.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Comment
        [HttpGet]
        public IActionResult GetComments()
        {
            var comments = _context.Comments.ToList();
            return Ok(comments);
        }

        // GET: api/Comment/ticket/5
        [HttpGet("ticket/{ticketId}")]
        public IActionResult GetCommentsByTicket(int ticketId)
        {
            var comments = _context.Comments
                .Where(c => c.TicketId == ticketId)
                .ToList();

            return Ok(comments);
        }

        // POST: api/Comment
        [HttpPost]
        public IActionResult AddComment(Comment comment)
        {
            var ticket = _context.Tickets.Find(comment.TicketId);

            if (ticket == null)
                return NotFound("Ticket not found");

            // ✅ FIX: Use UTC time instead of Local time
            comment.CreatedAt = DateTime.UtcNow;

            _context.Comments.Add(comment);
            _context.SaveChanges();

            return Ok(comment);
        }

        // DELETE: api/Comment/5
        [HttpDelete("{id}")]
        public IActionResult DeleteComment(int id)
        {
            var comment = _context.Comments.Find(id);

            if (comment == null)
                return NotFound("Comment not found");

            _context.Comments.Remove(comment);
            _context.SaveChanges();

            return Ok("Comment deleted successfully");
        }
    }
}