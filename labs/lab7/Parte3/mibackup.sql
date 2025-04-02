--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2025-04-02 08:34:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 136111)
-- Name: analysis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analysis (
    continente character varying,
    region character varying,
    pais character varying,
    capital character varying,
    poblacion integer,
    hospedaje_costos double precision,
    comida_costos double precision,
    transporte_costos double precision,
    entretenimiento_costos double precision,
    precio_big_mac_usd double precision,
    costo_bajo_hospedaje double precision,
    costo_promedio_comida double precision,
    costo_bajo_transporte double precision,
    costo_promedio_entretenimiento double precision,
    tasa_de_envejecimiento double precision
);


ALTER TABLE public.analysis OWNER TO postgres;

--
-- TOC entry 4775 (class 0 OID 136111)
-- Dependencies: 215
-- Data for Name: analysis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analysis (continente, region, pais, capital, poblacion, hospedaje_costos, comida_costos, transporte_costos, entretenimiento_costos, precio_big_mac_usd, costo_bajo_hospedaje, costo_promedio_comida, costo_bajo_transporte, costo_promedio_entretenimiento, tasa_de_envejecimiento) FROM stdin;
Africa	Africa Oriental	Ruanda	Kigali	12952218	11	17	25	45	2.96	7	17	17	45	6.3
Africa	Africa Oriental	Ruanda	Kigali	12952218	11	17	25	45	2.96	7	17	17	45	6.3
Africa	Africa Austral	Namibia	Windhoek	2540905	12	25	16	14	2.28	8	25	11	14	24.39
Africa	Africa Austral	Namibia	Windhoek	2540905	12	25	16	14	2.28	8	25	11	14	24.39
Africa	Africa Austral	Mozambique	Maputo	31255435	14	41	13	32	2.53	9	41	9	32	12.14
Africa	Africa Austral	Mozambique	Maputo	31255435	14	41	13	32	2.53	9	41	9	32	12.14
Africa	Africa Central	Camerun	Yaunde	26545863	13	18	38	43	4.2	9	18	26	43	5.93
Africa	Africa Central	Camerun	Yaunde	26545863	13	18	38	43	4.2	9	18	26	43	5.93
Africa	Africa Central	Angola	Luanda	32866272	13	30	22	45	3.39	9	30	15	45	6.16
Africa	Africa Central	Angola	Luanda	32866272	13	30	22	45	3.39	9	30	15	45	6.16
Asia	Asia Meridional	Nepal	Katmandu	29136808	15	21	53	57	2.61	10	21	37	57	6.27
Asia	Asia Meridional	Nepal	Katmandu	29136808	15	21	53	57	2.61	10	21	37	57	6.27
Africa	Africa Oriental	Tanzania	Dodoma	59734218	16	18	42	17	2.42	11	18	29	17	20.5
Africa	Africa Oriental	Tanzania	Dodoma	59734218	16	18	42	17	2.42	11	18	29	17	20.5
Asia	Asia Occidental	Iran	Teheran	83992949	16	53	54	26	1.62	11	53	37	26	5.41
Asia	Asia Occidental	Iran	Teheran	83992949	16	53	54	26	1.62	11	53	37	26	5.41
Africa	Africa Austral	Zambia	Lusaka	18383955	19	14	35	45	1.76	13	14	24	45	6.95
Africa	Africa Austral	Zambia	Lusaka	18383955	19	14	35	45	1.76	13	14	24	45	6.95
Asia	Asia Oriental	Japon	Tokio	126476461	20	17	60	23	6.45	14	17	42	23	22.32
Asia	Asia Oriental	Japon	Tokio	126476461	20	17	60	23	6.45	14	17	42	23	22.32
America	America Central	Guatemala	Ciudad de Guatemala	17915568	21	72	50	63	2.83	14	72	35	63	6.48
America	America Central	Guatemala	Ciudad de Guatemala	17915568	21	72	50	63	2.83	14	72	35	63	6.48
Africa	Africa Oriental	Etiopia	Adis Abeba	114963588	24	12	30	28	6.38	16	12	21	28	11.08
Africa	Africa Oriental	Etiopia	Adis Abeba	114963588	24	12	30	28	6.38	16	12	21	28	11.08
Africa	Africa Oriental	Uganda	Kampala	45741007	23	36	38	33	3.14	16	36	26	33	17.02
Africa	Africa Oriental	Uganda	Kampala	45741007	23	36	38	33	3.14	16	36	26	33	17.02
America	America Central	Costa Rica	San Jose	5094118	24	31	21	35	1.83	16	31	14	35	5.69
America	America Central	Costa Rica	San Jose	5094118	24	31	21	35	1.83	16	31	14	35	5.69
America	America del Sur	Paraguay	Asuncion	7132530	24	68	28	21	4.54	16	68	19	21	5.51
America	America del Sur	Paraguay	Asuncion	7132530	24	68	28	21	4.54	16	68	19	21	5.51
America	America del Sur	Peru	Lima	32971854	23	63	69	56	2.81	16	63	48	56	24.74
America	America del Sur	Peru	Lima	32971854	23	63	69	56	2.81	16	63	48	56	24.74
Asia	Asia Meridional	Pakistan	Islamabad	220892340	23	25	38	60	2.81	16	25	26	60	15.17
Asia	Asia Meridional	Pakistan	Islamabad	220892340	23	25	38	60	2.81	16	25	26	60	15.17
Africa	Africa del Norte	Tunez	Tunez	11818619	26	37	17	26	5.54	18	37	11	26	15.4
Africa	Africa del Norte	Tunez	Tunez	11818619	26	37	17	26	5.54	18	37	11	26	15.4
America	America del Sur	Venezuela	Caracas	28435940	27	49	39	69	1.54	18	49	27	69	23.98
America	America del Sur	Venezuela	Caracas	28435940	27	49	39	69	1.54	18	49	27	69	23.98
Africa	Africa Occidental	Ghana	Accra	31072940	28	31	33	25	2.13	19	31	23	25	18.25
Africa	Africa Occidental	Ghana	Accra	31072940	28	31	33	25	2.13	19	31	23	25	18.25
Asia	Sudeste Asiatico	Filipinas	Manila	109581078	28	44	46	25	2.13	19	44	32	25	12.77
Asia	Sudeste Asiatico	Filipinas	Manila	109581078	28	44	46	25	2.13	19	44	32	25	12.77
Africa	Africa del Norte	Marruecos	Rabat	36910560	29	22	31	35	6.31	20	22	21	35	22.74
Africa	Africa del Norte	Marruecos	Rabat	36910560	29	22	31	35	6.31	20	22	21	35	22.74
America	America del Sur	Colombia	Bogota	50882891	29	60	49	25	4.18	20	60	34	25	20.7
America	America del Sur	Colombia	Bogota	50882891	29	60	49	25	4.18	20	60	34	25	20.7
Africa	Africa Occidental	Costa de Marfil	Yamusukro	26378274	29	30	10	31	3.99	20	30	7	31	5.63
Africa	Africa Occidental	Costa de Marfil	Yamusukro	26378274	29	30	10	31	3.99	20	30	7	31	5.63
Europa	Western Europe	Luxembourg	Luxembourg	634814	30.24	46.44	16.2	17.28	6.7	20.52	46.44	10.8	17.28	21.04
Europa	Western Europe	Luxembourg	Luxembourg	634814	30.24	46.44	16.2	17.28	6.7	20.52	46.44	10.8	17.28	21.04
Africa	Africa Austral	Sudafrica	Pretoria	59308690	30	20	37	43	5.84	21	20	25	43	16.97
Africa	Africa Austral	Sudafrica	Pretoria	59308690	30	20	37	43	5.84	21	20	25	43	16.97
Asia	Asia Occidental	Arabia Saudita	Riad	34813871	32	43	28	22	4.3	22	43	19	22	11.09
Asia	Asia Occidental	Arabia Saudita	Riad	34813871	32	43	28	22	4.3	22	43	19	22	11.09
Europa	Southern Europe	San Marino	San Marino	33938	33.48	41.04	20.52	20.52	7.47	22.68	41.04	14.04	20.52	6.77
Europa	Southern Europe	San Marino	San Marino	33938	33.48	41.04	20.52	20.52	7.47	22.68	41.04	14.04	20.52	6.77
Europa	Eastern Europe	Moldova	Chisinau	2640438	32.4	33.48	7.56	18.36	2.61	22.68	33.48	4.32	18.36	19.59
Europa	Eastern Europe	Moldova	Chisinau	2640438	32.4	33.48	7.56	18.36	2.61	22.68	33.48	4.32	18.36	19.59
America	America del Norte	Estados Unidos	Washington D. C.	331002651	33	43	28	21	4.46	23	43	19	21	24.4
America	America del Norte	Estados Unidos	Washington D. C.	331002651	33	43	28	21	4.46	23	43	19	21	24.4
Asia	Asia Central	Uzbekistan	Taskent	33469203	33	54	26	22	5.43	23	54	18	22	16.85
Asia	Asia Central	Uzbekistan	Taskent	33469203	33	54	26	22	5.43	23	54	18	22	16.85
Africa	Africa Occidental	Senegal	Dakar	16743927	34	36	44	32	7.3	23	36	30	32	19.14
Africa	Africa Occidental	Senegal	Dakar	16743927	34	36	44	32	7.3	23	36	30	32	19.14
Asia	Sudeste Asiatico	Tailandia	Bangkok	69799978	35	22	44	59	6.78	24	22	30	59	5.9
Asia	Sudeste Asiatico	Tailandia	Bangkok	69799978	35	22	44	59	6.78	24	22	30	59	5.9
Asia	Asia Oriental	Corea del Sur	Seul	51269185	35	28	21	18	6.02	24	28	14	18	19.16
Asia	Asia Oriental	Corea del Sur	Seul	51269185	35	28	21	18	6.02	24	28	14	18	19.16
Europa	Northern Europe	Denmark	Copenhagen	5831404	35.64	34.56	7.56	14.04	2.01	24.84	34.56	4.32	14.04	9.25
Europa	Northern Europe	Denmark	Copenhagen	5831404	35.64	34.56	7.56	14.04	2.01	24.84	34.56	4.32	14.04	9.25
Europa	Eastern Europe	Czech Republic	Prague	10708981	35.64	37.8	19.44	17.28	5.34	24.84	37.8	12.96	17.28	16.23
Europa	Eastern Europe	Czech Republic	Prague	10708981	35.64	37.8	19.44	17.28	5.34	24.84	37.8	12.96	17.28	16.23
Europa	Southern Europe	Slovenia	Ljubljana	2100126	35.64	52.92	10.8	32.4	5.92	24.84	52.92	7.56	32.4	8.7
Europa	Southern Europe	Slovenia	Ljubljana	2100126	35.64	52.92	10.8	32.4	5.92	24.84	52.92	7.56	32.4	8.7
Europa	Northern Europe	United Kingdom	London	67215293	35.64	52.92	17.28	25.92	4.89	24.84	52.92	11.88	25.92	21.17
Europa	Northern Europe	United Kingdom	London	67215293	35.64	52.92	17.28	25.92	4.89	24.84	52.92	11.88	25.92	21.17
Europa	Southern Europe	Andorra	Andorra la Vella	79824	36.72	27	6.48	31.32	2.08	24.84	27	4.32	31.32	14.88
Europa	Southern Europe	Andorra	Andorra la Vella	79824	36.72	27	6.48	31.32	2.08	24.84	27	4.32	31.32	14.88
Asia	Sudeste Asiatico	Malasia	Kuala Lumpur	32365999	36	23	42	58	4.19	25	23	29	58	14.9
Asia	Sudeste Asiatico	Malasia	Kuala Lumpur	32365999	36	23	42	58	4.19	25	23	29	58	14.9
Europa	Western Europe	Switzerland	Bern	8654622	37.8	33.48	15.12	10.8	2.46	25.92	33.48	9.72	10.8	19.58
Europa	Western Europe	Switzerland	Bern	8654622	37.8	33.48	15.12	10.8	2.46	25.92	33.48	9.72	10.8	19.58
Asia	Asia Occidental	Jordania	Aman	10203134	38	48	19	53	5.47	26	48	13	53	7.44
Asia	Asia Occidental	Jordania	Aman	10203134	38	48	19	53	5.47	26	48	13	53	7.44
Africa	Africa del Norte	Egipto	El Cairo	102334404	38	10	42	33	2.94	26	10	29	33	11.5
Africa	Africa del Norte	Egipto	El Cairo	102334404	38	10	42	33	2.94	26	10	29	33	11.5
America	America del Sur	Uruguay	Montevideo	3473730	39	44	60	59	2.15	27	44	42	59	11.22
America	America del Sur	Uruguay	Montevideo	3473730	39	44	60	59	2.15	27	44	42	59	11.22
Africa	Africa Occidental	Nigeria	Abuja	206139589	41	22	22	28	4.98	28	22	15	28	23.79
Africa	Africa Occidental	Nigeria	Abuja	206139589	41	22	22	28	4.98	28	22	15	28	23.79
Asia	Asia Oriental	China	Pekin	1402112000	41	30	31	63	5.47	28	30	21	63	13.55
Asia	Asia Oriental	China	Pekin	1402112000	41	30	31	63	5.47	28	30	21	63	13.55
Africa	Africa Occidental	Mali	Bamako	20250833	41	38	35	28	6.92	28	38	24	28	11.62
Africa	Africa Occidental	Mali	Bamako	20250833	41	38	35	28	6.92	28	38	24	28	11.62
Asia	Sudeste Asiatico	Indonesia	Yakarta	273523615	40	60	17	40	4.8	28	60	11	40	15.93
Asia	Sudeste Asiatico	Indonesia	Yakarta	273523615	40	60	17	40	4.8	28	60	11	40	15.93
Asia	Asia Occidental	Turquia	Ankara	84339067	40	35	69	36	7.25	28	35	48	36	10.62
Asia	Asia Occidental	Turquia	Ankara	84339067	40	35	69	36	7.25	28	35	48	36	10.62
America	America Central	El Salvador	San Salvador	6486205	40	60	44	23	2.32	28	60	30	23	12.17
America	America Central	El Salvador	San Salvador	6486205	40	60	44	23	2.32	28	60	30	23	12.17
America	Caribe	Cuba	La Habana	11326616	40	57	38	31	2.64	28	57	26	31	21.65
America	Caribe	Cuba	La Habana	11326616	40	57	38	31	2.64	28	57	26	31	21.65
America	America del Sur	Argentina	Buenos Aires	45195774	40	43	20	34	4.84	28	43	14	34	8.67
America	America del Sur	Argentina	Buenos Aires	45195774	40	43	20	34	4.84	28	43	14	34	8.67
Europa	Eastern Europe	Romania	Bucharest	19121610	41.04	27	21.6	22.68	1.69	28.08	27	15.12	22.68	24.01
Europa	Eastern Europe	Romania	Bucharest	19121610	41.04	27	21.6	22.68	1.69	28.08	27	15.12	22.68	24.01
Africa	Africa Oriental	Kenia	Nairobi	53771296	42	22	32	34	4.24	29	22	22	34	23.44
Africa	Africa Oriental	Kenia	Nairobi	53771296	42	22	32	34	4.24	29	22	22	34	23.44
Europa	Southern Europe	Spain	Madrid	47351567	42.12	45.36	14.04	32.4	4.02	29.16	45.36	9.72	32.4	22.9
Europa	Southern Europe	Spain	Madrid	47351567	42.12	45.36	14.04	32.4	4.02	29.16	45.36	9.72	32.4	22.9
America	America Central	Panama	Ciudad de Panama	4314767	44	70	68	37	6.93	30	70	47	37	17.15
America	America Central	Panama	Ciudad de Panama	4314767	44	70	68	37	6.93	30	70	47	37	17.15
Africa	Africa del Norte	Argelia	Argel	43851044	45	41	41	28	5.08	31	41	28	28	20.22
Africa	Africa del Norte	Argelia	Argel	43851044	45	41	41	28	5.08	31	41	28	28	20.22
America	America del Sur	Ecuador	Quito	17643060	45	48	42	59	2.9	31	48	29	59	9.99
America	America del Sur	Ecuador	Quito	17643060	45	48	42	59	2.9	31	48	29	59	9.99
Europa	Southern Europe	Portugal	Lisbon	10295909	47.52	27	21.6	15.12	1.87	32.4	27	15.12	15.12	10.84
Europa	Southern Europe	Portugal	Lisbon	10295909	47.52	27	21.6	15.12	1.87	32.4	27	15.12	15.12	10.84
Europa	Southern Europe	Greece	Athens	10724599	46.44	22.68	9.72	10.8	3.77	32.4	22.68	6.48	10.8	8.92
Europa	Southern Europe	Greece	Athens	10724599	46.44	22.68	9.72	10.8	3.77	32.4	22.68	6.48	10.8	8.92
Europa	Southern Europe	Serbia	Belgrade	6640000	47.52	33.48	17.28	29.16	1.77	32.4	33.48	11.88	29.16	5.11
Europa	Southern Europe	Serbia	Belgrade	6640000	47.52	33.48	17.28	29.16	1.77	32.4	33.48	11.88	29.16	5.11
Europa	Western Europe	Liechtenstein	Vaduz	38910	47.52	22.68	16.2	19.44	1.88	32.4	22.68	10.8	19.44	13.64
Europa	Western Europe	Liechtenstein	Vaduz	38910	47.52	22.68	16.2	19.44	1.88	32.4	22.68	10.8	19.44	13.64
Asia	Sudeste Asiatico	Singapur	Singapur	5850342	48	24	20	46	1.63	33	24	14	46	10.18
Asia	Sudeste Asiatico	Singapur	Singapur	5850342	48	24	20	46	1.63	33	24	14	46	10.18
Europa	Eastern Europe	Belarus	Minsk	9398861	49.68	54	20.52	23.76	4.55	34.56	54	14.04	23.76	10.82
Europa	Eastern Europe	Belarus	Minsk	9398861	49.68	54	20.52	23.76	4.55	34.56	54	14.04	23.76	10.82
Europa	Northern Europe	Sweden	Stockholm	10327589	49.68	24.84	14.04	27	6.42	34.56	24.84	9.72	27	14.44
Europa	Northern Europe	Sweden	Stockholm	10327589	49.68	24.84	14.04	27	6.42	34.56	24.84	9.72	27	14.44
Asia	Asia Central	Kazajistan	Nursultan	18776707	50	33	59	60	7.4	35	33	41	60	10.43
Asia	Asia Central	Kazajistan	Nursultan	18776707	50	33	59	60	7.4	35	33	41	60	10.43
Europa	Eastern Europe	Poland	Warsaw	38386000	51.84	46.44	8.64	20.52	3.82	35.64	46.44	5.4	20.52	17.75
Europa	Eastern Europe	Poland	Warsaw	38386000	51.84	46.44	8.64	20.52	3.82	35.64	46.44	5.4	20.52	17.75
Europa	Eastern Europe	Slovakia	Bratislava	5458827	51.84	25.92	20.52	19.44	2.56	35.64	25.92	14.04	19.44	8.12
Europa	Eastern Europe	Slovakia	Bratislava	5458827	51.84	25.92	20.52	19.44	2.56	35.64	25.92	14.04	19.44	8.12
Europa	Southern Europe	Malta	Valletta	514564	52.92	47.52	20.52	24.84	2.01	36.72	47.52	14.04	24.84	8.41
Europa	Southern Europe	Malta	Valletta	514564	52.92	47.52	20.52	24.84	2.01	36.72	47.52	14.04	24.84	8.41
Europa	Eastern Europe	Ukraine	Kyiv	41415000	52.92	45.36	8.64	32.4	2.05	36.72	45.36	5.4	32.4	21.31
Europa	Eastern Europe	Ukraine	Kyiv	41415000	52.92	45.36	8.64	32.4	2.05	36.72	45.36	5.4	32.4	21.31
America	America del Sur	Brasil	Brasilia	212559417	53	20	33	48	2.93	37	20	23	48	23.19
America	America del Sur	Brasil	Brasilia	212559417	53	20	33	48	2.93	37	20	23	48	23.19
America	Caribe	Republica Dominicana	Santo Domingo	10847910	53	31	31	29	3.38	37	31	21	29	6.49
America	Caribe	Republica Dominicana	Santo Domingo	10847910	53	31	31	29	3.38	37	31	21	29	6.49
Europa	Western Europe	Austria	Vienna	8917205	55.08	37.8	12.96	30.24	5.55	37.8	37.8	8.64	30.24	8.99
Europa	Western Europe	Austria	Vienna	8917205	55.08	37.8	12.96	30.24	5.55	37.8	37.8	8.64	30.24	8.99
Asia	Asia Meridional	Banglades	Daca	164689383	56	61	67	36	3.53	39	61	46	36	20.43
Asia	Asia Meridional	Banglades	Daca	164689383	56	61	67	36	3.53	39	61	46	36	20.43
America	America del Sur	Bolivia	La Paz	11673029	56	70	68	53	5.92	39	70	47	53	7.32
America	America del Sur	Bolivia	La Paz	11673029	56	70	68	53	5.92	39	70	47	53	7.32
America	America del Sur	Chile	Santiago	19116201	57	47	74	58	6.64	39	47	51	58	15.5
America	America del Sur	Chile	Santiago	19116201	57	47	74	58	6.64	39	47	51	58	15.5
Europa	Southern Europe	Cyprus	Nicosia	1207359	58.32	45.36	15.12	12.96	6.46	39.96	45.36	9.72	12.96	15.45
Europa	Southern Europe	Cyprus	Nicosia	1207359	58.32	45.36	15.12	12.96	6.46	39.96	45.36	9.72	12.96	15.45
Europa	Northern Europe	Lithuania	Vilnius	2794700	57.24	35.64	14.04	27	3.95	39.96	35.64	9.72	27	13.8
Europa	Northern Europe	Lithuania	Vilnius	2794700	57.24	35.64	14.04	27	3.95	39.96	35.64	9.72	27	13.8
Europa	Western Europe	Monaco	Monaco	39242	57.24	17.28	19.44	20.52	3.32	39.96	17.28	12.96	20.52	20.42
Europa	Western Europe	Monaco	Monaco	39242	57.24	17.28	19.44	20.52	3.32	39.96	17.28	12.96	20.52	20.42
Europa	Northern Europe	Iceland	Reykjavik	372520	58.32	17.28	14.04	10.8	2.74	39.96	17.28	9.72	10.8	20.44
Europa	Northern Europe	Iceland	Reykjavik	372520	58.32	17.28	14.04	10.8	2.74	39.96	17.28	9.72	10.8	20.44
Europa	Southern Europe	Italy	Rome	59554023	59.4	19.44	15.12	32.4	7.33	41.04	19.44	9.72	32.4	16.96
Europa	Southern Europe	Italy	Rome	59554023	59.4	19.44	15.12	32.4	7.33	41.04	19.44	9.72	32.4	16.96
America	America Central	Honduras	Tegucigalpa	9904608	60	33	39	36	3.24	42	33	27	36	23.15
America	America Central	Honduras	Tegucigalpa	9904608	60	33	39	36	3.24	42	33	27	36	23.15
Europa	Southern Europe	Croatia	Zagreb	3854279	62.64	47.52	21.6	18.36	7.02	43.2	47.52	15.12	18.36	11.29
Europa	Southern Europe	Croatia	Zagreb	3854279	62.64	47.52	21.6	18.36	7.02	43.2	47.52	15.12	18.36	11.29
Europa	Southern Europe	North Macedonia	Skopje	2083821	63.72	42.12	14.04	22.68	1.51	44.28	42.12	9.72	22.68	7.79
Europa	Southern Europe	North Macedonia	Skopje	2083821	63.72	42.12	14.04	22.68	1.51	44.28	42.12	9.72	22.68	7.79
Europa	Western Europe	France	Paris	67391582	64.8	28.08	6.48	23.76	4.29	45.36	28.08	4.32	23.76	17.73
Europa	Western Europe	France	Paris	67391582	64.8	28.08	6.48	23.76	4.29	45.36	28.08	4.32	23.76	17.73
Europa	Eastern Europe	Hungary	Budapest	9606259	65.88	21.6	17.28	19.44	5.81	45.36	21.6	11.88	19.44	8.12
Europa	Eastern Europe	Hungary	Budapest	9606259	65.88	21.6	17.28	19.44	5.81	45.36	21.6	11.88	19.44	8.12
America	America del Norte	Mexico	Ciudad de Mexico	128932753	67	57	44	37	6.7	46	57	30	37	8.64
America	America del Norte	Mexico	Ciudad de Mexico	128932753	67	57	44	37	6.7	46	57	30	37	8.64
Europa	Northern Europe	Latvia	Riga	1867231	68.04	52.92	6.48	10.8	1.77	47.52	52.92	4.32	10.8	12.49
Europa	Northern Europe	Latvia	Riga	1867231	68.04	52.92	6.48	10.8	1.77	47.52	52.92	4.32	10.8	12.49
Asia	Asia Occidental	Israel	Jerusalen	8655535	69	15	43	27	2.79	48	15	30	27	21.57
Asia	Asia Occidental	Israel	Jerusalen	8655535	69	15	43	27	2.79	48	15	30	27	21.57
Europa	Western Europe	Germany	Berlin	83149300	70.2	16.2	11.88	30.24	5.62	48.6	16.2	7.56	30.24	7.39
Europa	Western Europe	Germany	Berlin	83149300	70.2	16.2	11.88	30.24	5.62	48.6	16.2	7.56	30.24	7.39
Asia	Asia Meridional	India	Nueva Delhi	1380004385	70	60	21	38	6.61	49	60	14	38	11.23
Asia	Asia Meridional	India	Nueva Delhi	1380004385	70	60	21	38	6.61	49	60	14	38	11.23
America	America del Norte	Canada	Ottawa	37742154	71	74	34	40	4.52	49	74	23	40	14.12
America	America del Norte	Canada	Ottawa	37742154	71	74	34	40	4.52	49	74	23	40	14.12
Asia	Sudeste Asiatico	Vietnam	Hanoi	97338579	70	43	19	40	4.25	49	43	13	40	11.51
Asia	Sudeste Asiatico	Vietnam	Hanoi	97338579	70	43	19	40	4.25	49	43	13	40	11.51
Europa	Southern Europe	Montenegro	Podgorica	621718	73.44	35.64	7.56	10.8	2.82	50.76	35.64	4.32	10.8	24.31
Europa	Southern Europe	Montenegro	Podgorica	621718	73.44	35.64	7.56	10.8	2.82	50.76	35.64	4.32	10.8	24.31
Europa	Northern Europe	Estonia	Tallinn	1326535	74.52	37.8	17.28	25.92	7.08	51.84	37.8	11.88	25.92	15.28
Europa	Northern Europe	Estonia	Tallinn	1326535	74.52	37.8	17.28	25.92	7.08	51.84	37.8	11.88	25.92	15.28
Europa	Southern Europe	Kosovo	Pristina	1800000	76.68	45.36	17.28	17.28	5.96	52.92	45.36	11.88	17.28	19.64
Europa	Southern Europe	Kosovo	Pristina	1800000	76.68	45.36	17.28	17.28	5.96	52.92	45.36	11.88	17.28	19.64
Europa	Southern Europe	Vatican City	Vatican City	825	77.76	49.68	11.88	14.04	4.52	54	49.68	7.56	14.04	18.68
Europa	Southern Europe	Vatican City	Vatican City	825	77.76	49.68	11.88	14.04	4.52	54	49.68	7.56	14.04	18.68
Europa	Eastern Europe	Russia	Moscow	144104080	78.84	16.2	10.8	15.12	2.66	55.08	16.2	7.56	15.12	8.97
Europa	Eastern Europe	Russia	Moscow	144104080	78.84	16.2	10.8	15.12	2.66	55.08	16.2	7.56	15.12	8.97
Europa	Western Europe	Belgium	Brussels	11589623	78.84	16.2	7.56	14.04	4.66	55.08	16.2	4.32	14.04	15.85
Europa	Western Europe	Belgium	Brussels	11589623	78.84	16.2	7.56	14.04	4.66	55.08	16.2	4.32	14.04	15.85
Europa	Southern Europe	Bosnia and Herzegovina	Sarajevo	3280819	78.84	27	7.56	28.08	6.22	55.08	27	4.32	28.08	17.47
Europa	Southern Europe	Bosnia and Herzegovina	Sarajevo	3280819	78.84	27	7.56	28.08	6.22	55.08	27	4.32	28.08	17.47
Europa	Northern Europe	Finland	Helsinki	5540720	81	16.2	9.72	19.44	1.61	56.16	16.2	6.48	19.44	12.33
Europa	Northern Europe	Finland	Helsinki	5540720	81	16.2	9.72	19.44	1.61	56.16	16.2	6.48	19.44	12.33
Europa	Southern Europe	Albania	Tirana	2877797	84.24	43.2	8.64	20.52	5.79	58.32	43.2	5.4	20.52	17.24
Europa	Southern Europe	Albania	Tirana	2877797	84.24	43.2	8.64	20.52	5.79	58.32	43.2	5.4	20.52	17.24
Europa	Eastern Europe	Bulgaria	Sofia	6844597	84.24	47.52	8.64	21.6	3.13	58.32	47.52	5.4	21.6	7.16
Europa	Eastern Europe	Bulgaria	Sofia	6844597	84.24	47.52	8.64	21.6	3.13	58.32	47.52	5.4	21.6	7.16
Europa	Western Europe	Netherlands	Amsterdam	17441139	85.32	37.8	7.56	17.28	2.52	59.4	37.8	4.32	17.28	19.26
Europa	Western Europe	Netherlands	Amsterdam	17441139	85.32	37.8	7.56	17.28	2.52	59.4	37.8	4.32	17.28	19.26
Europa	Northern Europe	Ireland	Dublin	4994724	85.32	50.76	17.28	17.28	4.07	59.4	50.76	11.88	17.28	22.26
Europa	Northern Europe	Ireland	Dublin	4994724	85.32	50.76	17.28	17.28	4.07	59.4	50.76	11.88	17.28	22.26
Europa	Northern Europe	Norway	Oslo	5421241	95.04	22.68	12.96	29.16	4.52	65.88	22.68	8.64	29.16	7.82
Europa	Northern Europe	Norway	Oslo	5421241	95.04	22.68	12.96	29.16	4.52	65.88	22.68	8.64	29.16	7.82
\.


-- Completed on 2025-04-02 08:34:54

--
-- PostgreSQL database dump complete
--

