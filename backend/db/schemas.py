from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    username: str
    email: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ArtistBase(BaseModel):
    name: str
    description: Optional[str] = None


class Artist(ArtistBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class GenreBase(BaseModel):
    name: str


class Genre(GenreBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class AlbumBase(BaseModel):
    title: str
    release_year: Optional[int] = None
    cover_image: Optional[str] = None
    artist_id: Optional[int] = None


class Album(AlbumBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class TrackBase(BaseModel):
    title: str
    artist_id: Optional[int] = None
    album_id: Optional[int] = None
    genre_id: Optional[int] = None
    release_year: Optional[int] = None
    audio_file: str
    description: Optional[str] = None
    owner_id: int


class TrackCreate(TrackBase):
    add_to_saved: bool = True


class Track(TrackBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PlaylistBase(BaseModel):
    name: str
    user_id: int


class PlaylistCreate(PlaylistBase):
    pass


class Playlist(PlaylistBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PlaylistTrack(BaseModel):
    playlist_id: int
    track_id: int
    position: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class Saved(BaseModel):
    id: int
    user_id: int
    track_id: Optional[int] = None
    album_id: Optional[int] = None
    artist_id: Optional[int] = None
    playlist_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
