DROP TABLE IF EXISTS "public"."trades";
-- Table Definition
CREATE TABLE "public"."trades" (
    "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "traderID" varchar(16),
    "lookingfor" varchar(64),
    "tradingwith" varchar(64),
    "status" varchar(16) DEFAULT 'PENDING'::character varying,
    "lookingforID" varchar(8) NOT NULL DEFAULT '0'::character varying,
    "tradingwithID" varchar(8) NOT NULL DEFAULT '0'::character varying,
    PRIMARY KEY ("uuid"),
    FOREIGN KEY ("traderID") REFERENCES "public"."auth"("gameid"
);

