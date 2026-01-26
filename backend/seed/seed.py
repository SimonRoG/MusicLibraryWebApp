import os
import csv
import json
import psycopg
from dotenv import load_dotenv
import hashlib


load_dotenv()


DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://user:password@localhost:5432/music_lib"
)


conn = psycopg.connect(DATABASE_URL)
cur = conn.cursor()

with open("seed/genres.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        cur.execute(
            """
            insert into genres(name)
            	values (%s)
            on conflict do nothing
            """,
            (row["name"],),
        )

with open("seed/artists.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        cur.execute(
            """
            insert into artists(name, description)
            	values (%s, %s)
            on conflict do nothing
            """,
            (row["name"], row["description"]),
        )

with open("seed/users.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        cur.execute(
            """
            insert into users(username, email, password_hash)
            	values (%s, %s, %s)
            on conflict do nothing
            """,
            (
                row["username"],
                row["email"],
                hashlib.sha256(row["password"].encode()).hexdigest(),
            ),
        )

with open("seed/albums.json", "r") as f:
    albums_data = json.load(f)
    for album in albums_data:
        cur.execute(
            """
            insert into albums(title, artist_id, release_year, cover_image)
                values (%s, 
                    (select id from artists where name=%s limit 1), 
                    %s, 
                    %s)
            on conflict do nothing
            """,
            (
                album["title"],
                album["artist"],
                album["year"],
                album["cover_image"],
            ),
        )

with open("seed/tracks.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        cur.execute(
            """
            insert into tracks(title, artist_id, album_id, genre_id, release_year, audio_file, owner_id)
                values (%s, 
                    (select id from artists where name=%s limit 1), 
                    (select id from albums where title=%s limit 1),
                    (select id from genres where name=%s limit 1), 
                    %s, 
                    %s, 
                    (select id from users where username=%s limit 1))
            on conflict do nothing
            """,
            (
                row["title"],
                row["artist"],
                row["album"],
                row["genre"],
                row["year"],
                row["audio_file"],
                row["owner"],
            ),
        )

with open("seed/albums.json", "r") as f:
    albums_data = json.load(f)
    for album in albums_data:
        for position, track_title in enumerate(album["tracks"], start=1):
            cur.execute(
                """
                insert into albums_tracks(album_id, track_id, position) 
                    values (
                        (select id from albums where title=%s limit 1),
                        (select id from tracks where title=%s limit 1),
                		%s)
                on conflict do nothing
                """,
                (album["title"], track_title, position),
            )

with open("seed/playlists.json", "r") as f:
    playlists_data = json.load(f)
    for playlist in playlists_data:
        cur.execute(
            """
            insert into playlists(name, user_id)
                values (%s, 
                    (select id from users where username=%s limit 1))
            on conflict do nothing
            """,
            (playlist["name"], playlist["user"]),
        )
        for position, track_title in enumerate(playlist["tracks"], start=1):
            cur.execute(
                """
                insert into playlist_tracks(playlist_id, track_id, position) 
                    values (
                        (select id from playlists where name=%s limit 1),
                        (select id from tracks where title=%s limit 1),
                        %s)
                on conflict do nothing
                """,
                (playlist["name"], track_title, position),
            )


conn.commit()
cur.close()
conn.close()
