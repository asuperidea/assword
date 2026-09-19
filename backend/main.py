from fastapi import FastAPI, Request, HTTPException, status, Depends
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, EmailStr
from typing import Annotated, List
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from models import Users, Entries, UserBase, UserPublic, UserCreate, UserSalt, EntryCreate, EntryGet, EntryBase, entryDelete
from database import engineUsers, engineEntries, SessionUsers, SessionEntries, Base
import os
from dotenv import load_dotenv
from jwtfuncs import createJWT, decodeJWT
from fakesalt import fakeSalt
import bcrypt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
Base.metadata.create_all(engineUsers)
Base.metadata.create_all(engineEntries)
bearer_scheme = HTTPBearer()

origins = [
    "https://assword.simoncrystal.dev",
    "http://localhost:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

load_dotenv()

JWT_KEY = os.getenv("JWT_KEY")
if not JWT_KEY:
    raise RuntimeError("JWT_KEY environment variable is not set")

def get_db_users():
    db_users = SessionUsers() 
    try:
        yield db_users
    finally:
        db_users.close()

def get_db_entries():
    db_entries = SessionEntries() 
    try:
        yield db_entries
    finally:
        db_entries.close()

@app.get("/")
def root():
    return {"message":"Welcome, Server Running"}

@app.get("/login/start", response_model=UserSalt)
def loginStart(userEmail:str, db:Session = Depends(get_db_users)):
    user = db.query(Users).filter(Users.email == userEmail).first()
    if not user:
        return {"salt":fakeSalt(userEmail)}
    return user

@app.get("/login/validate")
def loginValidate(userEmail:str, userAuth:str, db:Session = Depends(get_db_users)):
    user = db.query(Users).filter(Users.email == userEmail).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or authkey")
    hash = bcrypt.checkpw(userAuth.encode(), user.authKey.encode())
    if hash:
        return createJWT(JWT_KEY, "Log In Validation", user.userId, user.email)
    else:
        raise HTTPException(status_code=400, detail="Invalid email or authkey")

@app.post("/signup", response_model=UserPublic)
def signup(user: UserCreate, db:Session = Depends(get_db_users)):
    if db.query(Users).filter(Users.email == user.email).first():
        raise HTTPException(status_code=409, detail="User email already exists!")
    newUser = Users(**user.model_dump())
    hashed = bcrypt.hashpw(user.authKey.encode(), bcrypt.gensalt())
    newUser.authKey = hashed.decode()
    db.add(newUser)
    db.commit()
    db.refresh(newUser)
    return newUser


@app.post("/entry/new")
def newEntry(entry:EntryCreate, credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), db:Session = Depends(get_db_entries)):
    decodedJWT = decodeJWT(credentials.credentials, JWT_KEY)
    if isinstance(decodedJWT, dict) and decodedJWT["sub"] == "Log In Validation":
        newEntry = Entries(**entry.model_dump())
        newEntry.userId = decodedJWT["id"]
        db.add(newEntry)
        db.commit()
        db.refresh(newEntry)
        return newEntry
    elif decodedJWT == "Expired Token":
            raise HTTPException(status_code=400, detail="Expired JWT")
    else:
        raise HTTPException(status_code=400, detail="Invalid JWT")

@app.get("/entry/get", response_model=List[EntryGet])
def getEntries(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), db:Session = Depends(get_db_entries)):
    decodedJWT = decodeJWT(credentials.credentials, JWT_KEY)
    if isinstance(decodedJWT, dict) and decodedJWT["sub"] == "Log In Validation":
        id = decodedJWT["id"]
        userEntries = db.query(Entries).filter(Entries.userId == id).all()
        return userEntries
    elif decodedJWT == "Expired Token":
        raise HTTPException(status_code=400, detail="Expired JWT")
    else:
        raise HTTPException(status_code=400, detail="Invalid JWT")

@app.delete("/entry/delete")
def deleteEntry(entry:entryDelete, credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), db:Session = Depends(get_db_entries)):
    pass