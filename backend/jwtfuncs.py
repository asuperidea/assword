import datetime
import jwt
import os
from dotenv import load_dotenv

load_dotenv()
JWT_KEY = os.getenv("JWT_KEY")


def createJWT(key, subject, id, email):
    payload = {
        "sub": f"{subject}",
        "id": f"{id}",
        "email": f"{email}",
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1),
        "iat": datetime.datetime.now(datetime.timezone.utc)
        }
    token = jwt.encode(payload, key, algorithm="HS256")
    return token

def decodeJWT(token, key):
    try:
        decoded = jwt.decode(token, key, algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return "Expired Token"
    except jwt.InvalidTokenError:
        return "Invalid Token"