from fastapi import FastAPI, Request, HTTPException, status, Depends
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, EmailStr
from typing import Annotated
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from models import Users, Entries
from database import engine, SessionLocal, Base
import hashlib
import os
from dotenv import load_dotenv
from jwtfuncs import createJWT, decodeJWT

load_dotenv()
JWT_KEY = os.getenv("JWT_KEY")

app = FastAPI()
Base.metadata.create_all(engine)

class UserBase(BaseModel):
    userId: int
    email: str
    salt: str
    authKey: str

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: str
    salt: str
    authKey: str

class UserSalt(BaseModel):
    salt: str

class UserValidate(BaseModel):
    email:str
    authKey:str

class EntryCreate(BaseModel):
    userId: int
    title: str
    content: str

class EntryGet(BaseModel):
    entryId: int
    title: str
    content: str

class EntryBase(BaseModel):
    entryId: int
    userId: int
    title: str
    content: str

def get_db():
    db = SessionLocal() 
    try:
        yield db
    finally:
        db.close()

get_db()

@app.get("/")
def root():
    return {"message":"Welcome, Server Running"}

@app.get("/login/start", response_model=UserSalt)
def loginStart(userEmail:str, db:Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email == userEmail).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found!")
    return user

@app.get("/login/validate")
def loginValidate(userEmail:str, userAuth:str, db:Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email == userEmail).first()
    hash = hashlib.sha256(userAuth.encode()).hexdigest()
    if hash == user.authKey:
        return createJWT(JWT_KEY, "Log In Validation", user.userId, user.email)
    else:
        raise HTTPException(status_code=400, detail="Invalid email or authkey")

@app.post("/signup")
def signup(user: UserCreate, db:Session = Depends(get_db)):
    if db.query(Users).filter(Users.email == user.email).first():
        raise HTTPException(status_code=409, detail="User email already exists!")
    newUser = Users(**user.model_dump())
    newUserHash = hashlib.sha256(newUser.authKey.encode())
    print(newUserHash)
    newUser.authKey = newUserHash.hexdigest()
    print(newUser.authKey)
    db.add(newUser)
    db.commit()
    db.refresh(newUser)
    return newUser