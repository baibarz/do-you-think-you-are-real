import http.server
import socketserver
import os
from datetime import datetime, time

website_directory = "html"

port = 2828

handler = http.server.SimpleHTTPRequestHandler

class MyTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        client_time_str = self.headers.get('Client-Time')  
        if client_time_str:
            client_time = datetime.strptime(client_time_str, '%Y-%m-%d %H:%M:%S').time()
        else:
            client_time = datetime.now().time()

        opening_hours = {
            "monday": (time(8, 0), time(20, 0)),
            "tuesday": (time(8, 0), time(20, 0)),
            "wednesday": (time(8, 0), time(20, 0)),
            "thursday": (time(8, 0), time(20, 0)),
            "friday": (time(8, 0), time(20, 0)),
            "saturday": (time(8, 0), time(18, 0)),
            "sunday": (time(0, 0), time(0, 0)),  
        }

        current_day = datetime.now().strftime("%A").lower()
        if current_day in opening_hours:
            opening_start, opening_end = opening_hours[current_day]

            if opening_start <= client_time <= opening_end:
                self.directory = "day_version"
            else:
                self.directory = "night_version"
        else:
            self.directory = "night_version"

        return super().do_GET()

    def translate_path(self, path):
        return super().translate_path(os.path.join(self.directory, path))

os.chdir(website_directory)

with MyTCPServer(("192.168.1.99", port), MyRequestHandler) as httpd:
    print(f"Serving on port {port}")
    httpd.serve_forever()
