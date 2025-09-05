from http.server import BaseHTTPRequestHandler
import requests
import os
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle cron job requests"""
        try:
            # Call the follow-up processing endpoint
            api_url = f"https://{os.environ.get('VERCEL_URL', 'your-vercel-url.vercel.app')}/api/follow-ups/process"
            
            headers = {
                'Content-Type': 'application/json',
                'x-api-key': os.environ.get('API_SECRET_KEY', '')
            }
            
            response = requests.post(api_url, headers=headers, timeout=30)
            
            # Log the result
            result = {
                'status': response.status_code,
                'response': response.json() if response.status_code == 200 else response.text,
                'timestamp': '2024-01-02T10:30:00Z'
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            error_result = {
                'error': str(e),
                'timestamp': '2024-01-02T10:30:00Z'
            }
            
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            self.wfile.write(json.dumps(error_result).encode())
    
    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, x-api-key')
        self.end_headers()
