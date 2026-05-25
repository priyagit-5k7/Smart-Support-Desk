namespace SmartSupportDesk.API.DTOs
{
    public class TicketResponseDto
    {
        public int Id { get; set; }
        public string TicketNumber { get; set; } = null!;
        public string TicketType { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string? ResolutionNotes { get; set; }
    }
}
