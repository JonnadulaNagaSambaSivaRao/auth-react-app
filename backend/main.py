from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import User
from schemas import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse
)
from auth import (
    hash_password,
    verify_password,
    create_access_token
)
from dependencies import get_current_user


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="User Authentication API",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# ROOT
# -------------------------

@app.get("/")
def root():
    return {
        "message": "Authentication API is running"
    }


# -------------------------
# REGISTER
# -------------------------

@app.post("/register", response_model=UserResponse)
def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hash_password(user_data.password)
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    except Exception as e:
        db.rollback()

        print("REGISTER ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail="Registration failed"
        )

    return new_user


# -------------------------
# LOGIN
# -------------------------

@app.post("/login", response_model=TokenResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == login_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        login_data.password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token({
        "sub": str(user.id)
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# -------------------------
# CURRENT USER
# -------------------------

@app.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user