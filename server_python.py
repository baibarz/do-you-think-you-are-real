import http.server
import socketserver
import os
from datetime import datetime, time, timedelta

# Set the directory where your website files are located
website_directory = r"C:\Users\mmste\Documents\do-you-think-you-are-real\html"

# in ports we trust
port = 666

# Allow connections from any IP address
handler = http.server.SimpleHTTPRequestHandler

# Create a custom server that listens on all available interfaces
class MyTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

# Custom handler to serve different versions based on time
class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        now = datetime.now().time()

        # Define the opening hours
        opening_hours = {
            "monday": (time(8, 0), time(20, 0)),
            "tuesday": (time(8, 0), time(20, 0)),
            "wednesday": (time(9, 0), time(20, 0)),
            "thursday": (time(8, 0), time(16, 0)),
            "friday": (time(8, 0), time(20, 0)),
            "saturday": (time(8, 0), time(18, 0)),
            "sunday": (time(0, 0), time(0, 0)),  # Closed on Sunday
        }

        # Check if the current day is in the opening hours dictionary
        current_day = datetime.now().strftime("%A").lower()
        if current_day in opening_hours:
            opening_start, opening_end = opening_hours[current_day]

            # Check if the current time is within opening hours
            if opening_start <= now < opening_end:
                # Inside opening hours
                self.directory = "day_version"
            else:
                # Outside opening hours
                self.directory = "night_version"
        else:
            # Day not in opening hours (e.g., Sunday)
            self.directory = "night_version"

        return super().do_GET()

    def translate_path(self, path):
        # Override translate_path to use the specified directory
        return super().translate_path(os.path.join(self.directory, path))

# Change to the directory containing your website files
os.chdir(website_directory)

# Run the server with the custom handler
with MyTCPServer(("", port), MyRequestHandler) as httpd:
    print(f"Serving on port {port}")
    httpd.serve_forever()
