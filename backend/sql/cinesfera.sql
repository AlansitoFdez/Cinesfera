--
-- PostgreSQL database dump
--

\restrict uccESnOx5zJv4bifEBhJPdbyymqNKgyaidJ93DW4SWUS9HyHbtBSQgc0iMoWvJG

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-05-18 07:29:25

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 16578)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 868 (class 1247 OID 16581)
-- Name: media_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.media_type_enum AS ENUM (
    'movie',
    'tv'
);


ALTER TYPE public.media_type_enum OWNER TO postgres;

--
-- TOC entry 871 (class 1247 OID 16586)
-- Name: role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_enum AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public.role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 16616)
-- Name: content_cache; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_cache (
    tmdb_id integer NOT NULL,
    media_type public.media_type_enum NOT NULL,
    title character varying(255) NOT NULL,
    poster_path character varying(255),
    vote_average double precision,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.content_cache OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16705)
-- Name: follows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follows (
    id integer NOT NULL,
    follower_id integer NOT NULL,
    followed_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.follows OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16704)
-- Name: follows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.follows_id_seq OWNER TO postgres;

--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 234
-- Name: follows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.follows_id_seq OWNED BY public.follows.id;


--
-- TOC entry 231 (class 1259 OID 16652)
-- Name: list_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.list_items (
    id integer NOT NULL,
    list_id integer NOT NULL,
    tmdb_id integer NOT NULL,
    media_type public.media_type_enum NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.list_items OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16651)
-- Name: list_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.list_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.list_items_id_seq OWNER TO postgres;

--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 230
-- Name: list_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.list_items_id_seq OWNED BY public.list_items.id;


--
-- TOC entry 229 (class 1259 OID 16629)
-- Name: lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lists (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_default boolean DEFAULT false NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.lists OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16628)
-- Name: lists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lists_id_seq OWNER TO postgres;

--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 228
-- Name: lists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lists_id_seq OWNED BY public.lists.id;


--
-- TOC entry 233 (class 1259 OID 16677)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    tmdb_id integer NOT NULL,
    media_type public.media_type_enum NOT NULL,
    rating smallint NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16676)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 232
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 226 (class 1259 OID 16592)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    biography character varying(255) DEFAULT 'Escribe algo sobre ti ...'::character varying NOT NULL,
    role public.role_enum DEFAULT 'USER'::public.role_enum NOT NULL,
    avatar text,
    banned boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16591)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 225
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4907 (class 2604 OID 16708)
-- Name: follows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows ALTER COLUMN id SET DEFAULT nextval('public.follows_id_seq'::regclass);


--
-- TOC entry 4903 (class 2604 OID 16655)
-- Name: list_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.list_items ALTER COLUMN id SET DEFAULT nextval('public.list_items_id_seq'::regclass);


--
-- TOC entry 4899 (class 2604 OID 16632)
-- Name: lists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lists ALTER COLUMN id SET DEFAULT nextval('public.lists_id_seq'::regclass);


--
-- TOC entry 4905 (class 2604 OID 16680)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4892 (class 2604 OID 16595)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4914 (class 2606 OID 16627)
-- Name: content_cache content_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_cache
    ADD CONSTRAINT content_cache_pkey PRIMARY KEY (tmdb_id, media_type);


--
-- TOC entry 4926 (class 2606 OID 16717)
-- Name: follows follows_follower_id_followed_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_followed_id_key UNIQUE (follower_id, followed_id);


--
-- TOC entry 4928 (class 2606 OID 16715)
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (id);


--
-- TOC entry 4918 (class 2606 OID 16665)
-- Name: list_items list_items_list_id_tmdb_id_media_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.list_items
    ADD CONSTRAINT list_items_list_id_tmdb_id_media_type_key UNIQUE (list_id, tmdb_id, media_type);


--
-- TOC entry 4920 (class 2606 OID 16663)
-- Name: list_items list_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.list_items
    ADD CONSTRAINT list_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4916 (class 2606 OID 16645)
-- Name: lists lists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lists
    ADD CONSTRAINT lists_pkey PRIMARY KEY (id);


--
-- TOC entry 4922 (class 2606 OID 16691)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4924 (class 2606 OID 16693)
-- Name: reviews reviews_user_id_tmdb_id_media_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_tmdb_id_media_type_key UNIQUE (user_id, tmdb_id, media_type);


--
-- TOC entry 4910 (class 2606 OID 16615)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4912 (class 2606 OID 16613)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4934 (class 2606 OID 16723)
-- Name: follows follows_followed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_followed_id_fkey FOREIGN KEY (followed_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4935 (class 2606 OID 16718)
-- Name: follows follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4930 (class 2606 OID 16666)
-- Name: list_items list_items_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.list_items
    ADD CONSTRAINT list_items_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.lists(id) ON DELETE CASCADE;


--
-- TOC entry 4931 (class 2606 OID 16671)
-- Name: list_items list_items_tmdb_id_media_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.list_items
    ADD CONSTRAINT list_items_tmdb_id_media_type_fkey FOREIGN KEY (tmdb_id, media_type) REFERENCES public.content_cache(tmdb_id, media_type);


--
-- TOC entry 4929 (class 2606 OID 16646)
-- Name: lists lists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lists
    ADD CONSTRAINT lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4932 (class 2606 OID 16699)
-- Name: reviews reviews_tmdb_id_media_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_tmdb_id_media_type_fkey FOREIGN KEY (tmdb_id, media_type) REFERENCES public.content_cache(tmdb_id, media_type);


--
-- TOC entry 4933 (class 2606 OID 16694)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-05-18 07:29:25

--
-- PostgreSQL database dump complete
--

\unrestrict uccESnOx5zJv4bifEBhJPdbyymqNKgyaidJ93DW4SWUS9HyHbtBSQgc0iMoWvJG

