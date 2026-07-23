ALTER TABLE lab_request
    ADD COLUMN IF NOT EXISTS request_reference varchar(50),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS uq_lab_request_reference
    ON lab_request(request_reference)
    WHERE request_reference IS NOT NULL;
