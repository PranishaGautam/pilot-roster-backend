drop table users;

CREATE TABLE users (
	id serial primary key,
	first_name varchar(100) not null,
	last_name varchar(100) not null,
	role varchar(100) not null,
	start_date date not null,
	end_date date null,
	email varchar unique not null,
	password varchar not null
)

INSERT INTO public.users
(id, first_name, last_name, "role", start_date, end_date, email, "password")
VALUES(nextval('users_id_seq'::regclass), 'Pranisha', 'Gautam', 'Pilot', '2024-01-01', null, 'xyzpranisha@gmail.com', 'password123');

INSERT INTO public.users
(id, first_name, last_name, "role", start_date, end_date, email, "password")
VALUES(nextval('users_id_seq'::regclass), 'Saurav', 'Bhattarai', 'Admin', '2024-01-01', null, 'saurav.bhattarai@gmail.com', 'password1234');

create table pilots (
	pilot_id serial primary key,
	user_id int not null,
	license_no varchar(50) unique not null,
	license_specs json not null,
	experience_in_yrs int not null,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)


create table aircrafts (
	aircraft_id serial primary key,
	name varchar not null,
	model varchar not null,
	specifications JSON null
)


create table routes (
	route_id serial primary key,
	origin varchar not null,
	destination varchar not null,
	distance_km int not null,
	metadata JSON null
)


drop table schedules
create table schedules (
	schedule_id serial primary key,
	aircraft_id int not null,
	route_id int not null,
	pilot_id int not null,
	co_pilot_id int not null,
	start_time timestamp not null,
	end_time timestamp not null,
	status varchar(50) not null,
	last_updated_time timestamp default current_timestamp,
	unique (aircraft_id, start_time, end_time),
	unique (pilot_id, start_time, end_time),
	unique (co_pilot_id, start_time, end_time),
	FOREIGN KEY (aircraft_id) REFERENCES aircrafts (aircraft_id) ON DELETE CASCADE,
	FOREIGN KEY (route_id) REFERENCES routes (route_id) ON DELETE CASCADE,
	FOREIGN KEY (pilot_id) REFERENCES pilots (pilot_id) ON DELETE CASCADE,
	FOREIGN KEY (co_pilot_id) REFERENCES pilots (pilot_id) ON DELETE CASCADE,
	check (start_time > end_time),
	check (status in ('SCHEDULED', 'DELAYED', 'CANCELLED', 'COMPLETED', 'ON ROUTE'))
);

drop table pilot_schedule_updates;

create table pilot_schedule_updates (
	update_id serial primary key,
	schedule_id int not null,
	update_type varchar not null,
	update_at timestamp not null,
	requestor_id int not null,
	new_pilot_id int,
	update_description text,
	approver_id int not null,
	approval_time timestamp not null,
	status varchar(50) not null,
	FOREIGN KEY (requestor_id) REFERENCES pilots (pilot_id) ON DELETE CASCADE,
	FOREIGN KEY (new_pilot_id) REFERENCES pilots (pilot_id) ON DELETE CASCADE,
	FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id) ON DELETE CASCADE,
	FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE,
	check (update_type in ('SWAP', 'LEAVE')),
	check (status in ('PENDING', 'APPROVED', 'REJECTED'))
)

alter table schedules
add column last_updated_id int

alter table schedules
add constraint fk_last_updated_id
foreign key (last_updated_id) REFERENCES pilot_schedule_updates(update_id) ON DELETE CASCADE
