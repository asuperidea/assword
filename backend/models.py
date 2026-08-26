from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class Users(Base):
    __tablename__ = "users"

    userId = Column(Integer, primary_key=True, index=True, nullable=False)
    email = Column(String, unique=True)
    salt = Column(String, unique=True, nullable=False)
    authKey = Column(String, unique=True, nullable=False)

class Entries(Base):
    __tablename__ = "entires"

    entryId = Column(Integer, primary_key=True, index=True, nullable=False)
    userId = Column(Integer, index=True, nullable=False)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)