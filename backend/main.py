from fastapi import FastAPI, Request, HTTPException, status, Depends
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, EmailStr
from typing import Annotated
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from models import Users, Entries
from database import engine, SessionLocal, Base

app = FastAPI()
Base.metadata.create_all(engine)

class UserCreate(BaseModel):
    email: str
    salt: str
    authKey: str

class UserBase(BaseModel):
    userId: int
    email: str
    salt: str
    authKey: str

    class Config:
        from_attributes = True

class UserSalt(BaseModel):
    salt: str

class EntryCreate(BaseModel):
    userId: int
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

@app.get("/users/getsalt/", response_model=UserSalt)
def getUserSalt(userEmail:str, db:Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email == userEmail).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found!")
    return user

@app.post("/users/adduser")
def addUser(user: UserCreate, db:Session = Depends(get_db)):
    if db.query(Users).filter(Users.email == user.email).first():
        raise HTTPException(status_code=409, detail="User email already exists!")

    new_user = Users(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user