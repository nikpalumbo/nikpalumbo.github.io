#!/usr/bin/env python3
"""
Simple HTTP server that properly serves SVG files with correct MIME types.
Run this instead of Jekyll's built-in server for proper SVG handling.
"""

import http.server
import socketserver
import os
import mimetypes

# Configure MIME types
mimetypes.add_type('image/svg+xml', '.svg')

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def guess_type(self, path):
        # Override MIME type detection for SVG files
        if path.endswith('.svg'):
            return 'image/svg+xml'
        return super().guess_type(path)

def run_server(port=4000):
    """Run the server on the specified port."""
    with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
        print(f"Server running at http://localhost:{port}")
        print("SVG files will be served with correct MIME type: image/svg+xml")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()
