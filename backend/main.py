import os
import shutil
import uuid
from fastapi import FastAPI, Depends, HTTPException, Body, File, UploadFile, status
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from db.db import SessionLocal
from db import models, crud, schemas
from core import security

app = FastAPI(title="Music Library API")

if os.path.exists("media"):
    app.mount("/media", StaticFiles(directory="media"), name="media")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


# Users


@app.get("/api/users", response_model=List[schemas.User])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@app.get("/api/users/me", response_model=schemas.User)
async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, security.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db),
):
    if not token:
        return None
    try:
        payload = jwt.decode(
            token, security.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None
    return crud.get_user_by_username(db, username=username)


@app.post("/api/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(
        db=db,
        username=user.username,
        email=user.email,
        password_hash=security.get_password_hash(user.password),
    )


# Tracks


@app.get("/api/tracks", response_model=List[schemas.Track])
def list_tracks(
    q: Optional[str] = None,
    genre_id: Optional[int] = None,
    artist_id: Optional[int] = None,
    album_id: Optional[int] = None,
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
        album_id=album_id,
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
def list_playlists(
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    user_id = current_user.id if current_user else None
    return crud.list_playlists_for_user(db, user_id=user_id)


@app.get("/api/playlists/{playlist_id}", response_model=schemas.Playlist)
def get_playlist(
    playlist_id: int,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
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
def list_playlist_tracks(
    playlist_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    user_id = current_user.id if current_user else None
    pl = crud.get_playlist(db, playlist_id)
    if not pl:
        raise HTTPException(status_code=404, detail="Playlist not found")
    if pl.user_id != 1 and user_id != 1 and not user_id:
        raise HTTPException(
            status_code=401,
            detail="Authentication required to view tracks in this playlist",
        )
    elif pl.user_id != 1 and user_id != 1 and pl.user_id != user_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to view tracks in this playlist"
        )
    return crud.list_playlist_tracks(db, playlist_id=playlist_id, user_id=user_id)


@app.post(
    "/api/playlists/{playlist_id}/tracks/{track_id}",
    response_model=schemas.PlaylistTrack,
)
def add_track_to_playlist(
    playlist_id: int,
    track_id: int,
    position: Optional[int] = Body(None, embed=True),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pl = crud.get_playlist(db, playlist_id)
    if not pl:
        raise HTTPException(status_code=404, detail="Playlist not found")
    if pl.user_id != current_user.id and current_user.id != 1:
        raise HTTPException(
            status_code=403, detail="Not authorized to edit this playlist"
        )

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


@app.get("/api/artists/{artist_id}", response_model=schemas.Artist)
def get_artist(artist_id: int, db: Session = Depends(get_db)):
    artist = crud.get_artist(db, artist_id=artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist


@app.post("/api/artists", response_model=schemas.Artist)
def create_artist(artist: schemas.ArtistBase, db: Session = Depends(get_db)):
    db_artist = crud.get_artist_by_name(db, name=artist.name)
    if db_artist:
        return db_artist
    return crud.create_artist(db, name=artist.name, description=artist.description)


@app.patch("/api/artists/{artist_id}", response_model=schemas.Artist)
def update_artist(
    artist_id: int,
    artist_update: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.username != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    artist = crud.get_artist(db, artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return crud.update_artist(db, artist=artist, **artist_update)


# Genres


@app.get("/api/genres", response_model=List[schemas.Genre])
def list_genres(limit: int = 100, offset: int = 0, db: Session = Depends(get_db)):
    return crud.list_genres(db, limit=limit, offset=offset)


# Albums


@app.get("/api/albums", response_model=List[schemas.Album])
def list_albums(
    artist_id: Optional[int] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    return crud.list_albums(db, artist_id=artist_id, limit=limit, offset=offset)


@app.get("/api/albums/{album_id}", response_model=schemas.Album)
def get_album(album_id: int, db: Session = Depends(get_db)):
    album = crud.get_album(db, album_id=album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    return album


@app.post("/api/albums", response_model=schemas.Album)
def create_album(album: schemas.AlbumBase, db: Session = Depends(get_db)):
    if not album.artist_id:
        raise HTTPException(status_code=400, detail="artist_id is required")
    db_album = crud.get_album_by_title_and_artist(
        db, title=album.title, artist_id=album.artist_id
    )
    if db_album:
        return db_album
    return crud.create_album(
        db,
        title=album.title,
        artist_id=album.artist_id,
        release_year=album.release_year,
        cover_image=album.cover_image,
    )


# Uplaod files


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    upload_dir = "media/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, file_name)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file_path}


# Saved


@app.get("/api/saved", response_model=List[schemas.Saved])
def get_saved(
    current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return crud.get_saved(db, user_id=current_user.id)


@app.post("/api/saved")
def add_to_saved(
    item: schemas.Saved,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.add_to_saved(
        db,
        user_id=current_user.id,
        track_id=item.track_id,
        album_id=item.album_id,
        artist_id=item.artist_id,
        playlist_id=item.playlist_id,
    )


@app.delete("/api/saved")
def remove_from_saved(
    item: schemas.Saved,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.remove_from_saved(
        db,
        user_id=current_user.id,
        track_id=item.track_id,
        album_id=item.album_id,
        artist_id=item.artist_id,
        playlist_id=item.playlist_id,
    )
