from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.database import create_tables
from app.routers.hcp import router as hcp_router
from app.routers.interactions import router as interactions_router
from app.routers.ai_agent import router as ai_agent_router
from app.routers.auth import router as auth_router
from app.routers.voice import router as voice_router
from app.routers.analytics import router as analytics_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting AIVOA CRM backend...")
    await create_tables()
    await seed_data()
    logger.info("Ready.")
    yield
    logger.info("Shutting down.")


async def seed_data():
    from app.database import AsyncSessionLocal
    from app.models.hcp import HCP
    from app.models.user import User, UserRole
    from app.services.auth_service import hash_password
    from sqlalchemy import select

    async with AsyncSessionLocal() as session:
        # Seed default admin user
        admin_q = await session.execute(select(User).where(User.email == "admin@aivoa.com"))
        if not admin_q.scalar_one_or_none():
            users = [
                User(email="admin@aivoa.com", full_name="Admin User", role=UserRole.admin,
                     hashed_password=hash_password("Admin@123"), territory="All"),
                User(email="manager@aivoa.com", full_name="Regional Manager", role=UserRole.manager,
                     hashed_password=hash_password("Manager@123"), territory="South India"),
                User(email="rep@aivoa.com", full_name="Medical Rep", role=UserRole.rep,
                     hashed_password=hash_password("Rep@123"), territory="Bangalore Urban"),
                User(email="msl@aivoa.com", full_name="Medical Science Liaison", role=UserRole.msl,
                     hashed_password=hash_password("Msl@123"), territory="Karnataka"),
            ]
            session.add_all(users)
            await session.commit()
            logger.info("Seeded default users.")

        # Seed sample HCPs
        hcp_q = await session.execute(select(HCP).limit(1))
        if not hcp_q.scalar_one_or_none():
            hcps = [
                HCP(name="Dr. Priya Sharma", specialty="Cardiology", hospital="Apollo Hospitals Bangalore",
                    territory="South India", email="p.sharma@apollo.com", phone="+91-9876543210"),
                HCP(name="Dr. Rajesh Kumar", specialty="Oncology", hospital="Manipal Hospital",
                    territory="Karnataka", email="r.kumar@manipal.edu", phone="+91-9876543211"),
                HCP(name="Dr. Anita Desai", specialty="Neurology", hospital="Narayana Health",
                    territory="Bangalore Urban", email="a.desai@narayana.com", phone="+91-9876543212"),
                HCP(name="Dr. Suresh Menon", specialty="Diabetology", hospital="Fortis Hospital",
                    territory="Kerala", email="s.menon@fortis.com", phone="+91-9876543213"),
                HCP(name="Dr. Kavitha Nair", specialty="Pulmonology", hospital="NIMHANS",
                    territory="Mysore", email="k.nair@nimhans.ac.in", phone="+91-9876543214"),
                HCP(name="Dr. Vikram Patel", specialty="Rheumatology", hospital="St. John's Medical College",
                    territory="Hubli", email="v.patel@stjohns.in", phone="+91-9876543215"),
                HCP(name="Dr. Meera Krishnan", specialty="Endocrinology", hospital="Aster CMI Hospital",
                    territory="Mangalore", email="m.krishnan@aster.in", phone="+91-9876543216"),
                HCP(name="Dr. Arun Bhat", specialty="Gastroenterology", hospital="Cloudnine Hospital",
                    territory="Pune", email="a.bhat@cloudnine.in", phone="+91-9876543217"),
            ]
            session.add_all(hcps)
            await session.commit()
            logger.info(f"Seeded {len(hcps)} sample HCPs.")


app = FastAPI(
    title="AIVOA Life Sciences CRM API",
    description="AI-First CRM HCP Module — Production Ready",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5176",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5176",
        "http://localhost:3000",
        "http://frontend:80",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(hcp_router)
app.include_router(interactions_router)
app.include_router(ai_agent_router)
app.include_router(voice_router)
app.include_router(analytics_router)


@app.get("/health")
async def health():
    return {"status": "healthy", "version": "2.0.0"}


@app.get("/")
async def root():
    return {"message": "AIVOA CRM API v2.0", "docs": "/docs"}