create table users (
    id serial primary key,
    first_name VARCHAR(20) not null,
    last_name VARCHAR(30) not null,
    email varchar(35) not null,
    phone VARCHAR(15) not null,
    password VARCHAR not null,
    picture VARCHAR not null
);

create table trips (
    id serial primary key,
    name VARCHAR(50) not null,
    city varchar(30) not null,
    country varchar (20) not null,
    start_date DATE not null,
    end_date DATE not null,
    creator_id INTEGER REFERENCES users(id),
    description VARCHAR(1000),
    picture varchar(250)
);

create table comments (
    id serial primary key,
    poster_id integer REFERENCES users(id),
    trip_id integer references trips(id),
    message varchar(1000)
);

create table attendance (
    id serial primary key,
    user_id integer REFERENCES users(id),
    trip_id integer references trips(id)
);