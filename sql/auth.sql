DROP TABLE IF EXISTS "public"."auth";
-- Table Definition
CREATE TABLE "public"."auth" (
    "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "email" varchar(50) NOT NULL,
    "name" varchar(50) NOT NULL,
    "hash" text NOT NULL,
    "gameid" varchar(16) NOT NULL,
    "role" varchar(8) NOT NULL DEFAULT 'user'::character varying,
    PRIMARY KEY ("uuid")
);


