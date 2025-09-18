DROP TABLE IF EXISTS "public"."trades";
-- Table Definition
CREATE TABLE "public"."trades" (
    "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "traderID" varchar(16),
    "traderUUID" uuid,
    "tradeeID" varchar(16),
    "tradeeUUID" uuid,
    "lookingfor" varchar(64),
    "tradingwith" varchar(64),
    "status" varchar(32),
    "lookingforID" varchar(16),
    "tradingwithID" varchar(16),
    PRIMARY KEY ("uuid"),
    FOREIGN KEY ("traderUUID") REFERENCES "public"."auth"("uuid"),
    FOREIGN KEY ("tradeeUUID") REFERENCES "public"."auth"("uuid")
);



