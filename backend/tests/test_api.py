import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_tools_list():
    response = client.get("/api/tools")
    assert response.status_code == 200
    data = response.json()
    assert "tools" in data
    assert len(data["tools"]) == 9


def test_upload_invalid_type():
    file_data = b"not a pdf"
    response = client.post(
        "/api/files/upload",
        data={"session_token": "test-session"},
        files={"file": ("test.txt", io.BytesIO(file_data), "text/plain")},
    )
    assert response.status_code == 400


def test_upload_empty_file():
    response = client.post(
        "/api/files/upload",
        data={"session_token": "test-session"},
        files={"file": ("empty.pdf", io.BytesIO(b""), "application/pdf")},
    )
    assert response.status_code == 400


def test_upload_valid_pdf():
    minimal_pdf = (
        b"%PDF-1.4\n"
        b"1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
        b"2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
        b"3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\n"
        b"xref\n0 4\n0000000000 65535 f\n"
        b"0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n"
        b"trailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF"
    )
    response = client.post(
        "/api/files/upload",
        data={"session_token": "test-session"},
        files={"file": ("test.pdf", io.BytesIO(minimal_pdf), "application/pdf")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "fileId" in data
    assert data["mimeType"] == "application/pdf"
