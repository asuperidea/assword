import hashlib

def fakeSalt(email):
    return hashlib.sha256(email.encode()).hexdigest()