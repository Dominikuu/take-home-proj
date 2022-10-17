BEGIN TRANSACTION;

CREATE TABLE "salary" (
    id uuid primary key default gen_random_uuid(),
    timestamp TEXT,
    employer TEXT,
    job_title TEXT,
    year_employer INT,
    year_exp INT,
    base_pay BIGINT,
    signing_bonus BIGINT,
    annaul_bonus BIGINT,
    annual_stock DECIMAL,
    sex TEXT
);
COMMIT;