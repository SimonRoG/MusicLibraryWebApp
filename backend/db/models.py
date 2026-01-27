from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    ForeignKey,
    TIMESTAMP,
    func,
)
from sqlalchemy.orm import relationship

from .db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    tracks = relationship("Track", back_populates="owner", cascade="all, delete")
    playlists = relationship("Playlist", back_populates="user", cascade="all, delete")


class Artist(Base):
    __tablename__ = "artists"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)

    albums = relationship("Album", back_populates="artist")
    tracks = relationship("Track", back_populates="artist")


class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

    tracks = relationship("Track", back_populates="genre")


class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    artist_id = Column(Integer, ForeignKey("artists.id", ondelete="restrict"))
    release_year = Column(Integer)
    cover_image = Column(Text)

    artist = relationship("Artist", back_populates="albums")
    tracks = relationship("Track", back_populates="album", cascade="all, delete")


class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True)
    title = Column(String(150), nullable=False)
    artist_id = Column(Integer, ForeignKey("artists.id", ondelete="restrict"))
    album_id = Column(Integer, ForeignKey("albums.id", ondelete="restrict"))
    genre_id = Column(Integer, ForeignKey("genres.id", ondelete="restrict"))
    release_year = Column(Integer)
    audio_file = Column(Text, nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="cascade"))
    created_at = Column(TIMESTAMP, server_default=func.now())

    artist = relationship("Artist", back_populates="tracks")
    album = relationship("Album", back_populates="tracks")
    genre = relationship("Genre", back_populates="tracks")
    owner = relationship("User", back_populates="tracks")
    playlists = relationship(
        "PlaylistTrack", back_populates="track", cascade="all, delete"
    )


class Playlist(Base):
    __tablename__ = "playlists"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="cascade"))
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="playlists")
    tracks = relationship(
        "PlaylistTrack", back_populates="playlist", cascade="all, delete"
    )


class PlaylistTrack(Base):
    __tablename__ = "playlist_tracks"

    playlist_id = Column(
        Integer, ForeignKey("playlists.id", ondelete="cascade"), primary_key=True
    )
    track_id = Column(
        Integer, ForeignKey("tracks.id", ondelete="cascade"), primary_key=True
    )
    position = Column(Integer)

    playlist = relationship("Playlist", back_populates="tracks")
    track = relationship("Track", back_populates="playlists")
