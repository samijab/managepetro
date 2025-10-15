"""
SQLAlchemy database models for ManagePetro backend.

These models define the database schema using SQLAlchemy ORM with MySQL-specific features.
Based on schema.sql with SQLAlchemy 2.0 best practices.
"""

from datetime import datetime
from typing import Optional
from decimal import Decimal
from sqlalchemy import (
    String,
    Integer,
    Boolean,
    DateTime,
    Enum as SQLEnum,
    DECIMAL,
    Text,
    Float,
    TIMESTAMP,
    ForeignKey,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    """Base class for all database models"""
    pass


class User(Base):
    """User model for authentication"""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class Station(Base):
    """Gas station model"""
    __tablename__ = "stations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    lat: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(9, 6), nullable=True)
    lon: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(9, 6), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    region: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    fuel_type: Mapped[str] = mapped_column(
        SQLEnum('diesel', 'gasoline', 'propane', name='fuel_type_enum'),
        default='diesel'
    )
    capacity_liters: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(12, 2), nullable=True)
    current_level_liters: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(12, 2), nullable=True)
    request_method: Mapped[str] = mapped_column(
        SQLEnum('IoT', 'Manual', name='request_method_enum'),
        default='Manual'
    )
    low_fuel_threshold: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(12, 2), default=5000)

    # Relationships
    deliveries: Mapped[list["Delivery"]] = relationship(back_populates="station")
    fuel_levels: Mapped[list["StationFuelLevel"]] = relationship(back_populates="station")


class Truck(Base):
    """Truck model"""
    __tablename__ = "trucks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    plate: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    capacity_liters: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(12, 2), nullable=True)
    fuel_level_percent: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    fuel_type: Mapped[str] = mapped_column(
        SQLEnum('diesel', 'gasoline', 'propane', name='fuel_type_enum'),
        default='diesel'
    )
    status: Mapped[str] = mapped_column(
        SQLEnum('active', 'maintenance', 'offline', name='truck_status_enum'),
        default='active'
    )

    # Relationships
    deliveries: Mapped[list["Delivery"]] = relationship(back_populates="truck")
    compartments: Mapped[list["TruckCompartment"]] = relationship(back_populates="truck")


class Delivery(Base):
    """Delivery model"""
    __tablename__ = "deliveries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    truck_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("trucks.id"), nullable=True)
    station_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("stations.id"), nullable=True)
    volume_liters: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(12, 2), nullable=True)
    delivery_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(
        SQLEnum('planned', 'enroute', 'delivered', 'canceled', name='delivery_status_enum'),
        default='planned'
    )

    # Relationships
    truck: Mapped[Optional["Truck"]] = relationship(back_populates="deliveries")
    station: Mapped[Optional["Station"]] = relationship(back_populates="deliveries")


class StationFuelLevel(Base):
    """Station fuel level history model"""
    __tablename__ = "station_fuel_levels"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    station_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("stations.id"), nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    fuel_level_liters: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(12, 2), nullable=True)

    # Relationships
    station: Mapped[Optional["Station"]] = relationship(back_populates="fuel_levels")


class TruckCompartment(Base):
    """Truck compartment model"""
    __tablename__ = "truck_compartments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    truck_id: Mapped[int] = mapped_column(Integer, ForeignKey("trucks.id"), nullable=False)
    compartment_number: Mapped[int] = mapped_column(Integer, nullable=False)
    fuel_type: Mapped[str] = mapped_column(
        SQLEnum('diesel', 'gasoline', 'propane', name='fuel_type_enum'),
        nullable=False
    )
    capacity_liters: Mapped[Decimal] = mapped_column(DECIMAL(12, 2), nullable=False)
    current_level_liters: Mapped[Decimal] = mapped_column(DECIMAL(12, 2), default=0)

    # Relationships
    truck: Mapped["Truck"] = relationship(back_populates="compartments")

    __table_args__ = (
        UniqueConstraint('truck_id', 'compartment_number', name='unique_truck_compartment'),
    )


class WeatherData(Base):
    """Weather data model"""
    __tablename__ = "weather_data"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    temperature: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    condition: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    wind: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    humidity: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    collected_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP, nullable=True)
