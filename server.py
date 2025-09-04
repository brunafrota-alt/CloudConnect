#!/usr/bin/env python3
import os
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

class ConfigHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # Servir endpoint de configuração
        if parsed_path.path == '/api/config':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            config = {
                'AIRTABLE_API_KEY': os.environ.get('AIRTABLE_API_KEY', ''),
                'AIRTABLE_BASE_ID': os.environ.get('AIRTABLE_BASE_ID', ''),
            }
            
            self.wfile.write(json.dumps(config).encode())
            return
            
        # Proxy para API do Airtable para resolver CORS
        elif parsed_path.path.startswith('/api/airtable'):
            import urllib.request
            
            # Extrair a parte da URL após /api/airtable
            airtable_path = parsed_path.path.replace('/api/airtable', '')
            query = parsed_path.query
            
            # Construir URL completa do Airtable
            base_id = os.environ.get('AIRTABLE_BASE_ID', '')
            airtable_url = f"https://api.airtable.com/v0{airtable_path}"
            if query:
                airtable_url += f"?{query}"
                
            # Headers para Airtable
            headers = {
                'Authorization': f"Bearer {os.environ.get('AIRTABLE_API_KEY', '')}",
                'Content-Type': 'application/json'
            }
            
            try:
                req = urllib.request.Request(airtable_url, headers=headers)
                with urllib.request.urlopen(req) as response:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(response.read())
                    return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                error_response = {'error': str(e)}
                self.wfile.write(json.dumps(error_response).encode())
                return
        
        # Servir arquivos estáticos normalmente
        super().do_GET()
    
    def do_POST(self):
        if self.path.startswith('/api/airtable'):
            import urllib.request
            
            # Ler o corpo da requisição
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            # Extrair a parte da URL após /api/airtable
            parsed_path = urlparse(self.path)
            airtable_path = parsed_path.path.replace('/api/airtable', '')
            
            # Construir URL completa do Airtable
            airtable_url = f"https://api.airtable.com/v0{airtable_path}"
                
            # Headers para Airtable
            headers = {
                'Authorization': f"Bearer {os.environ.get('AIRTABLE_API_KEY', '')}",
                'Content-Type': 'application/json'
            }
            
            try:
                req = urllib.request.Request(airtable_url, data=post_data, headers=headers, method='POST')
                with urllib.request.urlopen(req) as response:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(response.read())
                    return
            except urllib.error.HTTPError as e:
                error_body = e.read()
                print(f"Erro HTTP {e.code} na requisição POST: {error_body.decode()}")
                self.send_response(e.code)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(error_body)
                return
            except Exception as e:
                print(f"Erro geral na requisição POST: {str(e)}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = {'error': str(e)}
                self.wfile.write(json.dumps(error_response).encode())
                return
    
    def do_PATCH(self):
        if self.path.startswith('/api/airtable'):
            import urllib.request
            
            # Ler o corpo da requisição
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            # Extrair a parte da URL após /api/airtable
            parsed_path = urlparse(self.path)
            airtable_path = parsed_path.path.replace('/api/airtable', '')
            
            # Construir URL completa do Airtable
            airtable_url = f"https://api.airtable.com/v0{airtable_path}"
                
            # Headers para Airtable
            headers = {
                'Authorization': f"Bearer {os.environ.get('AIRTABLE_API_KEY', '')}",
                'Content-Type': 'application/json'
            }
            
            try:
                req = urllib.request.Request(airtable_url, data=post_data, headers=headers, method='PATCH')
                with urllib.request.urlopen(req) as response:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(response.read())
                    return
            except urllib.error.HTTPError as e:
                error_body = e.read()
                print(f"Erro HTTP {e.code} na requisição PATCH: {error_body.decode()}")
                self.send_response(e.code)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(error_body)
                return
            except Exception as e:
                print(f"Erro geral na requisição PATCH: {str(e)}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = {'error': str(e)}
                self.wfile.write(json.dumps(error_response).encode())
                return
    
    def do_DELETE(self):
        if self.path.startswith('/api/airtable'):
            import urllib.request
            
            # Extrair a parte da URL após /api/airtable
            parsed_path = urlparse(self.path)
            airtable_path = parsed_path.path.replace('/api/airtable', '')
            
            # Construir URL completa do Airtable
            airtable_url = f"https://api.airtable.com/v0{airtable_path}"
                
            # Headers para Airtable
            headers = {
                'Authorization': f"Bearer {os.environ.get('AIRTABLE_API_KEY', '')}",
                'Content-Type': 'application/json'
            }
            
            try:
                req = urllib.request.Request(airtable_url, headers=headers, method='DELETE')
                with urllib.request.urlopen(req) as response:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(response.read())
                    return
            except urllib.error.HTTPError as e:
                error_body = e.read()
                print(f"Erro HTTP {e.code} na requisição DELETE: {error_body.decode()}")
                self.send_response(e.code)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(error_body)
                return
            except Exception as e:
                print(f"Erro geral na requisição DELETE: {str(e)}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = {'error': str(e)}
                self.wfile.write(json.dumps(error_response).encode())
                return

if __name__ == '__main__':
    port = 5000
    server = HTTPServer(('0.0.0.0', port), ConfigHandler)
    print(f"Servidor rodando na porta {port}")
    print(f"Configurações carregadas:")
    print(f"  AIRTABLE_API_KEY: {'✅ Configurada' if os.environ.get('AIRTABLE_API_KEY') else '❌ Não configurada'}")
    print(f"  AIRTABLE_BASE_ID: {'✅ Configurada' if os.environ.get('AIRTABLE_BASE_ID') else '❌ Não configurada'}")
    server.serve_forever()