-- Seed data with a fake user for testing

COPY salary(timestamp, employer, job_title, year_employer, year_exp, base_pay, signing_bonus, annaul_bonus, annual_stock, sex) FROM '/docker-entrypoint-initdb.d/seed/dummy.csv' DELIMITER ',' CSV HEADER
