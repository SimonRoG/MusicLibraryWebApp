from __future__ import annotations
from typing import Optional, Sequence
from sqlalchemy.orm import Session
from sqlalchemy import func

from . import models


# Users


def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(
    db: Session, *, username: str, email: str, password_hash: str
) -> models.User:
    user = models.User(username=username, email=email, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# Artist


def list_artists(
    db: Session, *, limit: int = 200, offset: int = 0
) -> Sequence[models.Artist]:
    return (
        db.query(models.Artist)
        .order_by(models.Artist.name)
        .offset(offset)
        .limit(limit)
        .all()
    )


def get_artist(db: Session, artist_id: int) -> Optional[models.Artist]:
    return db.query(models.Artist).filter(models.Artist.id == artist_id).first()


# Genre


def list_genres(
    db: Session, *, limit: int = 200, offset: int = 0
) -> Sequence[models.Genre]:
    return (
        db.query(models.Genre)
        .order_by(models.Genre.name)
        .offset(offset)
        .limit(limit)
        .all()
    )


def get_genre(db: Session, genre_id: int) -> Optional[models.Genre]:
    return db.query(models.Genre).filter(models.Genre.id == genre_id).first()


# Album


def list_albums(
    db: Session, *, limit: int = 200, offset: int = 0
) -> Sequence[models.Album]:
    return (
        db.query(models.Album)
        .order_by(models.Album.title)
        .offset(offset)
        .limit(limit)
        .all()
    )


def get_album(db: Session, album_id: int) -> Optional[models.Album]:
    return db.query(models.Album).filter(models.Album.id == album_id).first()


# Tracks


def get_track(db: Session, track_id: int) -> Optional[models.Track]:
    return db.query(models.Track).filter(models.Track.id == track_id).first()


def list_tracks(
    db: Session,
    *,
    q: Optional[str] = None,
    genre_id: Optional[int] = None,
    artist_id: Optional[int] = None,
    year: Optional[int] = None,
    owner_id: Optional[int] = None,
    limit: int = 50,
    offset: int = 0,
) -> Sequence[models.Track]:
    query = db.query(models.Track)
    if q:
        query = query.filter(models.Track.title.ilike(f"%{q}%"))
    if genre_id:
        query = query.filter(models.Track.genre_id == genre_id)
    if artist_id:
        query = query.filter(models.Track.artist_id == artist_id)
    if year:
        query = query.filter(models.Track.release_year == year)
    if owner_id:
        query = query.filter(models.Track.owner_id == owner_id)

    return (
        query.order_by(models.Track.created_at.desc(), models.Track.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def create_track(
    db: Session,
    *,
    owner_id: int,
    title: str,
    audio_file: str,
    artist_id: Optional[int] = None,
    album_id: Optional[int] = None,
    genre_id: Optional[int] = None,
    release_year: Optional[int] = None,
    description: Optional[str] = None,
    add_to_saved: bool = True,
) -> models.Track:
    track = models.Track(
        owner_id=owner_id,
        title=title,
        audio_file=audio_file,
        artist_id=artist_id,
        album_id=album_id,
        genre_id=genre_id,
        release_year=release_year,
        description=description,
    )
    db.add(track)
    db.commit()
    db.refresh(track)

    if add_to_saved:
        saved = get_or_create_saved_playlist(db, user_id=owner_id)
        add_track_to_playlist(db, playlist_id=saved.id, track_id=track.id)

    return track


def update_track(db: Session, *, track: models.Track, **fields) -> models.Track:
    allowed = {
        "title",
        "artist_id",
        "album_id",
        "genre_id",
        "release_year",
        "audio_file",
        "description",
    }
    for k, v in fields.items():
        if k in allowed:
            setattr(track, k, v)

    db.add(track)
    db.commit()
    db.refresh(track)
    return track


def delete_track(db: Session, *, track: models.Track) -> None:
    db.delete(track)
    db.commit()


# Playlists


def get_playlist(db: Session, playlist_id: int) -> Optional[models.Playlist]:
    return db.query(models.Playlist).filter(models.Playlist.id == playlist_id).first()


def list_playlists_for_user(db: Session, *, user_id: int) -> Sequence[models.Playlist]:
    return (
        db.query(models.Playlist)
        .filter(models.Playlist.user_id == user_id)
        .order_by(models.Playlist.created_at.desc(), models.Playlist.id.desc())
        .all()
    )


def create_playlist(db: Session, *, user_id: int, name: str) -> models.Playlist:
    pl = models.Playlist(user_id=user_id, name=name)
    db.add(pl)
    db.commit()
    db.refresh(pl)
    return pl


def update_playlist(
    db: Session, *, playlist: models.Playlist, name: str
) -> models.Playlist:
    playlist.name = name
    db.add(playlist)
    db.commit()
    db.refresh(playlist)
    return playlist


def delete_playlist(db: Session, *, playlist: models.Playlist) -> None:
    db.delete(playlist)
    db.commit()


def get_or_create_saved_playlist(db: Session, *, user_id: int) -> models.Playlist:
    saved = (
        db.query(models.Playlist)
        .filter(models.Playlist.user_id == user_id, models.Playlist.name == "Saved")
        .first()
    )
    if saved:
        return saved

    saved = models.Playlist(user_id=user_id, name="Saved")
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return saved


# PlaylistTrack


def list_playlist_tracks(
    db: Session, *, playlist_id: int
) -> Sequence[models.PlaylistTrack]:
    return (
        db.query(models.PlaylistTrack)
        .filter(models.PlaylistTrack.playlist_id == playlist_id)
        .order_by(
            models.PlaylistTrack.position.asc().nulls_last(),
            models.PlaylistTrack.track_id.asc(),
        )
        .all()
    )


def add_track_to_playlist(
    db: Session,
    *,
    playlist_id: int,
    track_id: int,
    position: Optional[int] = None,
) -> models.PlaylistTrack:
    existing = (
        db.query(models.PlaylistTrack)
        .filter(
            models.PlaylistTrack.playlist_id == playlist_id,
            models.PlaylistTrack.track_id == track_id,
        )
        .first()
    )
    if existing:
        return existing

    if position is None:
        max_pos = (
            db.query(func.max(models.PlaylistTrack.position))
            .filter(models.PlaylistTrack.playlist_id == playlist_id)
            .scalar()
        )
        position = (max_pos or 0) + 1

    link = models.PlaylistTrack(
        playlist_id=playlist_id,
        track_id=track_id,
        position=position,
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


def remove_track_from_playlist(db: Session, *, playlist_id: int, track_id: int) -> bool:
    link = (
        db.query(models.PlaylistTrack)
        .filter(
            models.PlaylistTrack.playlist_id == playlist_id,
            models.PlaylistTrack.track_id == track_id,
        )
        .first()
    )
    if not link:
        return False

    db.delete(link)
    db.commit()
    return True
