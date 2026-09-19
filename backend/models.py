from sqlalchemy import Boolean, Column, Integer, String
from database import Base
from pydantic import BaseModel

# Large Database Models
class Users(Base):
    __tablename__ = "users"

    userId = Column(Integer, primary_key=True, index=True, nullable=False)
    email = Column(String, unique=True)
    salt = Column(String, unique=True, nullable=False)
    authKey = Column(String, unique=True, nullable=False)

class Entries(Base):
    __tablename__ = "entries"

    entryId = Column(Integer, primary_key=True, index=True, nullable=False)
    userId = Column(Integer, index=True, nullable=False)
    title = Column(String, nullable=False)
    website = Column(String)
    username = Column(String)
    password = Column(String, nullable=False)
    iv = Column(String, nullable=False)

# Models for function use (idk the term bro)

class UserBase(BaseModel):
    userId: int
    email: str
    salt: str
    authKey: str

    class Config:
        from_attributes = True

class UserPublic(BaseModel):
    userId: int
    email: str

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: str
    salt: str
    authKey: str

class UserSalt(BaseModel):
    salt: str

    class Config:
            from_attributes = True

class EntryCreate(BaseModel):
    title: str
    content: str
    website: str
    username: str
    iv: str

class EntryGet(BaseModel):
    entryId: int
    title: str
    content: str
    website: str
    username: str
    iv: str

class entryDelete(BaseModel):
    entryId: int
    iv: str

class EntryBase(BaseModel):
    entryId: int
    userId: int
    title: str
    website: str
    username: str
    content: str