from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

URL_DATABASE_USERS = 'sqlite:///users.db'
URL_DATABASE_ENTRIES = 'sqlite:///entries.db'

engineUsers = create_engine(URL_DATABASE_USERS, connect_args={"check_same_thread":False})
engineEntries = create_engine(URL_DATABASE_ENTRIES, connect_args={"check_same_thread":False})

SessionUsers = sessionmaker(autocommit=False, autoflush=False, bind=engineUsers)
SessionEntries = sessionmaker(autocommit=False, autoflush=False, bind=engineEntries)

Base = declarative_base()
