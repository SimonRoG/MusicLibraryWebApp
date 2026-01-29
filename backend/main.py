import os
from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
from sqlalchemy.orm import Session

from db.db import SessionLocal
from db import models, crud, schemas

app = FastAPI(title="Music Library API")

if os.path.exists("media"):
    app.mount("/media", StaticFiles(directory="media"), name="media")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Users


@app.get("/api/users", response_model=List[schemas.User])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@app.post("/api/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(
        db=db,
        username=user.username,
        email=user.email,
        password_hash=user.password_hash,
    )


# Tracks


@app.get("/api/tracks", response_model=List[schemas.Track])
def list_tracks(
    q: Optional[str] = None,
    genre_id: Optional[int] = None,
    artist_id: Optional[int] = None,
    year: Optional[int] = None,
    owner_id: Optional[int] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    return crud.list_tracks(
        db,
        q=q,
        genre_id=genre_id,
        artist_id=artist_id,
        year=year,
        owner_id=owner_id,
        limit=limit,
        offset=offset,
    )


@app.get("/api/tracks/{track_id}", response_model=schemas.Track)
def get_track(track_id: int, db: Session = Depends(get_db)):
    track = crud.get_track(db, track_id)
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    return track


@app.post("/api/tracks", response_model=schemas.Track)
def create_track(track: schemas.TrackCreate, db: Session = Depends(get_db)):
    return crud.create_track(
        db,
        owner_id=track.owner_id,
        title=track.title,
        audio_file=track.audio_file,
        artist_id=track.artist_id,
        album_id=track.album_id,
        genre_id=track.genre_id,
        release_year=track.release_year,
        description=track.description,
        add_to_saved=track.add_to_saved,
    )


@app.patch("/api/tracks/{track_id}", response_model=schemas.Track)
def update_track(
    track_id: int, track_update: dict = Body(...), db: Session = Depends(get_db)
):
    track = crud.get_track(db, track_id)
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    return crud.update_track(db, track=track, **track_update)


@app.delete("/api/tracks/{track_id}")
def delete_track(track_id: int, db: Session = Depends(get_db)):
    track = crud.get_track(db, track_id)
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    crud.delete_track(db, track=track)
    return {"ok": True}


# Playlists


@app.get("/api/playlists", response_model=List[schemas.Playlist])
def list_playlists(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    return crud.list_playlists_for_user(db, user_id=user_id)


@app.get("/api/playlists/{playlist_id}", response_model=schemas.Playlist)
def get_playlist(playlist_id: int, db: Session = Depends(get_db)):
    pl = crud.get_playlist(db, playlist_id)
    if not pl:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return pl


@app.post("/api/playlists", response_model=schemas.Playlist)
def create_playlist(playlist: schemas.PlaylistCreate, db: Session = Depends(get_db)):
    return crud.create_playlist(db, user_id=playlist.user_id, name=playlist.name)


@app.patch("/api/playlists/{playlist_id}", response_model=schemas.Playlist)
def update_playlist(
    playlist_id: int, playlist_update: dict = Body(...), db: Session = Depends(get_db)
):
    pl = crud.get_playlist(db, playlist_id)
    if not pl:
        raise HTTPException(status_code=404, detail="Playlist not found")
    name = playlist_update.get("name")
    if name:
        pl = crud.update_playlist(db, playlist=pl, name=name)
    return pl


@app.delete("/api/playlists/{playlist_id}")
def delete_playlist(playlist_id: int, db: Session = Depends(get_db)):
    pl = crud.get_playlist(db, playlist_id)
    if not pl:
        raise HTTPException(status_code=404, detail="Playlist not found")
    crud.delete_playlist(db, playlist=pl)
    return {"ok": True}


# Playlist tracks


@app.get(
    "/api/playlists/{playlist_id}/tracks", response_model=List[schemas.PlaylistTrack]
)
def list_playlist_tracks(playlist_id: int, db: Session = Depends(get_db)):
    return crud.list_playlist_tracks(db, playlist_id=playlist_id)


@app.post(
    "/api/playlists/{playlist_id}/tracks/{track_id}",
    response_model=schemas.PlaylistTrack,
)
def add_track_to_playlist(
    playlist_id: int,
    track_id: int,
    position: Optional[int] = Body(None, embed=True),
    db: Session = Depends(get_db),
):
    return crud.add_track_to_playlist(
        db, playlist_id=playlist_id, track_id=track_id, position=position
    )


@app.delete("/api/playlists/{playlist_id}/tracks/{track_id}")
def remove_track_from_playlist(
    playlist_id: int, track_id: int, db: Session = Depends(get_db)
):
    ok = crud.remove_track_from_playlist(db, playlist_id=playlist_id, track_id=track_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Track not found in playlist")
    return {"ok": True}


# Artists


@app.get("/api/artists", response_model=List[schemas.Artist])
def list_artists(limit: int = 100, offset: int = 0, db: Session = Depends(get_db)):
    return crud.list_artists(db, limit=limit, offset=offset)


# Genres


@app.get("/api/genres", response_model=List[schemas.Genre])
def list_genres(limit: int = 100, offset: int = 0, db: Session = Depends(get_db)):
    return crud.list_genres(db, limit=limit, offset=offset)


# Albums


@app.get("/api/albums", response_model=List[schemas.Album])
def list_albums(limit: int = 100, offset: int = 0, db: Session = Depends(get_db)):
    return crud.list_albums(db, limit=limit, offset=offset)
