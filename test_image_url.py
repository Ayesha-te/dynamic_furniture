import requests

url = "http://localhost:8000/media/products/images/test.jpg"
response = requests.get(url)
print(f"Status: {response.status_code}")
print(f"Content-Type: {response.headers.get('Content-Type')}")
print(f"Content-Length: {len(response.content)}")
