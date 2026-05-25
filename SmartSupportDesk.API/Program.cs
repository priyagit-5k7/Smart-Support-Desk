using Microsoft.EntityFrameworkCore;
using SmartSupportDesk.API.Data;
using SmartSupportDesk.API.Services;

var builder = WebApplication.CreateBuilder(args);

// ✅ Add Controllers
builder.Services.AddControllers();

// ✅ CORS (Allow Angular)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// ✅ Register Services
builder.Services.AddScoped<AIService>();
builder.Services.AddScoped<EmailService>();

// ✅ Database Connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ Use CORS
app.UseCors("AllowAll");

// ❌ Disable HTTPS for Angular local
// app.UseHttpsRedirection();

// ✅ Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

// ✅ Existing Controllers
app.MapControllers();


// 🔥🔥🔥 NEW AI SUGGESTION API (ADD THIS BLOCK) 🔥🔥🔥

app.MapPost("/ai-suggestion", (AiRequest request) =>
{
    var text = request.Text?.ToLower() ?? "";

    var response = new AiResponse();

    // 🔹 AUTH / LOGIN ISSUE
    if (text.Contains("login") || text.Contains("password") || text.Contains("token"))
    {
        response = new AiResponse
        {
            Cause = "Authentication failure due to invalid credentials or expired session token",
            Module = "Authentication Module",
            SubModule = "Login API / Token Service",

            LogicIssue = "Token validation failure caused by expired JWT or incorrect token parsing",

            PossibleErrors = new List<string>
            {
                "Invalid username/password",
                "Expired token",
                "Session timeout",
                "Auth API not responding"
            },

            AffectedComponents = new List<string>
            {
                "Login API",
                "JWT Generator",
                "Auth Middleware",
                "User Database"
            },

            Solution = new List<string>
            {
                "Verify user credentials",
                "Reset password",
                "Check token expiry configuration",
                "Restart authentication service",
                "Validate token handling logic"
            },

            DebugSteps = new List<string>
            {
                "Check backend logs",
                "Test login API in Postman",
                "Inspect token in browser storage",
                "Verify user data in DB"
            },

            Priority = "Medium",
            Impact = "Users unable to login",
            EstimatedResolutionTime = "15–30 minutes",
            EscalationLevel = "L2 Support",
            Recommendation = "Implement token refresh and monitor logs"
        };
    }

    // 🔹 NETWORK ISSUE
    else if (text.Contains("network") || text.Contains("timeout") || text.Contains("slow"))
    {
        response = new AiResponse
        {
            Cause = "Network latency or server timeout",
            Module = "Network Layer",
            SubModule = "API Communication",

            LogicIssue = "Request timeout due to slow network or backend delay",

            PossibleErrors = new List<string>
            {
                "High latency",
                "API timeout",
                "Server unreachable"
            },

            AffectedComponents = new List<string>
            {
                "API Gateway",
                "Network Router",
                "Backend Server"
            },

            Solution = new List<string>
            {
                "Check network connectivity",
                "Increase API timeout",
                "Restart network services",
                "Optimize backend performance"
            },

            DebugSteps = new List<string>
            {
                "Ping server",
                "Check API response time",
                "Inspect logs",
                "Test in different network"
            },

            Priority = "High",
            Impact = "System performance degraded",
            EstimatedResolutionTime = "30–60 minutes",
            EscalationLevel = "L2 Support",
            Recommendation = "Monitor latency and add retry mechanism"
        };
    }

    // 🔹 DATABASE ISSUE
    else if (text.Contains("database") || text.Contains("db") || text.Contains("query"))
    {
        response = new AiResponse
        {
            Cause = "Database connection failure or query issue",
            Module = "Database Layer",
            SubModule = "DB Connection / Query Engine",

            LogicIssue = "Query execution failure or connection timeout",

            PossibleErrors = new List<string>
            {
                "Connection refused",
                "Query error",
                "DB down"
            },

            AffectedComponents = new List<string>
            {
                "Database Server",
                "ORM Layer",
                "Backend API"
            },

            Solution = new List<string>
            {
                "Check DB connection string",
                "Restart DB service",
                "Validate queries",
                "Check DB status"
            },

            DebugSteps = new List<string>
            {
                "Run query manually",
                "Check DB logs",
                "Verify credentials"
            },

            Priority = "High",
            Impact = "Data operations blocked",
            EstimatedResolutionTime = "20–40 minutes",
            EscalationLevel = "L2 Support",
            Recommendation = "Monitor DB health"
        };
    }

    // 🔹 DEFAULT CASE
    else
    {
        response = new AiResponse
        {
            Cause = "Unknown issue",
            Module = "General System",
            SubModule = "Unknown",

            LogicIssue = "Needs investigation",

            PossibleErrors = new List<string> { "Unknown error" },
            AffectedComponents = new List<string> { "System" },

            Solution = new List<string>
            {
                "Check logs",
                "Debug step-by-step",
                "Escalate if needed"
            },

            DebugSteps = new List<string>
            {
                "Trace issue flow",
                "Analyze logs"
            },

            Priority = "Low",
            Impact = "Minimal",
            EstimatedResolutionTime = "Unknown",
            EscalationLevel = "L1 Support",
            Recommendation = "Further analysis required"
        };
    }

    return Results.Ok(response);
});


// 🚀 RUN APP
app.Run();


// 🔥 MODELS (ADD AT BOTTOM OR SEPARATE FILES)

public class AiRequest
{
    public string Text { get; set; }
}

public class AiResponse
{
    public string Cause { get; set; }
    public string Module { get; set; }
    public string SubModule { get; set; }
    public string LogicIssue { get; set; }

    public List<string> PossibleErrors { get; set; }
    public List<string> AffectedComponents { get; set; }
    public List<string> Solution { get; set; }
    public List<string> DebugSteps { get; set; }

    public string Priority { get; set; }
    public string Impact { get; set; }
    public string EstimatedResolutionTime { get; set; }
    public string EscalationLevel { get; set; }
    public string Recommendation { get; set; }
}