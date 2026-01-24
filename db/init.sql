create table if not exists users(
	id serial primary key,
	username varchar(50) unique not null,
	email varchar(100) unique not null,
	password_hash text not null,
	created_at timestamp default current_timestamp
);

create table if not exists artists(
	id serial primary key,
	name varchar(100) not null,
	description text
);

create table if not exists albums(
	id serial primary key,
	title varchar(100) not null,
	artist_id int references artists(id) on delete set null,
	release_year int,
	cover_image text
);

create table if not exists genres(
	id serial primary key,
	name varchar(50) unique not null
);

create table if not exists tracks(
	id serial primary key,
	title varchar(150) not null,
	artist_id int references artists(id) on delete set null,
	album_id int references albums(id) on delete set null,
	genre_id int references genres(id),
	release_year int,
	audio_file text not null,
	description text,
	owner_id int references users(id) on delete cascade,
	created_at timestamp default current_timestamp
);

create table if not exists playlists(
	id serial primary key,
	name varchar(100) not null,
	user_id int references users(id) on delete cascade,
	created_at timestamp default current_timestamp
);

create table if not exists playlist_tracks(
	playlist_id int references playlists(id) on delete cascade,
	track_id int references tracks(id) on delete cascade,
	position int,
	primary key (playlist_id, track_id)
);

