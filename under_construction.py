from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

class UnderConstructionHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        self.wfile.write(b"<html><head><title>Under Construction</title>")
        self.wfile.write(b"<style>")
        self.wfile.write(b"body {")
        self.wfile.write(b"display: flex;")
        self.wfile.write(b"align-items: center;")
        self.wfile.write(b"justify-content: center;")
        self.wfile.write(b"height: 100vh;")
        self.wfile.write(b"margin: 0;")
        self.wfile.write(b"font-size: 2em;")  
        self.wfile.write(b"}")
        self.wfile.write(b"#actualizing {")
        self.wfile.write(b"animation: blink 3s infinite;")  
        self.wfile.write(b"}")
        self.wfile.write(b"@keyframes blink {")
        self.wfile.write(b"0%, 100% { opacity: 0; }")
        self.wfile.write(b"50% { opacity: 1; }")
        self.wfile.write(b"}")
        self.wfile.write(b"</style>")
        self.wfile.write(b"</head><body>")
        self.wfile.write(b"<div style='text-align: center;'>")
        self.wfile.write(b"<h1>Under Construction</h1>")
        self.wfile.write(b"<p id='actualizing'>actualizing</p>")
        self.wfile.write(b"</div>")
        self.wfile.write(b"</body></html>")

port = 2828

httpd = TCPServer(("localhost", port), UnderConstructionHandler)

print(f"Serving on port {port}")
httpd.serve_forever()
