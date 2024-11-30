BEGIN;

CREATE TABLE IF NOT EXISTS delivery(
    id serial not null primary key,
    name varchar(40) not null,
    email varchar(40) not null,
    password text not null,
    adress jsonb,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS payForms(
    id serial not null primary key,
    title varchar(30) not null unique,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS categoryEmployed(
    id serial not null primary key,
    title varchar(30) not null unique,
    salary int,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS employeds(
    id serial not null primary key,
    name varchar(30) not null,
    lastname varchar(30) not null,
    email varchar(30) not null unique,
    isOpen int default 1,
    password text not null,
    adress jsonb,
    category_id int not null references categoryEmployed(id) on delete cascade,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS clients(
    id serial not null primary key,
    name varchar(30) not null,
    lastname varchar(30) not null,
    email varchar(30) not null unique,
    password text not null,
    adress jsonb,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS productCategory(
    id serial not null primary key,
    title varchar(30) not null unique,
    description text,
    img_url text not null,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS product(
    id serial not null primary key,
    name varchar(40) not null unique,
    description varchar(100) not null,
    img_url text not null,
    current_price int not null,
    old_price int default 0,
    category_id int not null references productCategory(id) on delete cascade,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS orders(
    id serial not null primary key,
    orders_food jsonb not null,
    delivery jsonb ,
    status int default 1,
    adress jsonb not null,
    clientId int not null,
    order_detais jsonb not null,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

COMMIT;