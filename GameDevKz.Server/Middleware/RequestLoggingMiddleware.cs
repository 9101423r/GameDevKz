using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace GameDevKz.Server.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestLoggingMiddleware> _logger;

        public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var sw = Stopwatch.StartNew();

            var correlationId = context.Request.Headers.ContainsKey("X-Correlation-ID")
                ? context.Request.Headers["X-Correlation-ID"].ToString()
                : Guid.NewGuid().ToString();

            context.Response.OnStarting(() =>
            {
                if (!context.Response.Headers.ContainsKey("X-Correlation-ID"))
                {
                    context.Response.Headers.Add("X-Correlation-ID", correlationId);
                }
                return Task.CompletedTask;
            });

            _logger.LogInformation("Request start: {Method} {Path} CorrelationId={CorrelationId}",
                context.Request.Method, context.Request.Path + context.Request.QueryString, correlationId);

            try
            {
                await _next(context);
            }
            finally
            {
                sw.Stop();
                _logger.LogInformation("Request finished: {Method} {Path} => {StatusCode} in {ElapsedMs}ms CorrelationId={CorrelationId}",
                    context.Request.Method,
                    context.Request.Path + context.Request.QueryString,
                    context.Response?.StatusCode,
                    sw.ElapsedMilliseconds,
                    correlationId);
            }
        }
    }

    public static class RequestLoggingMiddlewareExtensions
    {
        public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder app)
        {
            return app.UseMiddleware<RequestLoggingMiddleware>();
        }
    }
}
